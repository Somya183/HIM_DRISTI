import React, { useEffect, useRef } from 'react';

export default function StarfieldBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Star Density Boost (1,200 Stars for dense space coverage)
    const numStars = 1200;
    const stars = [];
    const focalLength = width;

    // Mouse tracking for parallax tilt
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Color palette for realistic & vibrant star spectrum
    const starColors = [
      '#ffffff', '#ffffff', '#ffffff', 
      '#00f3ff', '#38bdf8', '#7dd3fc', 
      '#bae6fd', '#fef08a', '#e0f2fe'
    ];

    // Initialize 1,200 3D Stars with multi-layered speed & depth
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 3,
        y: (Math.random() - 0.5) * height * 3,
        z: Math.random() * width * 1.2,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 1.8 + 0.6,
        baseAlpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinkleFactor: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }

    // Shooting stars / meteors
    const shootingStars = [];
    const createShootingStar = () => {
      if (Math.random() < 0.05 && shootingStars.length < 5) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.6),
          length: Math.random() * 110 + 50,
          speed: Math.random() * 12 + 8,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
          opacity: 1,
          color: Math.random() > 0.5 ? '#00f3ff' : '#ffffff'
        });
      }
    };

    // Render loop
    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const offsetX = (mouseX - width / 2) * 0.12;
      const offsetY = (mouseY - height / 2) * 0.12;

      // Deep space background clear
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);

      // Multi-layer deep space galactic nebula glow
      const nebula = ctx.createRadialGradient(
        width / 2 + offsetX * 1.5,
        height / 3 + offsetY * 1.5,
        40,
        width / 2,
        height / 2,
        width * 0.95
      );
      nebula.addColorStop(0, 'rgba(13, 24, 48, 0.45)');
      nebula.addColorStop(0.4, 'rgba(4, 12, 32, 0.25)');
      nebula.addColorStop(0.8, 'rgba(2, 6, 16, 0.9)');
      nebula.addColorStop(1, 'rgba(1, 2, 8, 0.98)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Render 1,200 3D Stars
      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        // Move star forward in 3D space
        star.z -= star.speed;

        // Loop star back to distant depth when it passes camera
        if (star.z <= 0) {
          star.z = width * 1.2;
          star.x = (Math.random() - 0.5) * width * 3;
          star.y = (Math.random() - 0.5) * height * 3;
        }

        // 3D Perspective projection
        const k = focalLength / star.z;
        const px = star.x * k + width / 2 + offsetX * (800 / star.z);
        const py = star.y * k + height / 2 + offsetY * (800 / star.z);

        if (px >= -20 && px <= width + 20 && py >= -20 && py <= height + 20) {
          star.twinkleFactor += star.twinkleSpeed;
          const alpha = Math.min(1, Math.max(0.15, star.baseAlpha + Math.sin(star.twinkleFactor) * 0.35));
          const size = Math.max(0.6, (1 - star.z / (width * 1.2)) * star.size * 2.2);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = star.color;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();

          // Star outer glow for larger bright stars
          if (size > 2.0) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = star.color;
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // Render Shooting Stars
      createShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.018;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = ss.color === '#00f3ff' ? `rgba(0, 243, 255, ${ss.opacity})` : `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length
        );
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}
