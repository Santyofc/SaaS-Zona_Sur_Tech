"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useMouse } from "@repo/ui/src/MotionProvider";

export default function ShadowCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { x, y } = useMouse();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });

        observer.observe(c);

        let animationFrameId: number;

        function resize() {
            if (!c) return;
            const box = c.getBoundingClientRect();
            c.width = box.width;
            c.height = box.height;
        }

        const light = {
            x: x,
            y: y
        };

        const colors = ["#f5c156", "#e6616b", "#5cd3ad"];

        function drawLight() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(light.x, light.y, 1000, 0, 2 * Math.PI);
            let gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 1000);
            gradient.addColorStop(0, "#3b4654");
            gradient.addColorStop(1, "#2c343f");
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(light.x, light.y, 20, 0, 2 * Math.PI);
            gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, 15);
            gradient.addColorStop(0, "#fff");
            gradient.addColorStop(1, "#3b4654");
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        class Box {
            half_size: number;
            x: number;
            y: number;
            r: number;
            shadow_length: number;
            color: string;

            constructor() {
                this.half_size = Math.floor((Math.random() * 50) + 1);
                this.x = Math.floor((Math.random() * (c?.width || window.innerWidth)) + 1);
                this.y = Math.floor((Math.random() * (c?.height || window.innerHeight)) + 1);
                this.r = Math.random() * Math.PI;
                this.shadow_length = 2000;
                this.color = colors[Math.floor((Math.random() * colors.length))];
            }

            getDots() {
                const full = (Math.PI * 2) / 4;
                const p1 = {
                    x: this.x + this.half_size * Math.sin(this.r),
                    y: this.y + this.half_size * Math.cos(this.r)
                };
                const p2 = {
                    x: this.x + this.half_size * Math.sin(this.r + full),
                    y: this.y + this.half_size * Math.cos(this.r + full)
                };
                const p3 = {
                    x: this.x + this.half_size * Math.sin(this.r + full * 2),
                    y: this.y + this.half_size * Math.cos(this.r + full * 2)
                };
                const p4 = {
                    x: this.x + this.half_size * Math.sin(this.r + full * 3),
                    y: this.y + this.half_size * Math.cos(this.r + full * 3)
                };

                return { p1, p2, p3, p4 };
            }

            rotate() {
                const speed = (60 - this.half_size) / 20;
                this.r += speed * 0.002;
                this.x += speed;
                this.y += speed;
            }

            draw() {
                if (!ctx || !c) return;
                const dots = this.getDots();
                ctx.beginPath();
                ctx.moveTo(dots.p1.x, dots.p1.y);
                ctx.lineTo(dots.p2.x, dots.p2.y);
                ctx.lineTo(dots.p3.x, dots.p3.y);
                ctx.lineTo(dots.p4.x, dots.p4.y);
                ctx.fillStyle = this.color;
                ctx.fill();

                if (this.y - this.half_size > c.height) {
                    this.y -= c.height + 100;
                }
                if (this.x - this.half_size > c.width) {
                    this.x -= c.width + 100;
                }
            }

            drawShadow() {
                if (!ctx) return;
                const dots = this.getDots() as any;
                const angles = [];
                const points = [];

                for (const dot in dots) {
                    const angle = Math.atan2(light.y - dots[dot].y, light.x - dots[dot].x);
                    const endX = dots[dot].x + this.shadow_length * Math.sin(-angle - Math.PI / 2);
                    const endY = dots[dot].y + this.shadow_length * Math.cos(-angle - Math.PI / 2);
                    angles.push(angle);
                    points.push({
                        endX: endX,
                        endY: endY,
                        startX: dots[dot].x,
                        startY: dots[dot].y
                    });
                }

                for (let i = points.length - 1; i >= 0; i--) {
                    const n = i === 3 ? 0 : i + 1;
                    ctx.beginPath();
                    ctx.moveTo(points[i].startX, points[i].startY);
                    ctx.lineTo(points[n].startX, points[n].startY);
                    ctx.lineTo(points[n].endX, points[n].endY);
                    ctx.lineTo(points[i].endX, points[i].endY);
                    ctx.fillStyle = "#2c343f";
                    ctx.fill();
                }
            }
        }

        const boxes: Box[] = [];

        function collisionDetection(b: number) {
            for (let i = boxes.length - 1; i >= 0; i--) {
                if (i !== b) {
                    const dx = (boxes[b].x + boxes[b].half_size) - (boxes[i].x + boxes[i].half_size);
                    const dy = (boxes[b].y + boxes[b].half_size) - (boxes[i].y + boxes[i].half_size);
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < boxes[b].half_size + boxes[i].half_size) {
                        boxes[b].half_size = boxes[b].half_size > 1 ? boxes[b].half_size -= 1 : 1;
                        boxes[i].half_size = boxes[i].half_size > 1 ? boxes[i].half_size -= 1 : 1;
                    }
                }
            }
        }

        function draw() {
            if (!ctx || !c || !isVisible) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            light.x = x;
            light.y = y;
            ctx.clearRect(0, 0, c.width, c.height);
            drawLight();

            for (let i = 0; i < boxes.length; i++) {
                boxes[i].rotate();
                boxes[i].drawShadow();
            }
            for (let i = 0; i < boxes.length; i++) {
                collisionDetection(i);
                boxes[i].draw();
            }
            animationFrameId = requestAnimationFrame(draw);
        }

        resize();
        while (boxes.length < 14) {
            boxes.push(new Box());
        }
        draw();

        window.addEventListener('resize', resize);
        
        draw();

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
            <canvas 
                ref={canvasRef} 
                style={{ 
                    backgroundColor: '#2c343f', 
                    width: '100%', 
                    height: '100%',
                    display: 'block'
                }} 
            />
        </div>
    );
}
