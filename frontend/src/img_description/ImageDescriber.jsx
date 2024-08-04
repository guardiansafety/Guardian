import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import Modal from 'react-modal';
import { FaCamera, FaUpload, FaAmbulance, FaFireExtinguisher, FaFirstAid, FaPhoneVolume } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingSpinner from '../LoadingSpinner';
import Notification from '../Notification';
import styles from './ImageDescriber.module.css';

Modal.setAppElement('#root');

const ImageDescriber = () => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [location, setLocation] = useState(null);
  const [notification, setNotification] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation not available");
    }
  }, []);

  const handleFileChange = async (event) => {
    const newFiles = [...selectedFiles, ...event.target.files];
    setSelectedFiles(newFiles);
    await submitImages(newFiles);
  };

  const handleCameraClick = () => {
    if (isMobile) {
      fileInputRef.current.click();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCapture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    fetch(imageSrc)
      .then(res => res.blob())
      .then(async blob => {
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        const newFiles = [...selectedFiles, file];
        setSelectedFiles(newFiles);
        setIsModalOpen(false);
        await submitImages(newFiles);
      });
  }, [webcamRef, selectedFiles]);

  const submitImages = async (files) => {
    if (!isAuthenticated) {
      setNotification({ message: 'Attempting to log in...', type: 'info' });
      loginWithRedirect();
      return;
    }

    setLoading(true);
    setDescription('');
    setError('');

    try {
      const eventResponse = await axios.post(
        `http://localhost:3006/create-emergency-event/${user.nickname}`,
        {
          location,
          description: 'Emergency event',
          auth0Id: user.sub
        }
      );

      const { emergencyId } = eventResponse.data;

      const imageFormData = new FormData();
      files.forEach(file => {
        imageFormData.append('images', file);
      });

      const addImageResponse = await axios.post(
        `http://localhost:3006/add-emergency-image/${user.nickname}/${emergencyId}`,
        imageFormData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setDescription(addImageResponse.data.description);
      setDescriptionModalOpen(true);
      setNotification({ message: 'Emergency data sent successfully!', type: 'success' });
    } catch (err) {
      setError('Failed to get descriptions. Please try again.');
      console.error('Error submitting emergency data:', err);
      setNotification({ message: 'Failed to send emergency data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconsBackground}>
        <FaAmbulance className={`${styles.icon} ${styles.icon1}`} />
        <FaFireExtinguisher className={`${styles.icon} ${styles.icon2}`} />
        <FaFirstAid className={`${styles.icon} ${styles.icon3}`} />
        <FaPhoneVolume className={`${styles.icon} ${styles.icon4}`} />
      </div>
      <h1 className={styles.heading}>
        Record Emergency
      </h1>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
        />
        <div className={styles.buttonsContainer}>
          <button className={styles.button} onClick={handleCameraClick}>
            <FaCamera className={styles.buttonIcon} /> Take a Photo
          </button>
          <label className={styles.button}>
            <FaUpload className={styles.buttonIcon} /> Upload Images
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
          </label>
        </div>
      </div>
      {error && (
        <div className={styles.error}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={styles.webcam}
        />
        <button type="button" className={styles.button} onClick={handleCapture}>
          Capture Photo
        </button>
      </Modal>
      {loading && <LoadingSpinner />}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Modal
        isOpen={descriptionModalOpen}
        onRequestClose={() => setDescriptionModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.modalContent}>
          <h2>Description</h2>
          <p>{description}</p>
          {selectedFiles.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`uploaded-${index}`} className={styles.uploadedImage} />
          ))}
          <button className={styles.button} onClick={() => setDescriptionModalOpen(false)}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ImageDescriber;
