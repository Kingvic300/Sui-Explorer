import React, { useRef, useEffect } from 'react';

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const numberOfParticles = 75;

    const parent = canvas.parentElement;
    if (!parent) return;

    const setCanvasSize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    setCanvasSize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(x: number, y: number, size: number, speedX: number, speedY: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        this.x += this.speedX;
        this.y += this.speedY;
        this.draw();
      }
    }

    const init = () => {
      particlesArray = [];
      const colors = ['rgba(255, 255, 255, 0.5)', 'rgba(30, 144, 255, 0.3)'];
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.0 + 0.3;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.15 - 0.075;
        const speedY = Math.random() * 0.15 - 0.075;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
      }
    };

    let animationFrameId: number;
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => particle.update());
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    let resizeRequestId: number;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the resize handler to prevent the 'ResizeObserver loop' error.
      cancelAnimationFrame(resizeRequestId);
      resizeRequestId = requestAnimationFrame(() => {
        setCanvasSize();
        init();
      });
    });
    resizeObserver.observe(parent);

    return () => {
        cancelAnimationFrame(animationFrameId);
        cancelAnimationFrame(resizeRequestId);
        resizeObserver.unobserve(parent);
    }
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full opacity-50" />;
};

export default ParticleBackground;