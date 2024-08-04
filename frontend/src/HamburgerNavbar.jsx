import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { FaBars, FaTimes, FaHome, FaBookOpen, FaFileExport } from 'react-icons/fa';
import { MdCreate, MdExpandMore } from 'react-icons/md';
import styles from './HamburgerNavbar.module.css';

const HamburgerNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleSubMenu = (subMenu) => {
    setOpenSubMenu(openSubMenu === subMenu ? null : subMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.nav}`) && !event.target.closest(`.${styles.hamburger}`)) {
        setIsOpen(false);
        setOpenSubMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuAnimation = useSpring({
    transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
  });

  const subMenuAnimation = useSpring({
    height: openSubMenu ? 'auto' : 0,
    opacity: openSubMenu ? 1 : 0,
  });

  const menuItems = [
    { name: 'Home', link: '/', icon: <FaHome /> },
    {
      name: 'Generate Content',
      icon: <MdCreate />,
      subMenu: [
        { name: 'Image & PDF Input', link: '/image' },
        { name: 'Text Input', link: '/text' },
        { name: 'URL Input', link: '/url' },
        { name: 'Audio Input', link: '/audio' },
        { name: 'Manual Input', link: '/manualinput' },
        { name: 'Daily Quiz', link: '/dailyquiz' },
      ],
    },
    { name: 'Study Your Decks!', link: '/study', icon: <FaBookOpen /> },
    { name: 'Export Your Questions', link: '/questionspdf', icon: <FaFileExport /> },
  ];

  return (
    <>
      <button className={styles.hamburger} onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <animated.nav className={styles.nav} style={menuAnimation}>
        <ul className={styles.menuList}>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.menuItem}>
              {item.subMenu ? (
                <div className={styles.submenuContainer}>
                  <button onClick={() => toggleSubMenu(item.name)} className={styles.menuLink}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.text}>{item.name}</span>
                    <MdExpandMore className={`${styles.arrow} ${openSubMenu === item.name ? styles.arrowUp : ''}`} />
                  </button>
                  {openSubMenu === item.name && (
                    <animated.ul className={styles.subMenu} style={subMenuAnimation}>
                      {item.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex} className={styles.subMenuItem}>
                          <Link to={subItem.link} className={styles.subMenuLink}>
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </animated.ul>
                  )}
                </div>
              ) : (
                <Link to={item.link} className={styles.menuLink}>
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.text}>{item.name}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </animated.nav>
    </>
  );
};

export default HamburgerNav;
