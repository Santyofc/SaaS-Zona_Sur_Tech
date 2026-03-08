"use client";
import { useEffect, useState } from 'react';
import type { CSSProperties } from "react";

import { useMouse } from "@repo/ui/src/MotionProvider";

export const ScrollBar = () => {
	const { scrollY } = useMouse();
	const [divHeight, setDivHeight] = useState<number>(0);

	useEffect(() => {
		const docHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		const scrollPercent = (scrollY / docHeight) * 100;
		setDivHeight(Math.min(scrollPercent, 98));
	}, [scrollY]);
	return (
		<div
			className='scroll-bar'
			style={{ top: `${divHeight}%`, "--p": `${divHeight * 100}%` } as CSSProperties}
		></div>
	);
};
