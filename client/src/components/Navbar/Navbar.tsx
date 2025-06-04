import { FC, useContext } from 'react';
import styles from './Navbar.module.css';
import { AuthContext } from '@/context/Auth/AuthContext';
import { FaChevronDown } from 'react-icons/fa';

const Navbar: FC = () => {
  const { currentUser } = useContext(AuthContext);
  const avatarUrl = currentUser?.photoURL || '/assets/logo-survive-the-league.png';

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoSection}>
        <img src="/assets/logo-survive-the-league.png" alt="Survive The League" className={styles.logoImg} />
      </div>
      <div className={styles.rightSection}>
        <span className={styles.dashboardText}>Dashboard</span>
        <div className={styles.userMenu}>
          <img src={avatarUrl} alt="avatar" className={styles.avatar} />
          <FaChevronDown className={styles.chevron} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 