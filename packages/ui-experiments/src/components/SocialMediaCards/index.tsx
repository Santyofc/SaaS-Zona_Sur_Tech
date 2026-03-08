"use client";

import React, { useEffect, useRef } from "react";
import styles from "./SocialMediaCards.module.css";

export default function SocialMediaCards() {
    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cardsContainer = cardsRef.current;
        if (!cardsContainer) return;

        const handleMouseMove = (e: MouseEvent) => {
            const cards = cardsContainer.querySelectorAll(`.${styles.card}`);
            for (const card of cards as any) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        };

        cardsContainer.addEventListener("mousemove", handleMouseMove);
        return () => {
            cardsContainer.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className={styles.baseWrap}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
            
            <div className={styles.cards} ref={cardsRef}>
                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <i className="fa-brands fa-instagram"></i>
                        <h2>Instagram</h2>
                        <p>Followers : <span>625k</span></p>
                        <a href="#">
                            <i className="fa-solid fa-link"></i>
                            <span>Follow me</span>
                        </a>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <i className="fa-brands fa-github"></i>
                        <h2>Github</h2>
                        <p>Followers : <span>150k</span></p>
                        <a href="#">
                            <i className="fa-solid fa-link"></i>
                            <span>Follow me</span>
                        </a>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardContent}>
                        <i className="fa-brands fa-linkedin"></i>
                        <h2>Linkedin</h2>
                        <p>Connection : <span>100k</span></p>
                        <a href="#">
                            <i className="fa-solid fa-link"></i>
                            <span>Connect</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
