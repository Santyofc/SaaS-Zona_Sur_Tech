"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MouseState {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  isMoving: boolean;
  isTouching: boolean;
  scrollY: number;
}

const MouseContext = createContext<MouseState>({
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0,
  isMoving: false,
  isTouching: false,
  scrollY: 0,
});

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    isMoving: false,
    isTouching: false,
    scrollY: 0,
  });

  useEffect(() => {
    let timeout: any;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseState((prev: MouseState) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        prevX: prev.x,
        prevY: prev.y,
        isMoving: true,
        isTouching: false,
      }));

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMouseState((prev: MouseState) => ({ ...prev, isMoving: false }));
      }, 100);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      setMouseState((prev: MouseState) => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY,
        prevX: prev.x,
        prevY: prev.y,
        isMoving: true,
        isTouching: true,
      }));

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMouseState((prev: MouseState) => ({ ...prev, isMoving: false }));
      }, 100);
    };

    const handleScroll = () => {
      setMouseState((prev: MouseState) => ({
        ...prev,
        scrollY: window.scrollY,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <MouseContext.Provider value={mouseState}>
      {children}
    </MouseContext.Provider>
  );
};

export const useMouse = () => useContext(MouseContext);
