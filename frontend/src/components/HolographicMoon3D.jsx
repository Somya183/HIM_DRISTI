import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import moonTextureImg from '../assets/moon_sphere.png';

export default function HolographicMoon3D({ width = '480px', height = '480px' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth || 480;
    const h = container.clientHeight || 480;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 5.0;

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. LIGHTING
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const cyanLight = new THREE.DirectionalLight(0x00f3ff, 0.8);
    cyanLight.position.set(-5, -2, -3);
    scene.add(cyanLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.6);
    scene.add(ambientLight);

    // 4. CORE 3D MOON MESH WITH BUMP MAP
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(moonTextureImg);

    const moonGeo = new THREE.SphereGeometry(1.75, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonTexture,
      bumpScale: 0.06,
      roughness: 0.8,
      metalness: 0.15
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moonMesh);

    // 5. HOLOGRAPHIC OUTER GRID / POLAR RADAR RINGS
    const ringGroup = new THREE.Group();

    // Ring 1: Equatorial Orbital Ring
    const ringGeo1 = new THREE.TorusGeometry(2.1, 0.008, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.65 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    ringGroup.add(ring1);

    // Ring 2: Polar Orbit Ring
    const ringGeo2 = new THREE.TorusGeometry(2.35, 0.006, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    ringGroup.add(ring2);

    // Holographic Polar Grid Lattice
    const gridGeo = new THREE.SphereGeometry(1.78, 24, 24);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    scene.add(gridMesh);

    // Orbiting Satellite Beacon Particle
    const beaconGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    ringGroup.add(beacon);

    scene.add(ringGroup);

    // 6. INTERACTIVE MOUSE / TOUCH DRAG
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      moonMesh.rotation.y += deltaX * 0.008;
      moonMesh.rotation.x += deltaY * 0.008;
      gridMesh.rotation.y += deltaX * 0.008;
      gridMesh.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      moonMesh.rotation.y += deltaX * 0.008;
      moonMesh.rotation.x += deltaY * 0.008;
      gridMesh.rotation.y += deltaX * 0.008;
      gridMesh.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    domEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 7. ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 3D Animations
      if (!isDragging) {
        moonMesh.rotation.y += 0.003;
        gridMesh.rotation.y += 0.003;
      }

      // Rotate 3D Orbital Rings
      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Orbit Beacon Position
      beacon.position.x = Math.cos(elapsedTime * 0.8) * 2.1;
      beacon.position.z = Math.sin(elapsedTime * 0.8) * 2.1;

      renderer.render(scene, camera);
    };
    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
      moonGeo.dispose();
      moonMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: width, 
        height: height, 
        position: 'relative', 
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }} 
    />
  );
}
