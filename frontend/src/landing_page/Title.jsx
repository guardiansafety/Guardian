import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated, config, useTrail } from '@react-spring/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './Title.module.css';

const TitleSection = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const [titleItems] = useState(() => [
    { text: 'Welcome to Safety First', className: styles.title },
    { text: 'Your Safety, Our Priority', className: styles.subtitle }
  ]);

  const trail = useTrail(titleItems.length, {
    from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  const buttonProps = useSpring({
    scale: isHovered ? 1.1 : 1,
    boxShadow: isHovered
      ? '0 0 30px rgba(166, 75, 0, 0.9), 0 0 60px rgba(166, 75, 0, 0.6)'
      : '0 0 20px rgba(166, 75, 0, 0.6)',
    config: { mass: 1, tension: 500, friction: 15 },
  });

  const iconProps = useSpring({
    transform: isHovered ? 'translateY(-5px) rotate(-15deg)' : 'translateY(0) rotate(0deg)',
    config: { tension: 300, friction: 10 },
  });

  const textProps = useSpring({
    transform: isHovered ? 'translateY(2px)' : 'translateY(0)',
    config: { tension: 300, friction: 10 },
  });

  const launchProps = useSpring({
    opacity: isLaunching ? 0 : 1,
    scale: isLaunching ? 2 : 1,
    filter: isLaunching ? 'blur(20px)' : 'blur(0px)',
    config: { tension: 120, friction: 14 },
  });

  const handleLaunch = useCallback(() => {
    setIsLaunching(true);
  }, []);

  useEffect(() => {
    if (isLaunching) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/auth');
        }
      }, 1000); // Increased delay to 1000ms (1 second) for a more noticeable effect
      return () => clearTimeout(timer);
    }
  }, [isLaunching, isAuthenticated, navigate]);

  const handleScroll = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <animated.div className={`${styles.landingPage} ${isLaunching ? styles.launching : ''}`} style={launchProps}>
      <div className={styles.videoContainer}>
        <video className={styles.backgroundVideo} autoPlay loop muted>
          <source src="/earth.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className={styles.header}>
        {trail.map((props, index) => (
          <animated.div key={index} style={props}>
            <div className={titleItems[index].className}>{titleItems[index].text}</div>
          </animated.div>
        ))}
      </div>

      <div className={styles.buttonWrapper}>
        <animated.button
          className={styles.launchButton}
          style={buttonProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleLaunch}
        >
          <animated.div style={iconProps}>
            <FontAwesomeIcon icon={faShieldAlt} className={styles.icon} />
          </animated.div>
          <animated.span style={textProps}>Get Started</animated.span>
        </animated.button>
      </div>

      <div className={styles.bottomFade}></div>
      <animated.div className={styles.bobbingArrow} onClick={handleScroll} style={useSpring({
        from: { transform: 'translateY(0px)' },
        to: async (next) => {
          while (true) {
            await next({ transform: 'translateY(-10px)' });
            await next({ transform: 'translateY(0px)' });
          }
        },
        config: { tension: 300, friction: 10 },
      })}>
        <FontAwesomeIcon icon={faArrowDown} />
      </animated.div>
    </animated.div>
  );
};

export default TitleSection;