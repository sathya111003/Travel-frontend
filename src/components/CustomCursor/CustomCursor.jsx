import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const trailRefs = useRef([]);
  const [trailDots] = useState(Array(8).fill(0));
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // Hide standard cursor (already handled in CSS, but good safeguard)
    document.body.style.cursor = 'none';

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      setHidden(false);

      // Instantly move the core dot
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: clientX, y: clientY });
      }

      // Smooth lag for the outer ring
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.15,
          ease: 'power2.out'
        });
      }

      // Smooth delay trails
      trailRefs.current.forEach((dot, index) => {
        if (dot) {
          gsap.to(dot, {
            x: clientX,
            y: clientY,
            duration: 0.08 * (index + 1),
            ease: 'power1.out'
          });
        }
      });
    };

    const onMouseLeaveWindow = () => {
      setHidden(true);
    };

    const onMouseEnterWindow = () => {
      setHidden(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeaveWindow);
    document.addEventListener('mouseenter', onMouseEnterWindow);

    // Magnetic elements selector setup
    const updateMagneticHandlers = () => {
      const magneticElements = document.querySelectorAll('.magnetic');
      const hoverTargets = document.querySelectorAll('button, a, .glass-card, input, textarea, select');

      magneticElements.forEach((el) => {
        const handleMouseMove = (e) => {
          const rect = el.getBoundingClientRect();
          const elX = rect.left + rect.width / 2;
          const elY = rect.top + rect.height / 2;
          const deltaX = e.clientX - elX;
          const deltaY = e.clientY - elY;

          // Pull element slightly towards the cursor
          gsap.to(el, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            ease: 'power2.out',
            duration: 0.3
          });
        };

        const handleMouseLeave = () => {
          // Elastic return
          gsap.to(el, {
            x: 0,
            y: 0,
            ease: 'elastic.out(1, 0.4)',
            duration: 0.8
          });
        };

        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('mouseleave', handleMouseLeave);

        // Store cleanups on element
        el._cleanupMagnetic = () => {
          el.removeEventListener('mousemove', handleMouseMove);
          el.removeEventListener('mouseleave', handleMouseLeave);
        };
      });

      // Hover scale ring effect
      hoverTargets.forEach((el) => {
        const handleMouseEnter = () => {
          if (ringRef.current) {
            gsap.to(ringRef.current, {
              scale: 1.5,
              borderColor: '#FF2E63',
              backgroundColor: 'rgba(0, 255, 157, 0.05)',
              duration: 0.2
            });
          }
        };

        const handleMouseLeave = () => {
          if (ringRef.current) {
            gsap.to(ringRef.current, {
              scale: 1,
              borderColor: '#00FF9D',
              backgroundColor: 'transparent',
              duration: 0.2
            });
          }
        };

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);

        el._cleanupHover = () => {
          el.removeEventListener('mouseenter', handleMouseEnter);
          el.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    };

    // Initialize triggers
    updateMagneticHandlers();

    // Re-bind occasionally when DOM changes
    const observer = new MutationObserver(updateMagneticHandlers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      document.removeEventListener('mouseenter', onMouseEnterWindow);
      observer.disconnect();

      // Clean up dynamic handlers
      document.querySelectorAll('.magnetic').forEach((el) => {
        if (el._cleanupMagnetic) el._cleanupMagnetic();
      });
      document.querySelectorAll('button, a, .glass-card, input, textarea, select').forEach((el) => {
        if (el._cleanupHover) el._cleanupHover();
      });
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      {/* 8 Fading trailing dots */}
      {trailDots.map((_, index) => {
        const opacity = 0.5 * (1 - index / trailDots.length);
        const scale = 1 - index / (trailDots.length * 1.5);
        return (
          <div
            key={index}
            ref={(el) => (trailRefs.current[index] = el)}
            className="cursor-trail-dot"
            style={{
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transition: 'opacity 0.1s'
            }}
          />
        );
      })}

      {/* Main outer ring */}
      <div ref={ringRef} className="custom-cursor-ring" style={{ transform: 'translate(-50%, -50%)' }} />

      {/* Core neon green dot */}
      <div ref={dotRef} className="custom-cursor" style={{ transform: 'translate(-50%, -50%)' }} />
    </>
  );
};

export default CustomCursor;
