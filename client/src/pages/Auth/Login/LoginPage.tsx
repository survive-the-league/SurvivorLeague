import styles from './LoginPage.module.css';

export const LoginPage = () => {
    return (
        <div className={styles.loginBg}>
            <img src="/assets/logo-survive-the-league.png" alt="Survive The League Logo" className={styles.logo} />
            <div className={styles.leftHalf}></div>
            <div className={styles.rightHalf}></div>
            <div className={styles.loginCard}>
                <h2 className={styles.title}>Welcome back</h2>
                <p className={styles.subtitle}>Please enter your details.</p>
                <form className={styles.form} autoComplete="off">
                    <input id="email" type="email" placeholder="Enter your email" className={styles.input} autoComplete="username" />
                    <input id="password" type="password" placeholder="Password" className={styles.input} autoComplete="current-password" />
                    <div className={styles.optionsRow}>
                        <label className={styles.checkboxLabel}>
                            <input type="checkbox" /> Remember for 30 days
                        </label>
                        <a href="/forgot-password" className={styles.forgot}>Forgot Password</a>
                    </div>
                    <button type="submit" className={styles.signInBtn}>Sign In</button>
                    <div className={styles.divider}><span>or</span></div>
                    <button type="button" className={styles.googleBtn}>
                        <img src="/assets/google-icon.png" alt="Google" className={styles.googleIcon} />
                        Sign in with Google
                    </button>
                </form>
                <div className={styles.signupRow}>
                    Don&apos;t have an account? <a href="/signup" className={styles.signupLink}>Sign Up</a>
                </div>
            </div>
        </div>
    );
};