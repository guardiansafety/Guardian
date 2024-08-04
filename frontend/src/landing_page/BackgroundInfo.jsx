import { useSpring, animated, useTrail, useChain, useSpringRef } from '@react-spring/web';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faShieldAlt, faUserFriends, faChartLine, faClock, faBell, faMapMarkedAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import styles from './BackgroundInfo.module.css';

const StatCard = ({ icon, title, value, description }) => {
  const props = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 500,
  });

  return (
    <animated.div style={props} className={styles.statCard}>
      <FontAwesomeIcon icon={icon} className={styles.statIcon} />
      <h3>{title}</h3>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statDescription}>
        {description.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </animated.div>
  );
};

const BackgroundInfoSection = () => {
  const stats = [
    {
      icon: faExclamationTriangle,
      title: 'Annual Incidents',
      value: '3M',
      description: ['Reported worldwide'],
    },
    {
      icon: faShieldAlt,
      title: 'Response Time',
      value: '8 Min',
      description: ['Average police response'],
    },
    {
      icon: faUserFriends,
      title: 'Feeling Unsafe',
      value: '35%',
      description: ['Walking alone'],
    },
    {
      icon: faChartLine,
      title: 'Crime Increase',
      value: '4.2%',
      description: ['Annual rise'],
    },
    {
      icon: faClock,
      title: 'Critical Window',
      value: '2-4 Min',
      description: ['For intervention'],
    },
    {
      icon: faBell,
      title: 'Alert Time',
      value: '5 Sec',
      description: ['To notify contacts'],
    },
    {
      icon: faMapMarkedAlt,
      title: 'Safety Hotspots',
      value: '100+',
      description: ['Identified in major cities'],
    },
    {
      icon: faKey,
      title: 'Protection',
      value: '24/7',
      description: ['Always on guard'],
    },
  ];

  const contentRef = useSpringRef();
  const contentProps = useSpring({
    ref: contentRef,
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  const trailRef = useSpringRef();
  const trailStats = useTrail(stats.length, {
    ref: trailRef,
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  useChain([contentRef, trailRef], [0, 0.5]);

  return (
    <section className={styles.backgroundInfoSection}>
      <animated.div style={contentProps} className={styles.content}>
        <h2>Why Safety First Matters</h2>
        <p>
          In today's world, personal safety is crucial. Safety First ensures rapid response and immediate alerts to keep you safe.
        </p>
      </animated.div>

      <div className={styles.statsContainer}>
        {trailStats.map((props, index) => (
          <animated.div key={index} style={props}>
            <StatCard {...stats[index]} />
          </animated.div>
        ))}
      </div>
    </section>
  );
};

export default BackgroundInfoSection;
