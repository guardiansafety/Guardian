import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import L from 'leaflet';
import moment from 'moment-timezone';
import styles from './MapTestDaniel.module.css';

const getColorByUsername = (username) => {
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['FF0000', '0000FF', '00FF00', 'FFA500', '800080'];
  return colors[hash % colors.length];
};

const EmergencyMap = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmergencies();
    } else {
      loginWithRedirect();
    }
  }, [isAuthenticated]);

  const fetchEmergencies = async () => {
    try {
      const response = await axios.get('http://localhost:3006/get-all-emergencies');
      setEmergencies(response.data);
      alert(JSON.stringify(response.data, null, 2)); // Debugging alert
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      alert(`Error: ${error.message}`); // Show the error message
    }
  };

  return (
    <MapContainer center={[43.6532, -79.3832]} zoom={12} className={styles.mapContainer}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {emergencies.map((event, index) => {
        if (!event.location || event.location.latitude === undefined || event.location.longitude === undefined) {
          return null;
        }

        const position = [event.location.latitude, event.location.longitude];
        const color = getColorByUsername(event.username);

        const icon = new L.Icon({
          iconUrl: `https://dummyimage.com/40x40/${color}/000000&text=%20`,
          iconSize: [40, 40], // Increased size for better visibility
          iconAnchor: [20, 40], // Adjust anchor to center the icon
          className: styles.icon,
        });

        return (
          <Marker key={index} position={position} icon={icon}>
            <Popup>
              <div className={styles.popupContent}>
                <p><strong>User:</strong> {event.username}</p>
                <p><strong>Location:</strong> {event.location.latitude}, {event.location.longitude}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Timestamp:</strong> {moment(event.timestamp).tz("America/Toronto").format('YYYY-MM-DD HH:mm:ss')}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default EmergencyMap;
