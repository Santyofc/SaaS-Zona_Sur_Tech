"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useMouse } from "@repo/ui/src/MotionProvider";

export default function ReptileCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { x, y } = useMouse();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });

    observer.observe(canvas);

    const Input = {
      keys: [] as boolean[],
      mouse: {
        left: false,
        right: false,
        middle: false,
        x: x,
        y: y
      }
    };
    // ... rest of initialization ...
    for (let i = 0; i < 230; i++) {
      Input.keys.push(false);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      Input.keys[event.keyCode] = true;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      Input.keys[event.keyCode] = false;
    };
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 0) Input.mouse.left = true;
      if (event.button === 1) Input.mouse.middle = true;
      if (event.button === 2) Input.mouse.right = true;
    };
    const onMouseUp = (event: MouseEvent) => {
      if (event.button === 0) Input.mouse.left = false;
      if (event.button === 1) Input.mouse.middle = false;
      if (event.button === 2) Input.mouse.right = false;
    };
    const onMouseMove = (event: MouseEvent) => {
      Input.mouse.x = event.clientX;
      Input.mouse.y = event.clientY;
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "absolute";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.style.pointerEvents = "none"; // allow clicking through the canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let segmentCount = 0;
    class Segment {
      isSegment: boolean;
      parent: any;
      children: any[];
      size: number;
      relAngle: number;
      defAngle: number;
      absAngle: number;
      range: number;
      stiffness: number;
      x!: number;
      y!: number;

      constructor(parent: any, size: number, angle: number, range: number, stiffness: number) {
        segmentCount++;
        this.isSegment = true;
        this.parent = parent;
        if (typeof parent.children === "object") {
          parent.children.push(this);
        }
        this.children = [];
        this.size = size;
        this.relAngle = angle;
        this.defAngle = angle;
        this.absAngle = parent.absAngle + angle;
        this.range = range;
        this.stiffness = stiffness;
        this.updateRelative(false, true);
      }
      updateRelative(iter: boolean, flex: boolean) {
        this.relAngle =
          this.relAngle -
          2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 1 / 2);
        if (flex) {
          this.relAngle = Math.min(
            this.defAngle + this.range / 2,
            Math.max(
              this.defAngle - this.range / 2,
              (this.relAngle - this.defAngle) / this.stiffness + this.defAngle
            )
          );
        }
        this.absAngle = this.parent.absAngle + this.relAngle;
        this.x = this.parent.x + Math.cos(this.absAngle) * this.size;
        this.y = this.parent.y + Math.sin(this.absAngle) * this.size;
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateRelative(iter, flex);
          }
        }
      }
      draw(iter: boolean) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.moveTo(this.parent.x, this.parent.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].draw(true);
          }
        }
      }
      follow(iter: boolean) {
        const x = this.parent.x;
        const y = this.parent.y;
        const dist = Math.hypot(this.x - x, this.y - y);
        this.x = x + this.size * (this.x - x) / dist;
        this.y = y + this.size * (this.y - y) / dist;
        this.absAngle = Math.atan2(this.y - y, this.x - x);
        this.relAngle = this.absAngle - this.parent.absAngle;
        this.updateRelative(false, true);
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].follow(true);
          }
        }
      }
    }

    class LimbSystem {
      end: any;
      length: number;
      creature: any;
      speed: number;
      nodes: any[];
      hip: any;

      constructor(end: any, length: number, speed: number, creature: any) {
        this.end = end;
        this.length = Math.max(1, length);
        this.creature = creature;
        this.speed = speed;
        creature.systems.push(this);
        this.nodes = [];
        let node = end;
        for (let i = 0; i < length; i++) {
          this.nodes.unshift(node);
          node = node.parent;
          if (!node.isSegment) {
            this.length = i + 1;
            break;
          }
        }
        this.hip = this.nodes[0].parent;
      }
      moveTo(x: number, y: number) {
        this.nodes[0].updateRelative(true, true);
        const dist = Math.hypot(x - this.end.x, y - this.end.y);
        let len = Math.max(0, dist - this.speed);
        let cx = x;
        let cy = y;
        for (let i = this.nodes.length - 1; i >= 0; i--) {
          const node = this.nodes[i];
          const ang = Math.atan2(node.y - cy, node.x - cx);
          node.x = cx + len * Math.cos(ang);
          node.y = cy + len * Math.sin(ang);
          cx = node.x;
          cy = node.y;
          len = node.size;
        }
        for (let i = 0; i < this.nodes.length; i++) {
          const node = this.nodes[i];
          node.absAngle = Math.atan2(node.y - node.parent.y, node.x - node.parent.x);
          node.relAngle = node.absAngle - node.parent.absAngle;
          for (let ii = 0; ii < node.children.length; ii++) {
            const childNode = node.children[ii];
            if (!this.nodes.includes(childNode)) {
              childNode.updateRelative(true, false);
            }
          }
        }
      }
      update(x: number, y: number) {
        this.moveTo(Input.mouse.x, Input.mouse.y);
      }
    }

    class LegSystem extends LimbSystem {
      goalX: number;
      goalY: number;
      step: number;
      forwardness: number;
      reach: number;
      swing: number;
      swingOffset: number;

      constructor(end: any, length: number, speed: number, creature: any, dist?: number) {
        super(end, length, speed, creature);
        this.goalX = end.x;
        this.goalY = end.y;
        this.step = 0;
        this.forwardness = 0;
        this.reach = 0.9 * Math.hypot(this.end.x - this.hip.x, this.end.y - this.hip.y);
        let relAngle = this.creature.absAngle - Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x);
        relAngle -= 2 * Math.PI * Math.floor(relAngle / (2 * Math.PI) + 1 / 2);
        this.swing = -relAngle + (2 * (relAngle < 0 ? 1 : 0) - 1) * Math.PI / 2;
        this.swingOffset = this.creature.absAngle - this.hip.absAngle;
      }
      update(x: number, y: number) {
        this.moveTo(this.goalX, this.goalY);
        if (this.step === 0) {
          const dist = Math.hypot(this.end.x - this.goalX, this.end.y - this.goalY);
          if (dist > 1) {
            this.step = 1;
            this.goalX =
              this.hip.x +
              this.reach * Math.cos(this.swing + this.hip.absAngle + this.swingOffset) +
              (2 * Math.random() - 1) * this.reach / 2;
            this.goalY =
              this.hip.y +
              this.reach * Math.sin(this.swing + this.hip.absAngle + this.swingOffset) +
              (2 * Math.random() - 1) * this.reach / 2;
          }
        } else if (this.step === 1) {
          const theta = Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x) - this.hip.absAngle;
          const dist = Math.hypot(this.end.x - this.hip.x, this.end.y - this.hip.y);
          const forwardness2 = dist * Math.cos(theta);
          const dF = this.forwardness - forwardness2;
          this.forwardness = forwardness2;
          if (dF * dF < 1) {
            this.step = 0;
            this.goalX = this.hip.x + (this.end.x - this.hip.x);
            this.goalY = this.hip.y + (this.end.y - this.hip.y);
          }
        }
      }
    }

    class Creature {
      x: number;
      y: number;
      absAngle: number;
      fSpeed: number;
      fAccel: number;
      fFric: number;
      fRes: number;
      fThresh: number;
      rSpeed: number;
      rAccel: number;
      rFric: number;
      rRes: number;
      rThresh: number;
      speed: number = 0;
      children: any[];
      systems: any[];

      constructor(
        x: number, y: number, angle: number,
        fAccel: number, fFric: number, fRes: number, fThresh: number,
        rAccel: number, rFric: number, rRes: number, rThresh: number
      ) {
        this.x = x;
        this.y = y;
        this.absAngle = angle;
        this.fSpeed = 0;
        this.fAccel = fAccel;
        this.fFric = fFric;
        this.fRes = fRes;
        this.fThresh = fThresh;
        this.rSpeed = 0;
        this.rAccel = rAccel;
        this.rFric = rFric;
        this.rRes = rRes;
        this.rThresh = rThresh;
        this.children = [];
        this.systems = [];
      }
      follow(x: number, y: number) {
        if (!ctx) return;
        const dist = Math.hypot(this.x - x, this.y - y);
        const angle = Math.atan2(y - this.y, x - this.x);
        let accel = this.fAccel;
        if (this.systems.length > 0) {
          let sum = 0;
          for (let i = 0; i < this.systems.length; i++) {
            if (this.systems[i].step === 0) sum++;
          }
          accel *= sum / this.systems.length;
        }
        if (dist > this.fThresh) this.fSpeed += accel;
        this.fSpeed *= 1 - this.fRes;
        this.speed = Math.max(0, this.fSpeed - this.fFric);

        let dif = this.absAngle - angle;
        dif -= 2 * Math.PI * Math.floor(dif / (2 * Math.PI) + 1 / 2);
        if (Math.abs(dif) > this.rThresh && dist > this.fThresh) {
          this.rSpeed -= this.rAccel * (2 * (dif > 0 ? 1 : 0) - 1);
        }
        this.rSpeed *= 1 - this.rRes;
        if (Math.abs(this.rSpeed) > this.rFric) {
          this.rSpeed -= this.rFric * (2 * (this.rSpeed > 0 ? 1 : 0) - 1);
        } else {
          this.rSpeed = 0;
        }

        this.absAngle += this.rSpeed;
        this.absAngle -= 2 * Math.PI * Math.floor(this.absAngle / (2 * Math.PI) + 1 / 2);
        this.x += this.speed * Math.cos(this.absAngle);
        this.y += this.speed * Math.sin(this.absAngle);
        this.absAngle += Math.PI;
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].follow(true, true);
        }
        for (let i = 0; i < this.systems.length; i++) {
          this.systems[i].update(x, y);
        }
        this.absAngle -= Math.PI;
        this.draw(true);
      }
      draw(iter: boolean) {
        if (!ctx) return;
        const r = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, Math.PI / 4 + this.absAngle, 7 * Math.PI / 4 + this.absAngle);
        ctx.moveTo(
          this.x + r * Math.cos(7 * Math.PI / 4 + this.absAngle),
          this.y + r * Math.sin(7 * Math.PI / 4 + this.absAngle)
        );
        ctx.lineTo(
          this.x + r * Math.cos(this.absAngle) * Math.sqrt(2),
          this.y + r * Math.sin(this.absAngle) * Math.sqrt(2)
        );
        ctx.lineTo(
          this.x + r * Math.cos(Math.PI / 4 + this.absAngle),
          this.y + r * Math.sin(Math.PI / 4 + this.absAngle)
        );
        ctx.stroke();
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].draw(true);
          }
        }
      }
    }

    let critter: Creature;
    function setupLizard(size: number, legs: number, tail: number) {
      const s = size;
      critter = new Creature(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        s * 10, s * 2, 0.5, 16, 0.5, 0.085, 0.5, 0.3
      );
      let spinal: any = critter;
      for (let i = 0; i < 6; i++) {
        spinal = new Segment(spinal, s * 4, 0, 3.1415 * 2 / 3, 1.1);
        for (let ii = -1; ii <= 1; ii += 2) {
          let node = new Segment(spinal, s * 3, ii, 0.1, 2);
          for (let iii = 0; iii < 3; iii++) {
            node = new Segment(node, s * 0.1, -ii * 0.1, 0.1, 2);
          }
        }
      }
      for (let i = 0; i < legs; i++) {
        if (i > 0) {
          for (let ii = 0; ii < 6; ii++) {
            spinal = new Segment(spinal, s * 4, 0, 1.571, 1.5);
            for (let iii = -1; iii <= 1; iii += 2) {
              let node = new Segment(spinal, s * 3, iii * 1.571, 0.1, 1.5);
              for (let iv = 0; iv < 3; iv++) {
                node = new Segment(node, s * 3, -iii * 0.3, 0.1, 2);
              }
            }
          }
        }
        for (let ii = -1; ii <= 1; ii += 2) {
          let node = new Segment(spinal, s * 12, ii * 0.785, 0, 8);
          node = new Segment(node, s * 16, -ii * 0.785, 6.28, 1);
          node = new Segment(node, s * 16, ii * 1.571, 3.1415, 2);
          for (let iii = 0; iii < 4; iii++) {
            new Segment(node, s * 4, (iii / 3 - 0.5) * 1.571, 0.1, 4);
          }
          new LegSystem(node, 3, s * 12, critter, 4);
        }
      }
      for (let i = 0; i < tail; i++) {
        spinal = new Segment(spinal, s * 4, 0, 3.1415 * 2 / 3, 1.1);
        for (let ii = -1; ii <= 1; ii += 2) {
          let node = new Segment(spinal, s * 3, ii, 0.1, 2);
          for (let iii = 0; iii < 3; iii++) {
            node = new Segment(node, s * 3 * (tail - i) / tail, -ii * 0.1, 0.1, 2);
          }
        }
      }
    }

    if (ctx) {
      canvas.style.backgroundColor = "transparent";
      ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"; // giving it a cool hacker green look
    }

    const legNum = Math.floor(1 + Math.random() * 12);
    setupLizard(8 / Math.sqrt(legNum), legNum, Math.floor(4 + Math.random() * legNum * 8));

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (ctx) ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
    };
    window.addEventListener("resize", onResize);

    const intervalId = setInterval(() => {
      if (ctx && isVisible) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Input.mouse.x = x;
        Input.mouse.y = y;
        if (critter) critter.follow(Input.mouse.x, Input.mouse.y);
      }
    }, 33);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
