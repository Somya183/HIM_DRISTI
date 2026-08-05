import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeMoonGlobe({ width = '460px', height = '460px' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const w = container.clientWidth || 460;
    const h = container.clientHeight || 460;

    // 1. GENERATE PROCEDURAL HIGH-RES LUNAR TEXTURE ON CANVAS
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base Lunar Regolith Grey Gradient
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
    baseGrad.addColorStop(0, '#94a3b8');
    baseGrad.addColorStop(0.5, '#cbd5e1');
    baseGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Add Dark Lunar Maria (Basaltic Plains)
    const maria = [
      { x: 300, y: 220, r: 110 },
      { x: 420, y: 180, r: 85 },
      { x: 250, y: 320, r: 95 },
      { x: 600, y: 240, r: 130 },
      { x: 750, y: 200, r: 70 },
      { x: 180, y: 190, r: 60 },
      { x: 880, y: 310, r: 80 }
    ];

    maria.forEach(m => {
      const g = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.r);
      g.addColorStop(0, 'rgba(30, 41, 59, 0.75)');
      g.addColorStop(0.6, 'rgba(51, 65, 85, 0.5)');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add Hundreds of Craters & Micro-craters
    for (let i = 0; i < 400; i++) {
      const cx = Math.random() * 1024;
      const cy = Math.random() * 512;
      const cr = 2 + Math.random() * 18;

      // Crater Rim (Highlight)
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.stroke();

      // Crater Dark Pit
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.beginPath();
      ctx.arc(cx - 0.5, cy - 0.5, cr * 0.75, 0, Math.PI * 2);
      ctx.fill();
    }

    const moonTexture = new THREE.CanvasTexture(canvas);
    moonTexture.wrapS = THREE.RepeatWrapping;
    moonTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 2. THREE.JS SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. LIGHTING (Directional Sun Light for 3D Surface Shadow Depth)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f3ff, 0.6);
    cyanRimLight.position.set(-5, -2, -3);
    scene.add(cyanRimLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.7);
    scene.add(ambientLight);

    // 4. 3D SPHERE MESH
    const geometry = new THREE.SphereGeometry(1.85, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: moonTexture,
      bumpMap: moonTexture,
      bumpScale: 0.05,
      roughness: 0.8,
      metalness: 0.1
    });

    const moonMesh = new THREE.Mesh(geometry, material);
    scene.add(moonMesh);

    // 5. INTERACTIVE MOUSE / TOUCH DRAG ROTATION
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

    // Touch events for mobile
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

    // 6. ANIMATION LOOP
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        moonMesh.rotation.y += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 7. CLEANUP
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
      geometry.dispose();
      material.dispose();
      moonTexture.dispose();
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
