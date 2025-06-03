import { FC } from "react";
import styles from "./Login.module.css";

const Login:FC = () => {
  return (
    <div className={styles.loginBg}>
      <div className={styles.leftOverlay}>
        <img src="/logo.png" alt="Survive The League Logo" className={styles.logo} />
      </div>
      <div className={styles.rightBg}></div>
      <div className={styles.loginCard}>
        <h2>Welcome back</h2>
        <p className={styles.subtitle}>Please enter your details.</p>
        <form className={styles.form}>
          <label>Email</label>
          <input type="email" placeholder="Enter your email" />
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember for 30 days
            </label>
            <a href="/forgot-password" className={styles.forgot}>Forgot Password</a>
          </div>
          <button type="submit" className={styles.signInBtn}>Sign In</button>
          <button type="button" className={styles.googleBtn}>
            <img src="/google-icon.svg" alt="Google" className={styles.googleIcon} />
            Sign in with Google
          </button>
        </form>
        <div className={styles.signupRow}>
          Don't have an account? <a href="#" className={styles.signupLink}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login; 