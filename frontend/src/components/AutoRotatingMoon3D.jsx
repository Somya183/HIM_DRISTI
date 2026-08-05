import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import moonTextureImg from '../assets/moon_sphere.png';

export default function AutoRotatingMoon3D({ width = '100%', height = '100%' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth || 520;
    const h = container.clientHeight || 520;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 4.3;

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. LIGHTING (Realistic Directional Sunlight & Ambient Shadow)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00f3ff, 0.9);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x151d2a, 0.5);
    scene.add(ambientLight);

    // 4. PHOTOREALISTIC 3D MOON MESH
    const textureLoader = new THREE.TextureLoader();
    const moonTexture = textureLoader.load(moonTextureImg);

    const moonGeo = new THREE.SphereGeometry(1.85, 64, 64);
    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonTexture,
      bumpScale: 0.07,
      roughness: 0.85,
      metalness: 0.1
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    scene.add(moonMesh);

    // 5. MOUSE / TOUCH DRAG INTERACTION
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

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support
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

      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => { isDragging = false; };

    domEl.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 6. CONTINUOUS AUTO-ROTATION ANIMATION LOOP
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // CONTINUOUS ROTATION
      if (!isDragging) {
        moonMesh.rotation.y += 0.005; // Smooth continuous Y-axis rotation
      }

      renderer.render(scene, camera);
    };
    animate();

    // RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
