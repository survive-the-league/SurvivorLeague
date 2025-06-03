import { useContext, useState } from "react";
import styles from "./LoginPage.module.css";
import { AuthContext } from "@/context/Auth/AuthContext";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        toast.success(result.message);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        toast.success(result.message);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error logging in with Google");
    }
  };

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
        <h2 className={styles.title}>Welcome back</h2>
        <p className={styles.subtitle}>Please enter your details.</p>
        <form className={styles.form} autoComplete="off" onSubmit={handleLogin}>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className={styles.input}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={styles.input}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles.optionsRow}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" /> Remember for 30 days
            </label>
            <a href="/forgot-password" className={styles.forgot}>
              Forgot Password
            </a>
          </div>
          <button type="submit" className={styles.signInBtn}>
            Sign In
          </button>
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
          >
            <img
              src="/assets/google-icon.png"
              alt="Google"
              className={styles.googleIcon}
            />
            Sign in with Google
          </button>
        </form>
        <div className={styles.signupRow}>
          Don&apos;t have an account?{" "}
          <a href="/signup" className={styles.signupLink}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};
