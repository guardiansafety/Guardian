import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Safety First</h3>
          <p>Empowering individuals with innovative personal safety solutions.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact Us</h4>
          <p>Email: info@safetyfirst.com</p>
          <p>Phone: (555) 123-4567</p>
          <p>Address: 123 Safety Street, Secure City, SC 12345</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Follow Us</h4>
          <div className={styles.socialIcons}>
            <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; 2024 Safety First. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;