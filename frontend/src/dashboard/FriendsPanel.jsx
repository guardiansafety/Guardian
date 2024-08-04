import { X, Users } from 'lucide-react';
import styles from './FriendsPanel.module.css';

const friends = [
  { name: 'Snoopy', image: '/snoopy.jpg', coordinates: [-79.39665, 43.6598], markerCount: 2 },
  { name: 'Pikachu', image: '/pikachu.jpg', coordinates: [-79.39825, 43.65835], markerCount: 2 },
  { name: 'BMO', image: '/bmo.jpg', coordinates: [-79.4044, 43.6667], markerCount: 2 },
  { name: 'Minion', image: '/minion.jpg', coordinates: [-122.4786, 37.8199], markerCount: 2 },
  { name: 'Stitch', image: '/stitch.jpg', coordinates: [116.3897, 39.9048], markerCount: 1 },
];

const FriendsPanel = ({ isOpen, onClose, onFriendClick }) => {
  if (!isOpen) {
    return (
      <button onClick={onClose} className={styles.toggleButton}>
        <Users size={24} />
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Friends</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={24} />
        </button>
      </div>
      <div className={styles.grid}>
        {friends.map((friend) => (
          <button
            key={friend.name}
            onClick={() => onFriendClick(friend)}
            className={styles.friendButton}
          >
            <img
              src={friend.image}
              alt={friend.name}
              className={styles.friendImage}
            />
            <span className={styles.friendName}>{friend.name}</span>
            {friend.markerCount > 0 && (
              <span className={styles.notificationCircle}>{friend.markerCount}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendsPanel;