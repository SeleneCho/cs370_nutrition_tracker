import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../../../firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import "../login/index.css";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage("Invalid email or password. Please try again.");
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((err) => {
        setErrorMessage("Failed to sign in with Google. Please try again.");
        setIsSigningIn(false);
      });
    }
  };

  return (
    <div>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <main className="main-container">
        <div className="login-card">
          <div className="text-center">
            <h3 className="login-title">Nutrition Tracker</h3>
          </div>
          <form onSubmit={onSubmit} className="form">
            {/* Email Field */}
            <div className="input-container">
              <label className="form-label">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Password Field */}
            <div className="input-container">
              <label className="form-label">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Error Message */}
            {errorMessage && <span className="error-message">{errorMessage}</span>}

            {/* Submit Button */}
            <button type="submit" disabled={isSigningIn} className="button">
              {isSigningIn ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="sign-up-link">
            Don't have an account? <Link to={"/register"}>Sign up</Link>
          </p>

          {/* OR Separator */}
          <div className="separator">
            <div></div>
            <span>OR</span>
            <div></div>
          </div>

          {/* Google Sign-In Button */}
          <button
            disabled={isSigningIn}
            onClick={onGoogleSignIn}
            className="google-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083h-18.15v7.733h10.987C34.588,31.697,30.034,34.478,24.001,34.478	c-6.997,0-12.881-4.657-15.022-10.955c-0.328-0.982-0.511-2.034-0.511-3.122s0.183-2.14,0.511-3.122	c2.141-6.298,8.025-10.955,15.022-10.955c3.528,0,6.772,1.169,9.423,3.104l5.833-5.833C35.171,5.582,29.895,3.522,24.001,3.522	C11.594,3.522,1.883,12.966,1.883,24c0,11.034,9.711,20.478,22.118,20.478c10.503,0,19.713-6.452,21.948-16.247	c0.4-1.33,0.63-2.738,0.63-4.231C46.579,22.066,45.345,20.083,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.757l6.358,4.661c1.731-4.292,5.897-7.414,10.719-7.414c3.528,0,6.772,1.169,9.423,3.104l5.833-5.833C35.171,5.582,29.895,3.522,24.001,3.522	C14.991,3.522,7.123,8.92,6.306,14.757z"
              />
              <path
                fill="#4CAF50"
                d="M24,44.478c5.819,0,11.036-2.042,15.064-5.562l-7.204-6.198c-2.215,1.521-5.001,2.414-7.86,2.414	c-5.946,0-11.026-3.811-12.842-9.048l-6.266,4.851C8.94,38.251,15.846,44.478,24,44.478z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083h-18.15v7.733h10.987c-0.976,3.191-3.141,5.807-5.928,7.538	c1.992-0.003,3.926-0.617,5.583-1.682L43.611,20.083z"
              />
            </svg>
            {isSigningIn ? "Signing In..." : "Continue with Google"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
