import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const QuantumBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.03);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. DNA Particles Geometry Setup
    const particleCount = window.innerWidth < 768 ? 500 : 2000; // Reduce for mobile as requested
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorGreen = new THREE.Color('#00FF9D');
    const colorCyan = new THREE.Color('#00FFFF');
    const colorPink = new THREE.Color('#FF2E63');

    // Generate DNA double helix spiral
    for (let i = 0; i < particleCount; i++) {
      // Divide particles into 2 strands
      const strand = i % 2 === 0 ? 0 : 1;
      const t = (i / particleCount) * Math.PI * 14; // Spiral length
      const radius = 3.5;
      const angle = t + (strand === 1 ? Math.PI : 0);

      // Coordinates
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.4;
      const y = (i - particleCount / 2) * (30 / particleCount) + (Math.random() - 0.5) * 0.4;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.4;

      // Set positions
      const i3 = i * 3;
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Keep record of original positions for reforming after click
      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Initial velocities for scattering
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Color (Default Green)
      colors[i3] = colorGreen.r;
      colors[i3 + 1] = colorGreen.g;
      colors[i3 + 2] = colorGreen.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // 3. Particle Material
    // Create a circular particle texture dynamically
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: particleTexture,
      frustumCulled: true // Frustum culling ON
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 4. Interaction Variables
    let scrollY = window.scrollY;
    let scrollDelta = 0;
    let targetSize = 0.28;
    let scatterProgress = 0; // 0 = stable DNA, 1 = maximum scatter
    let scatterTimer = 0;

    // Listen to scroll events
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      scrollDelta = currentScroll - scrollY;
      scrollY = currentScroll;

      // Scroll color interpolation
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0;

      const colorsAttr = geometry.attributes.color;
      const tempColor = new THREE.Color();

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Interpolate Green -> Cyan -> Pink based on scroll depth
        if (scrollPercent < 0.5) {
          tempColor.copy(colorGreen).lerp(colorCyan, scrollPercent * 2);
        } else {
          tempColor.copy(colorCyan).lerp(colorPink, (scrollPercent - 0.5) * 2);
        }
        colorsAttr.array[i3] = tempColor.r;
        colorsAttr.array[i3 + 1] = tempColor.g;
        colorsAttr.array[i3 + 2] = tempColor.b;
      }
      colorsAttr.needsUpdate = true;
    };

    window.addEventListener('scroll', handleScroll);

    // Click to scatter particles radially
    const handleClick = () => {
      scatterProgress = 1;
      scatterTimer = 120; // 2 seconds at 60fps

      const posAttr = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = posAttr.array[i3];
        const y = posAttr.array[i3 + 1];
        const z = posAttr.array[i3 + 2];

        // Radial direction vector from center
        const length = Math.sqrt(x * x + y * y + z * z) || 1;
        const dirX = x / length;
        const dirY = y / length;
        const dirZ = z / length;

        // Set high scattering velocities
        velocities[i3] = dirX * (Math.random() * 0.4 + 0.2);
        velocities[i3 + 1] = dirY * (Math.random() * 0.4 + 0.2);
        velocities[i3 + 2] = dirZ * (Math.random() * 0.4 + 0.2);
      }
    };

    containerRef.current.addEventListener('click', handleClick);

    // 5. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Dynamic particle sizing based on scroll velocity
      targetSize = 0.25 + Math.min(Math.abs(scrollDelta) * 0.02, 1.2);
      // Decay scroll delta
      scrollDelta *= 0.92;
      // Smooth lerp size
      material.size += (targetSize - material.size) * 0.1;

      // Slow rotation
      particleSystem.rotation.y = elapsedTime * 0.08;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.05) * 0.1;

      const posAttr = geometry.attributes.position;

      // Handle scattering & reforming physics
      if (scatterProgress > 0) {
        scatterTimer--;
        if (scatterTimer <= 0) {
          scatterProgress = 0;
        } else {
          // Slowly decay scatterProgress back to 0 over 2 seconds
          scatterProgress = scatterTimer / 120;
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        if (scatterProgress > 0) {
          // Apply velocities to scatter outwards
          posAttr.array[i3] += velocities[i3];
          posAttr.array[i3 + 1] += velocities[i3 + 1];
          posAttr.array[i3 + 2] += velocities[i3 + 2];

          // Slowly pull back to original coordinates using spring/lerp
          const ox = originalPositions[i3];
          const oy = originalPositions[i3 + 1];
          const oz = originalPositions[i3 + 2];

          // Lerp back as scatterProgress decays
          const pullStrength = (1 - scatterProgress) * 0.15;
          posAttr.array[i3] += (ox - posAttr.array[i3]) * pullStrength;
          posAttr.array[i3 + 1] += (oy - posAttr.array[i3 + 1]) * pullStrength;
          posAttr.array[i3 + 2] += (oz - posAttr.array[i3 + 2]) * pullStrength;

          // Damp velocity
          velocities[i3] *= 0.95;
          velocities[i3 + 1] *= 0.95;
          velocities[i3 + 2] *= 0.95;
        } else {
          // Standard motion: subtle zero-gravity wobble
          const angle = elapsedTime * 0.5 + i * 0.1;
          const wobbleX = Math.sin(angle) * 0.01;
          const wobbleY = Math.cos(angle * 0.8) * 0.01;
          const wobbleZ = Math.sin(angle * 1.2) * 0.01;

          posAttr.array[i3] = originalPositions[i3] + wobbleX;
          posAttr.array[i3 + 1] = originalPositions[i3 + 1] + wobbleY;
          posAttr.array[i3 + 2] = originalPositions[i3 + 2] + wobbleZ;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup & Dispose
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: -1, background: '#050816' }}
    />
  );
};

export default QuantumBackground;
