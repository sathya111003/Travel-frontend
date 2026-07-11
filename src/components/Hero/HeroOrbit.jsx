import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroOrbit = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff9d, 2, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 3. Custom Holographic Shader Material
    const holoMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#00FF9D') }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          // Fresnel effect
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.5);
          
          // Shimmer scanline effect
          float shimmer = sin(vUv.y * 30.0 + uTime * 6.0) * 0.15;
          
          // Glow intensity
          vec3 finalColor = uColor * (fresnel + shimmer + 0.35);
          
          gl_FragColor = vec4(finalColor, fresnel * 0.7 + 0.25);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // 4. Create 5 Floating Products (Holographic Geometries)
    const products = [];
    const geometries = [
      new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16), // Bottle
      new THREE.BoxGeometry(0.8, 1.2, 0.5),         // Packet
      new THREE.TorusGeometry(0.5, 0.15, 8, 24),     // Capsule donut
      new THREE.ConeGeometry(0.6, 1.4, 4),           // Crystal bio-prism
      new THREE.IcosahedronGeometry(0.7, 1)          // Bio-sphere
    ];

    const bases = [
      { x: -3.0, y: 1.5, z: -1 },
      { x: 3.2, y: 1.8, z: -2 },
      { x: -2.8, y: -1.6, z: 0 },
      { x: 2.9, y: -1.4, z: -1 },
      { x: 0.0, y: 2.2, z: -3 }
    ];

    const phases = [0, Math.PI / 4, Math.PI / 2, Math.PI * 0.75, Math.PI];

    geometries.forEach((geo, idx) => {
      // Create mesh
      const mesh = new THREE.Mesh(geo, holoMaterial.clone());
      mesh.position.set(bases[idx].x, bases[idx].y, bases[idx].z);
      scene.add(mesh);

      // Create wireframe overlay for tech look
      const wireGeo = new THREE.EdgesGeometry(geo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x8bffb7, linewidth: 1 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe);

      products.push({
        mesh,
        baseX: bases[idx].x,
        baseY: bases[idx].y,
        phase: phases[idx],
        rotSpeedX: Math.random() * 0.005,
        rotSpeedY: 0.003 + Math.random() * 0.004
      });
    });

    // 5. Ambient Floating Particle Trails
    const trailCount = 100;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    
    for (let i = 0; i < trailCount; i++) {
      // Scatter them near products
      const pIdx = i % 5;
      const base = bases[pIdx];
      trailPositions[i * 3] = base.x + (Math.random() - 0.5) * 1.5;
      trailPositions[i * 3 + 1] = base.y + (Math.random() - 0.5) * 1.5;
      trailPositions[i * 3 + 2] = base.z + (Math.random() - 0.5) * 1.5;
    }
    
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    // Circle texture for particles
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    pGrad.addColorStop(0, '#00ff9d');
    pGrad.addColorStop(1, 'rgba(0,255,157,0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0,0,16,16);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const trailMat = new THREE.PointsMaterial({
      color: 0x00ff9d,
      size: 0.2,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const trails = new THREE.Points(trailGeo, trailMat);
    scene.add(trails);

    // 6. Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Update shader time uniforms
      products.forEach((prod) => {
        if (prod.mesh.material.uniforms) {
          prod.mesh.material.uniforms.uTime.value = time;
        }

        // zero-gravity floating logic (Y-axis oscillation & X-axis drift)
        prod.mesh.position.y = prod.baseY + Math.sin(time * 0.8 + prod.phase) * 0.3;
        prod.mesh.position.x = prod.baseX + Math.sin(time * 0.5 + prod.phase) * 0.15;

        // rotation
        prod.mesh.rotation.x += prod.rotSpeedX;
        prod.mesh.rotation.y += prod.rotSpeedY;
      });

      // Slowly float background trails
      const positions = trails.geometry.attributes.position.array;
      for (let i = 0; i < trailCount; i++) {
        const i3 = i * 3;
        // Wiggle
        positions[i3 + 1] += Math.sin(time + i) * 0.002;
        // Slow float up
        positions[i3] += Math.cos(time + i) * 0.001;
      }
      trails.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Resize Handler
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

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        containerRef.current.removeChild(renderer.domElement);
      }

      geometries.forEach((g) => g.dispose());
      wireGeo.dispose();
      wireMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      pTexture.dispose();
      holoMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default HeroOrbit;
