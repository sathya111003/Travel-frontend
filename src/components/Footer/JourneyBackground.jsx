import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const JourneyBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff6b35, 2, 40);
    pointLight1.position.set(5, 3, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ff9d, 1.5, 40);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    const holoMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#ff6b35') }
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
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          float shimmer = sin(vUv.y * 20.0 + uTime * 4.0) * 0.1;
          vec3 finalColor = uColor * (fresnel + shimmer + 0.3);
          gl_FragColor = vec4(finalColor, fresnel * 0.5 + 0.15);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    const geometries = [
      new THREE.IcosahedronGeometry(0.6, 1),
      new THREE.OctahedronGeometry(0.5, 0),
      new THREE.TorusGeometry(0.4, 0.12, 8, 24),
      new THREE.DodecahedronGeometry(0.45, 0),
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.TorusKnotGeometry(0.3, 0.1, 48, 8),
    ];

    const bases = [
      { x: -3.5, y: 1.0, z: -2 },
      { x: 3.2, y: -0.8, z: -1.5 },
      { x: -1.5, y: -1.5, z: -1 },
      { x: 2.0, y: 1.5, z: -2.5 },
      { x: 0.0, y: 0.5, z: -3 },
      { x: -2.8, y: 0.2, z: -1.8 },
    ];

    const phases = [0, Math.PI / 3, Math.PI / 1.5, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 0.5];

    const products = [];
    geometries.forEach((geo, idx) => {
      const mesh = new THREE.Mesh(geo, holoMaterial.clone());
      mesh.position.set(bases[idx].x, bases[idx].y, bases[idx].z);
      mesh.scale.setScalar(0.7 + Math.random() * 0.4);
      scene.add(mesh);

      const wireGeo = new THREE.EdgesGeometry(geo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0xff9b6b, linewidth: 1, transparent: true, opacity: 0.3 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe);

      products.push({
        mesh,
        baseX: bases[idx].x,
        baseY: bases[idx].y,
        phase: phases[idx],
        rotSpeedX: (Math.random() - 0.5) * 0.008,
        rotSpeedY: 0.004 + Math.random() * 0.006,
      });
    });

    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;

      const mix = Math.random();
      colors[i * 3] = 1.0 * mix + 0.0 * (1 - mix);
      colors[i * 3 + 1] = 0.42 * mix + 1.0 * (1 - mix);
      colors[i * 3 + 2] = 0.21 * mix + 0.615 * (1 - mix);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255,255,255,1)');
    pGrad.addColorStop(0.3, 'rgba(255,107,53,0.6)');
    pGrad.addColorStop(1, 'rgba(255,107,53,0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      products.forEach((prod) => {
        if (prod.mesh.material.uniforms) {
          prod.mesh.material.uniforms.uTime.value = time;
        }
        prod.mesh.position.y = prod.baseY + Math.sin(time * 0.6 + prod.phase) * 0.35;
        prod.mesh.position.x = prod.baseX + Math.cos(time * 0.4 + prod.phase) * 0.2;
        prod.mesh.rotation.x += prod.rotSpeedX;
        prod.mesh.rotation.y += prod.rotSpeedY;
      });

      const pPositions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pPositions[i3 + 1] += Math.sin(time * 0.5 + i * 0.7) * 0.0015;
        pPositions[i3] += Math.cos(time * 0.3 + i * 0.5) * 0.001;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

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

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometries.forEach((g) => g.dispose());
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
      holoMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
};

export default JourneyBackground;
