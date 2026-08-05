import React, { useEffect, useRef } from 'react';

export default function StarfieldBackground({ isWarpSpeed = false }) {
  const canvasRef = useRef(null);
  const warpRef = useRef(isWarpSpeed);

  useEffect(() => {
    warpRef.current = isWarpSpeed;
  }, [isWarpSpeed]);

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

    const numStars = 1400;
    const stars = [];
    const focalLength = width;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const starColors = [
      '#ffffff', '#ffffff', '#ffffff', 
      '#00f3ff', '#38bdf8', '#7dd3fc', 
      '#bae6fd', '#fef08a', '#e0f2fe'
    ];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 3.5,
        y: (Math.random() - 0.5) * height * 3.5,
        z: Math.random() * width * 1.2,
        size: Math.random() * 1.8 + 0.3,
        speed: Math.random() * 1.8 + 0.8,
        baseAlpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinkleFactor: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }

    let currentWarpMult = 1.0;

    const render = () => {
      const isWarping = warpRef.current;

      // Smooth Warp Speed Acceleration
      if (isWarping) {
        currentWarpMult += (45.0 - currentWarpMult) * 0.08;
      } else {
        currentWarpMult += (1.0 - currentWarpMult) * 0.05;
      }

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const offsetX = (mouseX - width / 2) * 0.12;
      const offsetY = (mouseY - height / 2) * 0.12;

      // Deep space background clear (with motion blur trail during warp)
      if (isWarping) {
        ctx.fillStyle = 'rgba(2, 4, 10, 0.35)';
      } else {
        ctx.fillStyle = '#02040a';
      }
      ctx.fillRect(0, 0, width, height);

      // Deep Space Galactic Nebula Glow
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

      // Render 1,400 3D Stars
      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        const prevZ = star.z;
        const moveSpeed = star.speed * currentWarpMult;
        star.z -= moveSpeed;

        if (star.z <= 0) {
          star.z = width * 1.2;
          star.x = (Math.random() - 0.5) * width * 3.5;
          star.y = (Math.random() - 0.5) * height * 3.5;
        }

        // 3D Perspective Projections
        const k = focalLength / star.z;
        const px = star.x * k + width / 2 + offsetX * (800 / star.z);
        const py = star.y * k + height / 2 + offsetY * (800 / star.z);

        const prevK = focalLength / prevZ;
        const prevPx = star.x * prevK + width / 2 + offsetX * (800 / prevZ);
        const prevPy = star.y * prevK + height / 2 + offsetY * (800 / prevZ);

        if (px >= -50 && px <= width + 50 && py >= -50 && py <= height + 50) {
          star.twinkleFactor += star.twinkleSpeed;
          const alpha = Math.min(1, Math.max(0.2, star.baseAlpha + Math.sin(star.twinkleFactor) * 0.35));

          ctx.save();

          if (currentWarpMult > 2.5) {
            // WARP SPEED HIGH-ACCELERATION LIGHT STREAKS
            const streakLineWidth = Math.max(1.2, star.size * (currentWarpMult / 15));
            ctx.globalAlpha = Math.min(1, alpha * 1.5);
            ctx.strokeStyle = star.color === '#ffffff' ? '#00f3ff' : star.color;
            ctx.lineWidth = streakLineWidth;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();

            // Bright Streak Core
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = Math.max(0.8, streakLineWidth * 0.5);
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            // NORMAL SPACE FLOATING STAR DOTS
            const size = Math.max(0.6, (1 - star.z / (width * 1.2)) * star.size * 2.2);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            if (size > 2.0) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = star.color;
              ctx.fill();
            }
          }

          ctx.restore();
        }
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
