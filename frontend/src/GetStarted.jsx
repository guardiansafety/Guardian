import { useNavigate } from 'react-router-dom';
import styles from './GetStarted.module.css';

const GetStarted = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/auth');
  };

  return (
    <div className={styles.getStartedContainer}>
      <div className={styles.getStartedContent}>
        <h1>Welcome to Safety First</h1>
        <p>Your safety, our priority. Join us today to ensure a safer tomorrow.</p>
        <button className={styles.getStartedButton} onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default GetStarted;
