import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from './ColorTheme';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, loginWithRedirect } = useAuth0();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && user?.nickname) {
        try {
          const response = await fetch(`http://localhost:3006/profile?username=${user.nickname}`);
          if (response.ok) {
            const data = await response.json();
            setUsername(data.username);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <div className={styles.userInfo}>
          {isAuthenticated && username && (
            <span className={styles.userName}>Welcome, {username}</span>
          )}
        </div>
        <div className={styles.navLinksContainer}>
          <div className={styles.navLinks}>
            <CustomNavLink to="/">Home</CustomNavLink>
            <CustomNavLink to="/dashboard">Dashboard</CustomNavLink>
            <CustomNavLink to="/describe">Describe</CustomNavLink>
            <CustomNavLink to="/profile">Profile</CustomNavLink>
            <CustomNavLink to="/mapTest">Map</CustomNavLink>
          </div>
        </div>
        <div className={styles.authButtonContainer}>
          {isAuthenticated ? (
            <button
              className={styles.authButton}
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
          ) : (
            <button className={styles.authButton} onClick={() => loginWithRedirect()}>
              Log In
            </button>
          )}
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
};

const CustomNavLink = ({ to, children }) => {
  return (
    <NavLink to={to} className={styles.navLink}>
      {children}
    </NavLink>
  );
};

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <div className={styles.themeToggle} onClick={toggleTheme}>
      <div className={`${styles.slider} ${theme === 'dark' ? styles.dark : styles.light}`}>
        <div className={styles.icon}>{theme === 'dark' ? <FaMoon /> : <FaSun />}</div>
      </div>
    </div>
  );
};

export default Navbar;
