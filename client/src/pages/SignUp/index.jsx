import "./SignupPage.css";
import Signup from "../../components/SignUp";
import { Link } from "react-router-dom";

const SignupPage = () => {
  return (
    <div className="home-bg-main">
      <div className="signuppageauth-container">
        <h1>Sign Up to Survivor BPL</h1>
        <div className="signuppage-container">
          <div className="signuppage-card">
            <Signup />
            <p className="signup-link">Already have an account?{' '}
            <Link to="/" className="signup-link">
             Login here
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
