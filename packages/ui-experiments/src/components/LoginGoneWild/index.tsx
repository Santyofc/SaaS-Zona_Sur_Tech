"use client";

import React from "react";
import styles from "./LoginGoneWild.module.css";

interface LoginProps {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    loading?: boolean;
    error?: string;
}

export default function LoginGoneWild({ onSubmit, loading, error }: LoginProps = {}) {
    return (
        <div className={styles.container}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" />
            <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" async />
            <script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js" async />

            <div className={styles.glowingLight}></div>
            <div className={styles.loginBox}>
                <form onSubmit={onSubmit || ((e) => e.preventDefault())}>
                    {error && (
                        <div style={{ position: 'absolute', top: '-40px', left: 0, width: '100%', textAlign: 'center', color: '#ff0033', fontWeight: 'bold', textShadow: '0 0 10px #ff0033' }}>
                            {error}
                        </div>
                    )}
                    <input type="checkbox" className={styles.inputCheck} id="input-check" />
                    <label htmlFor="input-check" className={styles.toggle}>
                        <span className={`${styles.text} ${styles.textOff}`}>off</span>
                        <span className={`${styles.text} ${styles.textOn}`}>on</span>
                    </label>
                    <div className={styles.light}></div>

                    <h2>Login</h2>
                    <div className={styles.inputBox}>
                        <span className={styles.icon}>
                            {(React.createElement as any)("ion-icon", { name: "mail" })}
                        </span>
                        <input type="email" name="email" required placeholder=" " />
                        <label>Email</label>
                        <div className={styles.inputLine}></div>
                    </div>
                    <div className={styles.inputBox}>
                        <span className={styles.icon}>
                            {(React.createElement as any)("ion-icon", { name: "lock-closed" })}
                        </span>
                        <input type="password" name="password" required placeholder=" " />
                        <label>Password</label>
                        <div className={styles.inputLine}></div>
                    </div>
                    <div className={styles.rememberForgot}>
                        <label><input type="checkbox" /> Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                    <div className={styles.registerLink}>
                        <p>Don't have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
