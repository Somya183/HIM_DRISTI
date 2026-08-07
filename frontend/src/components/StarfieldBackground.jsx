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

    // DENSE 6,500 SMALL FINE STARS FOR RICH DEEP-SPACE NIGHT SKY
    const numStars = 6500;
    const stars = [];
    const focalLength = width * 0.9;

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
      '#ffffff', '#ffffff', '#ffffff', '#ffffff',
      '#38bdf8', '#00f3ff', '#7dd3fc', 
      '#bae6fd', '#e0f2fe', '#fef08a', '#c084fc'
    ];

    // Initialize 6,500 small fine stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 4.0,
        y: (Math.random() - 0.5) * height * 4.0,
        z: Math.random() * width * 1.4,
        size: Math.random() * 1.2 + 0.2, // Crisp pin-point stars
        speed: Math.random() * 2.5 + 0.8,
        baseAlpha: Math.random() * 0.9 + 0.2,
        twinkleSpeed: Math.random() * 0.08 + 0.02,
        twinkleFactor: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }

    let currentWarpMult = 1.0;

    const render = () => {
      const isWarping = warpRef.current;

      // Intense Smooth Hyperdrive Acceleration
      if (isWarping) {
        currentWarpMult += (65.0 - currentWarpMult) * 0.1;
      } else {
        currentWarpMult += (1.0 - currentWarpMult) * 0.06;
      }

      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const offsetX = (mouseX - width / 2) * 0.1;
      const offsetY = (mouseY - height / 2) * 0.1;

      // Clear Canvas Background (with motion blur trail during warp)
      if (isWarping) {
        ctx.fillStyle = 'rgba(2, 4, 10, 0.28)';
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
      nebula.addColorStop(0, 'rgba(13, 24, 48, 0.4)');
      nebula.addColorStop(0.4, 'rgba(4, 12, 32, 0.2)');
      nebula.addColorStop(0.8, 'rgba(2, 6, 16, 0.85)');
      nebula.addColorStop(1, 'rgba(1, 2, 8, 0.98)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      // Render 3,200 Small Fine Stars & Warp Streaks
      for (let i = 0; i < numStars; i++) {
        const star = stars[i];

        const prevZ = star.z;
        const moveSpeed = star.speed * currentWarpMult;
        star.z -= moveSpeed;

        if (star.z <= 0) {
          star.z = width * 1.4;
          star.x = (Math.random() - 0.5) * width * 4.0;
          star.y = (Math.random() - 0.5) * height * 4.0;
        }

        // 3D Perspective Projections
        const k = focalLength / star.z;
        const px = star.x * k + width / 2 + offsetX * (800 / star.z);
        const py = star.y * k + height / 2 + offsetY * (800 / star.z);

        const prevK = focalLength / prevZ;
        const prevPx = star.x * prevK + width / 2 + offsetX * (800 / prevZ);
        const prevPy = star.y * prevK + height / 2 + offsetY * (800 / prevZ);

        if (px >= -60 && px <= width + 60 && py >= -60 && py <= height + 60) {
          star.twinkleFactor += star.twinkleSpeed;
          const alpha = Math.min(1, Math.max(0.18, star.baseAlpha + Math.sin(star.twinkleFactor) * 0.35));

          ctx.save();

          if (currentWarpMult > 2.0) {
            // HIGH-SPEED FINE HYPERDRIVE LIGHT STREAKS (GitHub-style fine speed streaks)
            const streakWidth = Math.max(0.6, star.size * 0.95);
            ctx.globalAlpha = Math.min(1, alpha * 1.4);
            ctx.strokeStyle = star.color === '#ffffff' ? 'rgba(255, 255, 255, 0.9)' : star.color;
            ctx.lineWidth = streakWidth;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            // SMALL FINE PIN-POINT STARS (Normal mode)
            const size = Math.max(0.4, (1 - star.z / (width * 1.4)) * star.size * 1.8);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();

            if (size > 1.6) {
              ctx.shadowBlur = 6;
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
