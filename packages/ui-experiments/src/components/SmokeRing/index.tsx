"use client";

import React, { useEffect, useRef } from "react";
import styles from "./SmokeRing.module.css";

export default function SmokeRing() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        let resizeHandler: () => void;
        let mouseMoveHandler: (e: any) => void;
        let mouseDownHandler: () => void;
        let mouseUpHandler: () => void;
        let animationStarted = false;

        const initAnimation = () => {
            const gsap = (window as any).gsap;
            if (!gsap) {
                console.error("GSAP not loaded");
                return;
            }

            const c = wrapper.querySelector('#c') as HTMLCanvasElement;
            const ctx = c?.getContext('2d');
            if (!c || !ctx) return;

            let n = 4,
                dur = 3,
                props = {x:0, y:0, hue:185},
                mph = 0,
                mouseDown = false,
                size = 0, cw = 0, ch = 0,
                img = new Image(),
                ring = new Image(),
                particles: Particle[] = [];

            class Particle {
                index: number;
                x: number;
                y: number;
                progress: number;
                opacity: number;
                scale: number;
                rot: number = 0;
                tl: any;

                constructor(index: number) {
                    this.index = index;
                    this.x = 1; this.y = 1; this.progress = 1; this.opacity = 1; this.scale = 1;

                    this.tl = gsap.timeline({ repeat: -1, repeatRefresh: true })
                        .fromTo(this, {
                            rot: () => Math.random() * -0.8,
                            scale: () => 3 + Math.random(),
                        }, {
                            duration: dur,
                            scale: () => 0.5 + Math.random(),
                            rot: () => (this.index % 2 === 0) ? 1 : -0.8,
                            ease: 'none'
                        }, 0)
                        .fromTo(this, { opacity: 0 }, { duration: dur / 2, opacity: 1, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0)
                        .progress(this.index / n);
                }

                draw() {
                    ctx!.translate(cw / 2, ch / 2);
                    ctx!.rotate(this.rot);
                    ctx!.globalAlpha = this.opacity;
                    ctx!.globalCompositeOperation = 'overlay';
                    ctx!.drawImage(img, -size * this.scale / 2, -size * this.scale / 2, size * this.scale, size * this.scale);
                    ctx!.rotate(-this.rot);
                    ctx!.translate(-cw / 2, -ch / 2);
                }
            }

            ring.src = 'https://assets.codepen.io/721952/speedometerAlpha3.png';
            img.src = 'https://assets.codepen.io/721952/grayscaleFlame.jpg';

            img.onload = () => {
                updateSize();
                for (let i = 0; i < n; i++) particles.push(new Particle(i));
                gsap.ticker.add(redraw);
                animationStarted = true;
                const appNode = wrapper.querySelector('.app');
                if (appNode) {
                    gsap.set(appNode, {opacity:1});
                }
            };

            function updateSize() {
                cw = (c.width = window.innerWidth);
                ch = (c.height = window.innerHeight);
                size = Math.min(cw / 1.5, ch / 1.5);
            }

            resizeHandler = updateSize;
            window.addEventListener('resize', resizeHandler);

            mouseDownHandler = () => { mouseDown = true; };
            mouseUpHandler = () => { mouseDown = false; };
            
            wrapper.addEventListener('mousedown', mouseDownHandler);
            wrapper.addEventListener('touchstart', mouseDownHandler);
            wrapper.addEventListener('mouseup', mouseUpHandler);
            wrapper.addEventListener('touchend', mouseUpHandler);

            mouseMoveHandler = (e: any) => {
                if (e.touches && e.touches.length > 0) {
                    e.clientX = e.touches[0].clientX;
                    e.clientY = e.touches[0].clientY;
                }
                const cEl = wrapper.querySelector('#c');
                const sEl = wrapper.querySelector('#s');
                if (cEl && sEl) {
                    gsap.to([cEl, sEl], {
                        rotationY: -20 + (e.clientX || 0) / window.innerWidth * 40,
                        rotationX: 10 - (e.clientY || 0) / window.innerHeight * 20
                    });
                }
            };

            wrapper.addEventListener('mousemove', mouseMoveHandler);
            wrapper.addEventListener('touchmove', mouseMoveHandler);

            const needle = wrapper.querySelector('.needle');
            const ring1 = wrapper.querySelector('.ring1');
            const ring3 = wrapper.querySelector('.ring3');
            const redzone = wrapper.querySelector('.redzone');
            const appEl = wrapper.querySelector('.app');
            const sEl = wrapper.querySelector('#s');
            
            if (needle) gsap.set(needle, { transformOrigin:'100px 100px', rotation:40 });
            if (ring1) gsap.set(ring1, { transformOrigin:'50% 50%', rotation:130 });
            if (ring3) gsap.set(ring3, { transformOrigin:'50% 50%', rotation:130, drawSVG:0 });
            if (redzone) gsap.set(redzone, { transformOrigin:'50% 50%', drawSVG:'2.8% 11.2%' });
            if (appEl) gsap.set(appEl, { perspective:400 });
            if (sEl) gsap.set(sEl, {overflow:'visible', width:'66.7%', height:'66.7%', left:'50%', top:'50%', xPercent:-50, yPercent:-50, z:20});

            function redraw() { 
                ctx!.clearRect(0,0,cw,ch);
                for (let i = 0; i < n; i++) particles[i].draw();
                ctx!.globalAlpha = 1;
                ctx!.globalCompositeOperation = 'multiply';
                ctx!.fillStyle = "hsl(" + props.hue + ", 100%, 50%)";
                ctx!.fillRect(cw / 2 - size / 2, ch / 2 - size / 2, size, size); 
                ctx!.globalCompositeOperation = 'destination-in';
                ctx!.drawImage(ring, cw / 2 - size / 2, ch / 2 - size / 2, size, size);
                
                if (mouseDown && mph < 1) {
                    mph += 0.0015;
                    (mph > 0.88 && Math.random() > 0.5) ? mph -= 0.002 : mph += 0.0015;
                }
                else if (mph > 0) {
                    (mph < 0.05) ? mph = 0 : mph -= 0.005;
                }
                
                const txt = wrapper.querySelector('.txt');
                if (txt) {
                    gsap.to(txt, { duration:()=>(mph<0.01)?0.001:0.5, innerHTML:mph*221, snap:{innerHTML:1} });
                }
                if (ring3) gsap.to(ring3, { drawSVG:'0 '+mph*75+'%' });
                if (ring1) gsap.to(ring1, { drawSVG:mph*75+'% 100%' });
                if (needle) gsap.to(needle, { rotation:40+mph*270 });
                gsap.set(props, { hue:()=>(mph<0.9)?185:10 });
            }

            (window as any)._smokeRingRedraw = redraw;
        };

        const loadScript = (src: string) => {
            return new Promise((resolve) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve(true); 
                    return;
                }
                const s = document.createElement("script");
                s.src = src;
                s.onload = resolve;
                s.onerror = resolve; // Continue even if error
                document.head.appendChild(s);
            });
        };

        const run = async () => {
            await loadScript("https://unpkg.com/gsap@3/dist/gsap.min.js");
            await loadScript("https://assets.codepen.io/16327/DrawSVGPlugin3.min.js");
            initAnimation();
        };

        run();

        return () => {
            if (resizeHandler) window.removeEventListener('resize', resizeHandler);
            if (mouseDownHandler) {
                wrapper.removeEventListener('mousedown', mouseDownHandler);
                wrapper.removeEventListener('touchstart', mouseDownHandler);
                wrapper.removeEventListener('mouseup', mouseUpHandler);
                wrapper.removeEventListener('touchend', mouseUpHandler);
            }
            if (mouseMoveHandler) {
                wrapper.removeEventListener('mousemove', mouseMoveHandler);
                wrapper.removeEventListener('touchmove', mouseMoveHandler);
            }
            if ((window as any).gsap && (window as any).gsap.ticker && (window as any)._smokeRingRedraw && animationStarted) {
                (window as any).gsap.ticker.remove((window as any)._smokeRingRedraw);
            }
        };
    }, []);

    return (
        <div className={styles.baseWrap} ref={wrapperRef}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" />
            <div className="app">
                <canvas id="c"></canvas>
                <svg id="s" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet" stroke="#fff" fill="none">
                    <defs>
                        <mask id="m1">
                            <rect fill="#fff" width="100%" height="100%" />
                            <circle fill="#000" cx="300" cy="300" r="285" />
                        </mask>
                        <mask id="m2">
                            <rect fill="#fff" width="100%" height="100%" />
                            <circle fill="#000" cx="300" cy="300" r="272" />
                        </mask>    
                    </defs>
                    <circle className="ring1" cx="300" cy="300" r="210" strokeWidth="220" stroke="#000" />  
                    <g id="marks">
                        <path mask="url(#m1)" opacity="0.5" d="M0.2,289.5l599.6,20.9 M6.6,237.6l586.9,124.7 M21.8,187.6l556.3,224.8 M45.6,141l508.8,318 M77.1,99.3 L300,300 M115.3,63.6L300,300 M300,300L159.2,35.1 M207.3,14.7L300,300 M258.2,2.9L300,300 M300,300L310.5,0.2 M362.4,6.6L300,300 M412.4,21.8L300,300 M459,45.6L300,300 M500.7,77.1L99.3,522.9 M63.6,484.7l472.8-369.4 M35.1,440.8l529.8-281.7 M14.7,392.7 l570.6-185.4 M2.9,341.8l594.2-83.5 M0.7,279.1l598.5,41.9 M8.9,227.4l582.2,145.2 M25.9,178l548.1,244 M51.3,132.2l497.4,335.5 M84.2,91.6L300,300 M123.7,57.3L300,300 M300,300L168.5,30.4 M217.3,11.6L300,300 M268.6,1.6L300,300 M300,300L320.9,0.7 M372.6,8.9L300,300 M422,25.9L300,300 M467.8,51.3L300,300 M508.4,84.2L91.6,515.8 M57.3,476.3l485.4-352.7 M30.4,431.5l539.3-263 M11.6,382.7l576.8-165.4 M1.6,331.4l596.7-62.7 M1.6,268.6l596.7,62.7 M11.6,217.3l576.8,165.4 M30.4,168.5l539.3,263 M57.3,123.7 l485.4,352.7 M91.6,84.2L300,300 M132.2,51.3L300,300 M300,300L178,25.9 M227.4,8.9L300,300 M279.1,0.7L300,300 M300,300L331.4,1.6 M382.7,11.6L300,300 M431.5,30.4L300,300 M476.3,57.3L300,300 M515.8,91.6L84.2,508.4 M51.3,467.8l497.4-335.5 M25.9,422 l548.1-244 M8.9,372.6l582.2-145.2 M0.7,320.9l598.5-41.9 M2.9,258.2l594.2,83.5 M14.7,207.3l570.6,185.4 M35.1,159.2l529.8,281.7 M63.6,115.3l472.8,369.4 M99.3,77.1L300,300 M141,45.6L300,300 M300,300L187.6,21.8 M237.6,6.6L300,300 M289.5,0.2L300,300 M300,300L341.8,2.9 M392.7,14.7L300,300 M440.8,35.1L300,300 M484.7,63.6L300,300 M522.9,99.3L77.1,500.7 M45.6,459l508.8-318 M21.8,412.4l556.3-224.8 M6.6,362.4l586.9-124.7 M0.2,310.5l599.6-20.9"/>
50                        <path mask="url(#m2)" d="M4.6,247.9l590.9,104.2 M18.1,197.4l563.8,205.2 M40.2,150l519.6,300 M70.2,107.2l459.6,385.7 M107.2,70.2 L300,300 M150,40.2L300,300 M300,300L197.4,18.1 M247.9,4.6L300,300 M300,0v300 M300,300L352.1,4.6 M402.6,18.1L300,300 M450,40.2 L300,300 M492.8,70.2L300,300 M529.8,107.2L70.2,492.8 M40.2,450l519.6-300 M18.1,402.6l563.8-205.2 M4.6,352.1l590.9-104.2 M0,300 l600,0"/>
51                    </g>
52                    <circle className="st2" cx="300" cy="300" r="118" strokeWidth="1.5" opacity="0.7"/>  
53                    <g className="needle" strokeWidth="2">
54                        <circle className="ring2" cx="300" cy="300" r="100" strokeWidth="4.5" />  
55                        <line x1="300" y1="400" x2="300" y2="600" strokeWidth="3"/>
56                    </g>
57                    <circle className="ring3" cx="300" cy="300" r="300" strokeWidth="1.5" />
58                    <circle className="redzone" cx="300" cy="300" r="315" strokeWidth="6" stroke="hsl(10,85%,50%)" />
59                    <text className="txt" x="300" y="328" textAnchor="middle" stroke="none" fill="#fff">0</text>
60                </svg>
61            </div>
62        </div>
63    );
64}
