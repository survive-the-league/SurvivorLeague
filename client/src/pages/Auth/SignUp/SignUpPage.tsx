import styles from "../Login/LoginPage.module.css";

export const SignUpPage = () => {
  return (
    <div className={styles.loginBg}>
      <img
        src="/assets/logo-survive-the-league.png"
        alt="Survive The League Logo"
        className={styles.logo}
      />
      <div className={styles.leftHalf}></div>
      <div className={styles.rightHalf}></div>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Create an Account</h2>
        <p className={styles.subtitle}>Please enter your details.</p>
        <form className={styles.form} autoComplete="off">
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            autoComplete="username"
          />

          <input
            id="username"
            type="text"
            placeholder="Enter username"
            className={styles.input}
            autoComplete="username"
          />

          <input
            id="password"
            type="password"
            placeholder="Password"
            className={styles.input}
            autoComplete="new-password"
          />

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className={styles.input}
            autoComplete="new-password"
          />

          <button type="submit" className={styles.signInBtn}>
            Sign Up
          </button>
        </form>
        <div className={styles.divider}>
          <span>or</span>
        </div>
        <button type="button" className={styles.googleBtn}>
          <img
            src="/assets/google-icon.png"
            alt="Google"
            className={styles.googleIcon}
          />
          Sign up with Google
        </button>
        <div className={styles.signupRow}>
          Already have an account?{" "}
          <a href="/login" className={styles.signupLink}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};
