import { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import styles from './Notification.module.css';

const Notification = ({ message, type, onClose }) => {
  const props = useSpring({
    opacity: 1,
    transform: 'translateY(0px)',
    from: { opacity: 0, transform: 'translateY(-40px)' },
    config: { tension: 300, friction: 10 },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <animated.div style={props} className={`${styles.notification} ${styles[type]}`}>
      {message}
    </animated.div>
  );
};

export default Notification;
