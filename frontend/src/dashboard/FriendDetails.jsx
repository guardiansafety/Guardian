import { X } from 'lucide-react';
import styles from './FriendDetails.module.css';

const FriendDetails = ({ friend, onClose }) => {
  if (!friend) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.detailsContainer}>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={24} />
        </button>
        <img
          src={friend.image}
          alt={friend.name}
          className={styles.largeImage}
        />
        <h2 className={styles.name}>{friend.name}</h2>
      </div>
    </div>
  );
};

export default FriendDetails;