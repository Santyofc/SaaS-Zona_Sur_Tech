import React from 'react';
import styles from './BikeProductCard.module.css';

export default function BikeProductCard() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      />
      <div className={styles.container}>
        <div className={styles.wrap}>
          <input className={styles.initial} type="checkbox" />
          <input className={styles.wheel1} name="wheel" type="radio" />
          <input className={styles.wheel2} name="wheel" type="radio" />
          <input className={styles.wheel3} name="wheel" type="radio" />
          <input className={styles.wheel4} name="wheel" type="radio" />
          <input className={styles.buy} type="checkbox" />
          <h1>Configure the Bike</h1>
          <h2>Added to Cart</h2>
          <h3>Wheels</h3>

          <div className={styles.wheeltoggle}></div>
          <div className={styles.wheeltoggle}></div>
          <div className={styles.wheeltoggle}></div>
          <div className={styles.wheeltoggle}></div>

          <div className={styles.buy}></div>
          <div className={`${styles.toggle} ${styles.expand}`}>
            <i className="fas fa-bicycle"></i>
          </div>
          <div className={styles.toggle}>
            <i className="fas fa-bicycle"></i>
          </div>
          <div className={styles.background}></div>
          <div className={styles.frame}>
            <div className={styles.rear}></div>
            <div className={styles.stem}></div>
            <div className={styles.shaft}></div>
            <div className={styles.seat}></div>

            <div className={`${styles.wheel} ${styles.one} ${styles.front}`}>
              <div className={styles.inner}></div>
            </div>

            <div className={`${styles.wheel} ${styles.one} ${styles.back}`}>
              <div className={styles.inner}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
