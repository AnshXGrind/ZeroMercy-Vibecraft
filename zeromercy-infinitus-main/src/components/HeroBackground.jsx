import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Lightweight, optimized Three.js background for Next.js + Tailwind
export default function HeroBackground({ accent = [0.0, 0.7, 1.0] }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Scene / Camera / Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 120);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    mount.appendChild(renderer.domElement);

    // Subtle particle field
    const particleCount = 900; // tuned for performance
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 800; // x
      positions[i3 + 1] = (Math.random() - 0.5) * 400; // y
      positions[i3 + 2] = (Math.random() - 0.5) * 800; // z

      // subtle color mix of deep blue / cyan / purple
      const t = Math.random();
      color.setRGB(
        accent[0] * (0.6 + 0.4 * t) + 0.02 * Math.random(),
        accent[1] * (0.6 + 0.4 * t) + 0.02 * Math.random(),
        accent[2] * (0.6 + 0.4 * t) + 0.02 * Math.random()
      );
      colors[i3 + 0] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Soft glowing grid lines (several layers for depth)
    function makeGrid(size = 600, gaps = 40, z = 0, opacity = 0.06, scale = 1) {
      const lines = new THREE.BufferGeometry();
      const vertices = [];
      const half = size / 2;
      for (let x = -half; x <= half; x += gaps) {
        vertices.push(x * scale, -half * scale, z, x * scale, half * scale, z);
      }
      for (let y = -half; y <= half; y += gaps) {
        vertices.push(-half * scale, y * scale, z, half * scale, y * scale, z);
      }
      lines.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
      const mat = new THREE.LineBasicMaterial({ color: new THREE.Color(accent[0], accent[1], accent[2]), transparent: true, opacity, blending: THREE.AdditiveBlending });
      return new THREE.LineSegments(lines, mat);
    }

    const gridNear = makeGrid(1200, 60, 20, 0.06, 0.4);
    const gridMid = makeGrid(1600, 80, -40, 0.045, 0.7);
    const gridFar = makeGrid(2200, 120, -180, 0.025, 1.2);

    scene.add(gridNear, gridMid, gridFar);

    // Soft vignette / fog via scene.fog
    scene.fog = new THREE.FogExp2(0x020617, 0.0009);

    // Camera parallax (mouse reactive)
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    function onMouseMove(e) {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 30; // parallax strength
      targetY = (y - 0.5) * 18;
    }

    function onTouchMove(e) {
      if (e.touches && e.touches.length > 0) {
        const t = e.touches[0];
        onMouseMove(t);
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // small deterministic motion for subtle life
    const clock = new THREE.Clock();

    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);

      // lerp mouse for smoothness
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      const t = clock.getElapsedTime();

      // particle slow drift
      const positions = particles.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        // subtle z oscillation per particle
        positions[i + 2] += Math.sin((i + t * 10) * 0.0006) * 0.06;
      }
      particles.attributes.position.needsUpdate = true;

      // rotate grids slowly for premium feel
      gridNear.rotation.z = Math.sin(t * 0.03) * 0.001 + mouseX * 0.0008;
      gridMid.rotation.z = Math.sin(t * 0.02) * 0.0008 + mouseX * 0.0005;
      gridFar.rotation.z = Math.sin(t * 0.01) * 0.0005 + mouseX * 0.0002;

      // camera parallax
      camera.position.x += (mouseX - camera.position.x) * 0.04;
      camera.position.y += (-mouseY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    // Resize handler
    function handleResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', handleResize, { passive: true });
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      // dispose geometry / materials
      particles.dispose?.();
      pMaterial.dispose?.();
      gridNear.geometry.dispose?.();
      gridNear.material.dispose?.();
      gridMid.geometry.dispose?.();
      gridMid.material.dispose?.();
      gridFar.geometry.dispose?.();
      gridFar.material.dispose?.();
      renderer.dispose();
    };
  }, [accent]);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />;
}
