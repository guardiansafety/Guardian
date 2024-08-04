// src/LoadingSpinner.js
import React from 'react';
import { useSpring, animated, config } from '@react-spring/web';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = () => {
  const spin = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    config: { duration: 1500 },
  });

  const pulse = useSpring({
    loop: true,
    from: { scale: 1 },
    to: [{ scale: 1.2 }, { scale: 1 }],
    config: config.gentle,
  });

  return (
    <div className={styles.loadingContainer}>
      <animated.div className={styles.spinnerOuter} style={spin}>
        <animated.div className={styles.spinnerInner} style={pulse} />
      </animated.div>
    </div>
  );
};

export default LoadingSpinner;