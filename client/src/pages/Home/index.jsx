/* eslint-disable react/no-unescaped-entities */
import { Link } from 'react-router-dom';
import './Home.css'
import Login from '../../components/Login';

const Home = () => {
  return (
    <div className='home-bg-main'>
  <div className="home-container">
      <h1>Welcome to Survivor BPL</h1>
      <div className="auth-container">
        <div className="auth-card">
          <Login />
          <p className="signup-link">Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  
  );
};

export default Home;
