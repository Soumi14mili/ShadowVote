import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle data
    const STAR_COUNT = 90;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      deltaAlpha: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      speedY: Math.random() * 0.15 + 0.02,
      speedX: (Math.random() - 0.5) * 0.1,
      color: Math.random() > 0.75 ? '#06b6d4' : Math.random() > 0.5 ? '#f59e0b' : '#c2d1f5',
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Mouse-following gentle radial nebula
      const mouseGrad = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 450);
      mouseGrad.addColorStop(0, 'rgba(6, 182, 212, 0.045)');
      mouseGrad.addColorStop(0.5, 'rgba(139, 92, 246, 0.02)');
      mouseGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Fixed atmospheric ambient glows
      const topGrad = ctx.createRadialGradient(width * 0.2, height * 0.15, 20, width * 0.2, height * 0.15, 600);
      topGrad.addColorStop(0, 'rgba(6, 182, 212, 0.04)');
      topGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height);

      const bottomGrad = ctx.createRadialGradient(width * 0.8, height * 0.8, 20, width * 0.8, height * 0.8, 550);
      bottomGrad.addColorStop(0, 'rgba(245, 158, 11, 0.035)');
      bottomGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render Stars
      stars.forEach((star) => {
        star.y += star.speedY;
        star.x += star.speedX;

        // Wrap around borders
        if (star.y > height) star.y = 0;
        if (star.y < 0) star.y = height;
        if (star.x > width) star.x = 0;
        if (star.x < 0) star.x = width;

        // Twinkle
        star.alpha += star.deltaAlpha;
        if (star.alpha > 0.85 || star.alpha < 0.15) {
          star.deltaAlpha = -star.deltaAlpha;
        }

        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Extra twinkle glow on larger stars
        if (star.size > 1.4) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = star.color;
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
