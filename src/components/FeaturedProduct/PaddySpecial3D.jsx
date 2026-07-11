import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const PaddySpecial3D = () => {
  const containerRef = useRef(null);
  const [isExploded, setIsExploded] = useState(false);

  // Keep references to animate externally
  const explodeFnRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00ff9d, 1.5);
    dirLight1.position.set(2, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff2e63, 0.8);
    dirLight2.position.set(-3, -2, -1);
    scene.add(dirLight2);

    // 3. Materials
    const createSegmentMaterial = (color) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });
    };

    // 4. Create Bottle Segments (3 cylinders stacked together)
    // Combined they form a bottle height 2.4, radius 0.5
    const segHeight = 0.75;
    const topSegGeo = new THREE.CylinderGeometry(0.35, 0.5, segHeight, 32);
    const midSegGeo = new THREE.CylinderGeometry(0.5, 0.5, segHeight, 32);
    const botSegGeo = new THREE.CylinderGeometry(0.5, 0.45, segHeight, 32);

    const topMaterial = createSegmentMaterial('#00FF9D'); // Nitrogen - Green
    const midMaterial = createSegmentMaterial('#00FFFF'); // Phosphorus - Cyan
    const botMaterial = createSegmentMaterial('#FF2E63'); // Potassium - Pink

    const topMesh = new THREE.Mesh(topSegGeo, topMaterial);
    const midMesh = new THREE.Mesh(midSegGeo, midMaterial);
    const botMesh = new THREE.Mesh(botSegGeo, botMaterial);

    // Add wireframe edges for high-tech grid look
    const addWireframe = (mesh, color) => {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: new THREE.Color(color), linewidth: 1 }));
      mesh.add(line);
    };

    addWireframe(topMesh, '#ffffff');
    addWireframe(midMesh, '#ffffff');
    addWireframe(botMesh, '#ffffff');

    // Create a container group for the entire bottle
    const bottleGroup = new THREE.Group();
    bottleGroup.add(topMesh);
    bottleGroup.add(midMesh);
    bottleGroup.add(botMesh);
    scene.add(bottleGroup);

    // Position segments initially (compact)
    topMesh.position.y = segHeight;
    midMesh.position.y = 0;
    botMesh.position.y = -segHeight;

    // 5. Holographic Orbiting Rings (Torus wireframes)
    const ringGeo1 = new THREE.TorusGeometry(1.2, 0.02, 8, 48);
    const ringGeo2 = new THREE.TorusGeometry(1.5, 0.015, 8, 48);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00ff9d, wireframe: true, transparent: true, opacity: 0.6 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xff2e63, wireframe: true, transparent: true, opacity: 0.4 });

    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);

    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.x = Math.PI / 3;

    scene.add(ring1);
    scene.add(ring2);

    // 6. Exploded View Variables (with spring physics)
    let currentExplodeOffset = 0;
    let targetExplodeOffset = 0;
    let explodeSpeed = 0;

    // 7. Click Particle Burst Setup (50 particles)
    const particleCount = 50;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pVelocities = new Float32Array(particleCount * 3);
    
    // Fill initially at center, zero velocity
    for(let i=0; i<particleCount; i++) {
      pPositions[i*3] = 0;
      pPositions[i*3+1] = 0;
      pPositions[i*3+2] = 0;
      pVelocities[i*3] = 0;
      pVelocities[i*3+1] = 0;
      pVelocities[i*3+2] = 0;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, 'rgba(0, 255, 157, 1)');
    pGrad.addColorStop(1, 'rgba(0, 255, 157, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0,0,16,16);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.15,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const explosionPoints = new THREE.Points(pGeo, pMat);
    scene.add(explosionPoints);

    let particleLife = 0;

    const triggerExplosion = () => {
      particleLife = 60; // 1 second lifetime
      const posArr = pGeo.attributes.position.array;
      
      for(let i=0; i<particleCount; i++) {
        const i3 = i * 3;
        // Start from bottle center
        posArr[i3] = 0;
        posArr[i3+1] = 0;
        posArr[i3+2] = 0;

        // Random radial direction
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        pVelocities[i3] = Math.sin(phi) * Math.cos(theta) * 0.15;
        pVelocities[i3+1] = Math.sin(phi) * Math.sin(theta) * 0.15;
        pVelocities[i3+2] = Math.cos(phi) * 0.15;
      }
      pGeo.attributes.position.needsUpdate = true;
    };

    // 8. Interaction Logic
    const toggleExploded = () => {
      setIsExploded((prev) => {
        const next = !prev;
        targetExplodeOffset = next ? 1.0 : 0.0;
        triggerExplosion();
        return next;
      });
    };

    // Expose explosion function for outside trigger
    explodeFnRef.current = (explodeState) => {
      setIsExploded(explodeState);
      targetExplodeOffset = explodeState ? 1.0 : 0.0;
      triggerExplosion();
    };

    // Raycaster for clicking bottle mesh directly
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([topMesh, midMesh, botMesh]);

      if (intersects.length > 0) {
        toggleExploded();
      }
    };

    renderer.domElement.addEventListener('click', onCanvasClick);

    // 9. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Zero-gravity float for the entire bottle group
      bottleGroup.position.y = Math.sin(time * 0.8) * 0.15;
      bottleGroup.rotation.y = time * 0.2;

      // Orbiting rings
      ring1.rotation.y = time * 0.5;
      ring1.rotation.z = Math.sin(time * 0.3) * 0.2;
      ring2.rotation.y = -time * 0.4;
      ring2.rotation.z = Math.cos(time * 0.2) * 0.2;

      // Spring physics calculations for explode offset
      const springStrength = 0.12;
      const damping = 0.8;
      const force = (targetExplodeOffset - currentExplodeOffset) * springStrength;
      explodeSpeed += force;
      explodeSpeed *= damping;
      currentExplodeOffset += explodeSpeed;

      // Apply exploded offsets to bottle segments
      topMesh.position.y = segHeight + currentExplodeOffset * 0.8;
      botMesh.position.y = -segHeight - currentExplodeOffset * 0.8;
      // Fade in/out midMesh opacity slightly to show separation
      midMaterial.opacity = 0.95 - currentExplodeOffset * 0.25;

      // Particle explosion update
      if (particleLife > 0) {
        particleLife--;
        pMat.opacity = particleLife / 60;
        const posArr = pGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          posArr[i3] += pVelocities[i3];
          posArr[i3+1] += pVelocities[i3+1];
          posArr[i3+2] += pVelocities[i3+2];

          // Slow down particles
          pVelocities[i3] *= 0.98;
          pVelocities[i3+1] *= 0.98;
          pVelocities[i3+2] *= 0.98;
        }
        pGeo.attributes.position.needsUpdate = true;
      } else {
        pMat.opacity = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize handler
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

    // 11. Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        renderer.domElement.removeEventListener('click', onCanvasClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }

      topSegGeo.dispose();
      midSegGeo.dispose();
      botSegGeo.dispose();
      topMaterial.dispose();
      midMaterial.dispose();
      botMaterial.dispose();
      ringGeo1.dispose();
      ringGeo2.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      pGeo.dispose();
      pMat.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center">
      {/* Three.js Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-pointer" />

      {/* Exploded View floating text labels */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-500 z-10 font-mono-space ${
          isExploded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Nitrogen Segment Label */}
        <div className="absolute top-[18%] left-[62%] md:left-[65%] border-l-2 border-dashed border-[#00FF9D] pl-3 py-1 text-left">
          <p className="text-[#00FF9D] text-[10px] font-bold uppercase tracking-wider">Layer 1: Nitrogen Fixer</p>
          <p className="text-white text-[12px] font-bold">Azospirillum Culture</p>
        </div>

        {/* Phosphorus Segment Label */}
        <div className="absolute top-[48%] left-[8%] md:left-[12%] border-r-2 border-dashed border-[#00FFFF] pr-3 py-1 text-right">
          <p className="text-[#00FFFF] text-[10px] font-bold uppercase tracking-wider">Layer 2: Phosphorus Mobilizer</p>
          <p className="text-white text-[12px] font-bold">Bacillus megaterium</p>
        </div>

        {/* Potassium Segment Label */}
        <div className="absolute bottom-[20%] left-[62%] md:left-[65%] border-l-2 border-dashed border-[#FF2E63] pl-3 py-1 text-left">
          <p className="text-[#FF2E63] text-[10px] font-bold uppercase tracking-wider">Layer 3: Potassium Solubilizer</p>
          <p className="text-white text-[12px] font-bold">Frateuria aurantia</p>
        </div>
      </div>

      {/* Floating Instructions/Control overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        <button
          onClick={() => {
            const nextState = !isExploded;
            setIsExploded(nextState);
            if (explodeFnRef.current) explodeFnRef.current(nextState);
          }}
          className="px-4 py-2 rounded-full bg-white/5 border border-[#00FF9D]/30 backdrop-blur-md text-[#00FF9D] text-[11px] font-bold uppercase tracking-wider hover:bg-[#00FF9D] hover:text-[#050816] hover:shadow-[0_0_15px_rgba(0,255,157,0.4)] transition-all duration-300 pointer-events-auto cursor-pointer"
        >
          {isExploded ? 'Assemble Combo ↺' : 'Decompose Ingredients ↗'}
        </button>
      </div>

      {/* Touch helper label */}
      <div className="absolute top-2 left-4 text-white/30 text-[9px] uppercase tracking-widest font-mono-space pointer-events-none">
        ★ Click Bottle to Interact
      </div>
    </div>
  );
};

export default PaddySpecial3D;
