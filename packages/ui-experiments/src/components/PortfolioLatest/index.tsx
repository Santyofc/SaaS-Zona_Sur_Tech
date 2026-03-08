"use client";
import React from "react";
import { MouseTrail } from './components/mouse-trail';
import { ScrollBar } from './components/scroll-bar';
import { AboutMe } from './sections/about-me.section';
import { InfoSection } from './sections/info.section';
import { TechStack } from './sections/tech-stack.section';

import styles from './PortfolioLatest.module.css';

export default function PortfolioLatest() {
	return (
		<div className={styles.container}>
			<ScrollBar />
			<MouseTrail />
			<InfoSection />
			<AboutMe />
			<TechStack />
		</div>
	);
}
