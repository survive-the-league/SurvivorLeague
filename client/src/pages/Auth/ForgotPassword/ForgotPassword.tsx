import styles from "../Login/LoginPage.module.css";

export const ForgotPasswordPage = () => {
  return (
    <div className={styles.loginBg}>
      <img
        src="/assets/logo-survive-the-league.png"
        alt="Survive The League Logo"
        className={styles.logo}
      />
      <div className={styles.leftHalf}></div>
      <div className={styles.rightHalf}></div>
      <div className={styles.loginCard} style={{ marginTop: "40px" }}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>Please enter your email.</p>
        <form 
            className={styles.form} 
            autoComplete="off"
        >
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            autoComplete="username"
          />
          <a
            href="/login"
            className={styles.forgot}
            style={{ margin: "18px 0 0 0", fontSize: "1rem", fontWeight: 400 }}
          >
            Return To Login
          </a>
          <button
            type="submit"
            className={styles.signInBtn}
            style={{
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
