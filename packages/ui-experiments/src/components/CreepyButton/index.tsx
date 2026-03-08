"use client";

import React, { useRef, useState } from "react";
import styles from "./CreepyButton.module.css";

export default function CreepyButton({ onClick, children = "Creepy Button" }: { onClick?: () => void, children?: React.ReactNode }) {
	const eyesRef = useRef<HTMLSpanElement>(null);
	const [eyeCoords, setEyeCoords] = useState({ x: 0, y: 0 });

	const translateX = `${-50 + eyeCoords.x * 50}%`;
	const translateY = `${-50 + eyeCoords.y * 50}%`;

	const eyeStyle = {
		transform: `translate(${translateX}, ${translateY})`,
	};

	const updateEyes = (e: React.MouseEvent | React.TouchEvent) => {
		const userEvent = "touches" in e ? e.touches[0] : (e as React.MouseEvent);

		const eyesRect = eyesRef.current?.getBoundingClientRect();
		if (!eyesRect) return;

		const eyes = {
			x: eyesRect.left + eyesRect.width / 2,
			y: eyesRect.top + eyesRect.height / 2,
		};

		const cursor = {
			x: userEvent.clientX,
			y: userEvent.clientY,
		};

		const dx = cursor.x - eyes.x;
		const dy = cursor.y - eyes.y;
		const angle = Math.atan2(-dy, dx) + Math.PI / 2;

		const visionRangeX = 180;
		const visionRangeY = 75;

		const distance = Math.hypot(dx, dy);
		const x = (Math.sin(angle) * distance) / visionRangeX;
		const y = (Math.cos(angle) * distance) / visionRangeY;

		setEyeCoords({ x, y });
	};

	return (
        <div className={styles.container}>
            <link rel="stylesheet" href="https://fonts.bunny.net/css?family=londrina-solid:400" />
            <button 
                className={styles.creepyBtn}
                type="button"
                onClick={onClick}
                onMouseMove={updateEyes}
                onTouchMove={updateEyes}
            >
                <span className={styles.eyes} ref={eyesRef}>
                    <span className={styles.eye}>
                        <span className={styles.pupil} style={eyeStyle} />
                    </span>
                    <span className={styles.eye}>
                        <span className={styles.pupil} style={eyeStyle} />
                    </span>
                </span>
                <span className={styles.cover}>{children}</span>
            </button>
        </div>
	);
}
