import { useState } from 'react';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlasses, faBolt, faCamera, faMicrophone, faRobot, faMobile } from '@fortawesome/free-solid-svg-icons';
import styles from './Features.module.css';

const StepCard = ({ icon, title, description, index, activeIndex, setActiveIndex }) => {
  const isActive = index === activeIndex;
  
  const props = useSpring({
    scale: isActive ? 1.05 : 1,
    boxShadow: isActive ? '0 10px 30px rgba(255, 255, 255, 0.2)' : '0 5px 15px rgba(255, 255, 255, 0.1)',
    config: config.wobbly,
  });

  return (
    <animated.div 
      style={props} 
      className={styles.stepCard}
      onMouseEnter={() => setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(-1)}
    >
      <FontAwesomeIcon icon={icon} className={styles.stepIcon} />
      <h3>{title}</h3>
      <p>{description}</p>
    </animated.div>
  );
};

const FeaturesSection = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const steps = [
    {
      icon: faGlasses,
      title: 'Wearable Integration',
      description: 'Seamlessly integrate our compact hardware into everyday items for discreet protection.',
    },
    {
      icon: faBolt,
      title: 'Quick Activation',
      description: 'Activate the device instantly with a simple, customizable action in emergency situations.',
    },
    {
      icon: faCamera,
      title: 'Rapid Image Capture',
      description: 'Instantly capture high-quality images of your surroundings for comprehensive situational awareness.',
    },
    {
      icon: faMicrophone,
      title: 'Audio Recording',
      description: 'Record audio to provide crucial context and verbal evidence during emergencies.',
    },
    {
      icon: faRobot,
      title: 'AI Analysis',
      description: 'Leverage advanced AI to analyze captured data and generate detailed situation reports.',
    },
    {
      icon: faMobile,
      title: 'Instant Alerts',
      description: 'Automatically send analyzed data, images, and audio to your emergency contacts or authorities.',
    },
  ];

  const trail = useTrail(steps.length, {
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.molasses,
  });

  const headingProps = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: config.molasses,
  });

  return (
    <section className={styles.featuresSection}>
      <div className={styles.backgroundAnimation}></div>
      <animated.div style={headingProps} className={styles.headingContainer}>
        <h2>How Safety First Works</h2>
        <p className={styles.sectionDescription}>
          Experience the future of personal safety with our cutting-edge technology. 
          Discover how Safety First's innovative system keeps you protected:
        </p>
      </animated.div>
      <div className={styles.stepsGrid}>
        {trail.map((props, index) => (
          <animated.div key={index} style={props}>
            <StepCard 
              {...steps[index]} 
              index={index}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;