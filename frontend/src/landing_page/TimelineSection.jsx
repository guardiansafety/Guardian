import { useSpring, animated, config } from 'react-spring';
import { useInView } from 'react-intersection-observer';
import { FaRegBell, FaMobileAlt, FaMapMarkerAlt, FaMicrochip, FaShieldAlt, FaSatellite, FaRobot } from 'react-icons/fa';
import styles from './TimelineSection.module.css';

const timelineData = [
  { year: '1960s', event: 'Introduction of the first personal alarm systems', icon: FaRegBell },
  { year: '1980s', event: 'Mobile phones begin to impact personal safety', icon: FaMobileAlt },
  { year: '1990s', event: 'Satellite technology enhances global communication', icon: FaSatellite },
  { year: '2000s', event: 'GPS tracking enhances location-based safety features', icon: FaMapMarkerAlt },
  { year: '2010s', event: 'Smartphone apps revolutionize personal security', icon: FaMobileAlt },
  { year: '2020s', event: 'AI-powered, wearable safety devices emerge', icon: FaMicrochip },
  { year: '2023', event: 'Advanced robotics integrated into security systems', icon: FaRobot },
];

const TimelineItem = ({ year, event, icon: Icon, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const style = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : `translateY(${index % 2 === 0 ? '-30px' : '30px'})`,
    config: config.gentle,
  });

  return (
    <animated.div
      ref={ref}
      className={`${styles.timelineItem} ${index % 2 === 0 ? styles.left : styles.right}`}
      style={style}
    >
      <div className={styles.timelineItemContent}>
        <div className={styles.iconContainer}>
          <Icon className={styles.icon} />
        </div>
        <span className={styles.tag}>{year}</span>
        <p>{event}</p>
        <span className={styles.circle} />
      </div>
    </animated.div>
  );
};

const TimelineSection = () => {
  const [todayRef, todayInView] = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const todayStyle = useSpring({
    opacity: todayInView ? 1 : 0,
    transform: todayInView ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
    config: config.gentle,
  });

  return (
    <section className={styles.timelineSection}>
      <h2>The Evolution of Personal Safety</h2>
      <div className={styles.timelineContainer}>
        {timelineData.map((data, idx) => (
          <TimelineItem key={idx} year={data.year} event={data.event} icon={data.icon} index={idx} />
        ))}
      </div>
      <div className={styles.todaySection}>
        <animated.div ref={todayRef} className={styles.todayItem} style={todayStyle}>
          <FaShieldAlt className={styles.icon} />
          <span className={styles.tag}>Today</span>
          <p>Safety First introduces next-gen personal security</p>
        </animated.div>
      </div>
    </section>
  );
};

export default TimelineSection;