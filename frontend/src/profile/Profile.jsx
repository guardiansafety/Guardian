import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [details, setDetails] = useState({ email: '', username: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3006/profile?username=${user.nickname || user.name}`);
      if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Fetched profile data:', data);
      setDetails({ email: data.email || user.email, username: data.username || user.nickname || user.name });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getAccessTokenSilently();
      console.log('Sending update request with data:', {
        auth0Id: user.sub,
        email: details.email,
        username: details.username,
      });
      const response = await fetch('http://localhost:3006/create-or-update-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0Id: user.sub,
          email: details.email,
          username: details.username,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      const updatedUser = await response.json();
      console.log('Profile updated successfully:', updatedUser);
      alert('Profile updated successfully!');
      
      // Refetch the profile data to verify the update
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>Update Profile</h1>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.formLabel}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={details.username}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={details.email}
            onChange={handleChange}
            className={styles.formInput}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;