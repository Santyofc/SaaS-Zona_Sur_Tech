"use client";
import React, { useEffect, useRef } from 'react';
import { useMouse } from "@repo/ui/src/MotionProvider";
import styles from './CursorTrail.module.css';

import img1 from './images/flow_1.png';
import img2 from './images/flow_2.png';
import img3 from './images/flow_3.png';

const images = [
  img1, img2, img3
];

export default function CursorTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y, prevX, prevY, isMoving, isTouching } = useMouse();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

    const config = {
      imageLifespan: 2500, // Increased for longer swarm trails
      removalDelay: 16,
      mouseThreshold: isMobile ? 12 : 18,
      scrollThreshold: 50,
      inDuration: 500,
      outDuration: 800,
      inEasing: "cubic-bezier(.17,.67,.83,.67)",
      outEasing: "cubic-bezier(.19, 1, .22, 1)",
      maxParticles: isMobile ? 15 : 25,
      minImageSize: isMobile ? 60 : 100,
      maxImageSize: isMobile ? 180 : 260,
      baseRotation: 60,
      speedSmoothingFactor: 0.1,
      minMovementForImage: 2,
      // Flow/Swarm Physics
      stiffness: 0.025,
      damping: 0.94,
      jitter: 0.15
    };

    const trail: {
      element: HTMLImageElement;
      rotation: number;
      removeTime: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }[] = [];

    let lastMouseX = x, lastMouseY = y;
    let lastRemovalTime = 0, lastTouchImageTime = 0, lastScrollTime = 0, lastMoveTime = Date.now();
    let smoothedSpeed = 0, maxSpeed = 0, imageIndex = 0;

    const rectOf = () => container.getBoundingClientRect();

    const isInContainer = (cx: number, cy: number) => {
      const r = rectOf();
      return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    };

    const movedBeyond = (th: number) => {
      const dx = x - lastMouseX, dy = y - lastMouseY;
      return Math.hypot(dx, dy) > th;
    };

    const movedAtAll = (min: number) => {
      const dx = x - prevX, dy = y - prevY;
      return Math.hypot(dx, dy) > min;
    };

    const calculateSpeed = () => {
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt <= 0) return 0;
      const dist = Math.hypot(x - prevX, y - prevY);
      const raw = dist / dt;
      maxSpeed = Math.max(maxSpeed, raw || 0.5);
      const norm = Math.min(raw / (maxSpeed || 0.5), 1);
      smoothedSpeed = smoothedSpeed * (1 - config.speedSmoothingFactor) + norm * config.speedSmoothingFactor;
      lastMoveTime = now;
      return smoothedSpeed;
    };

    const createFlameImage = (speed: number) => {
      if (trail.length >= config.maxParticles) return;

      const imageSrc = images[imageIndex];
      imageIndex = (imageIndex + 1) % images.length;

      const size = config.minImageSize + (config.maxImageSize - config.minImageSize) * speed;
      const rot = (Math.random() - 0.5) * config.baseRotation;

      const img = document.createElement("img");
      img.className = "trail-img";
      img.src = typeof imageSrc === 'string' ? imageSrc : (imageSrc as any).src;
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.position = 'absolute';
      img.style.pointerEvents = 'none';
      img.style.mixBlendMode = 'screen'; // Removes black background
      img.style.zIndex = '1';

      const r = rectOf();
      const ix = x - r.left, iy = y - r.top;

      img.style.left = `0px`;
      img.style.top = `0px`;
      img.style.transform = `translate(${ix}px, ${iy}px) translate(-50%, -50%) rotate(${rot}deg) scale(0)`;
      img.style.opacity = "0";
      img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}, opacity ${config.inDuration}ms linear`;
      container.appendChild(img);

      requestAnimationFrame(() => {
        img.style.transform = `translate(${ix}px, ${iy}px) translate(-50%, -50%) rotate(${rot}deg) scale(1)`;
        img.style.opacity = "1";
      });

      trail.push({
        element: img,
        rotation: rot,
        removeTime: Date.now() + config.imageLifespan,
        x: ix,
        y: iy,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8
      });
    };

    const handleScroll = () => {
      const isCursorInContainer = isInContainer(x, y);
      if (!isCursorInContainer) return;

      const now = Date.now();
      if (now - lastScrollTime < config.scrollThreshold) return;
      lastScrollTime = now;

      requestAnimationFrame(() => {
        lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
        lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
        createFlameImage(0.5);
        lastMouseX = x;
        lastMouseY = y;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    let loopId: number;
    function loop() {
      const isCursorInContainer = isInContainer(x, y);
      const r = rectOf();
      const targetX = x - r.left;
      const targetY = y - r.top;

      if (isCursorInContainer && (isMoving || isTouching)) {
        if (movedBeyond(config.mouseThreshold) && movedAtAll(config.minMovementForImage)) {
          lastMouseX = x;
          lastMouseY = y;
          createFlameImage(calculateSpeed());
        }
      }

      const now = Date.now();

      // Update trail physics
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];

        if (now >= p.removeTime) {
          const el = p.element;
          el.style.transition = `transform ${config.outDuration}ms ${config.outEasing}, opacity ${config.outDuration}ms linear, filter ${config.outDuration}ms linear`;
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation + 180}deg) scale(0)`;
          el.style.opacity = "0";
          el.style.filter = "blur(12px)";

          setTimeout(() => {
            if (container && container.contains(el)) el.remove();
          }, config.outDuration);

          trail.splice(i, 1);
          continue;
        }

        // Swarm logic: follow target
        const dx = targetX - p.x;
        const dy = targetY - p.y;

        p.vx += dx * config.stiffness + (Math.random() - 0.5) * config.jitter;
        p.vy += dy * config.stiffness + (Math.random() - 0.5) * config.jitter;

        p.vx *= config.damping;
        p.vy *= config.damping;

        p.x += p.vx;
        p.y += p.vy;

        // Apply style update with zero transition delay for smoothness in loop
        p.element.style.transition = "none";
        p.element.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${p.rotation}deg) scale(1)`;
      }

      loopId = requestAnimationFrame(loop);
    }
    loopId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(loopId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [x, y, prevX, prevY, isMoving, isTouching]);

  return (
    <div className={styles.container}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap" />
      <section ref={containerRef} className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Plataforma by<br /><span className="zs-text-gradient-brand">@santidelgados_</span></h1>
      </section>
    </div>
  );
}
