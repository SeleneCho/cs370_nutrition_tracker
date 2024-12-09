import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import "../register/index.css"; // Import global styles
const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <>
            {userLoggedIn && <Navigate to={"/home"} replace={true} />}

            <main className="main-container">
                <div className="login-card">
                    <div className="text-center mb-6">
                        <h3 className="login-title">Create a New Account</h3>
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
                                disabled={isRegistering}
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="input-container">
                            <label className="form-label">Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete="off"
                                required
                                value={confirmPassword}
                                onChange={(e) => setconfirmPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* Error Message */}
                        {errorMessage && <span className="error-message">{errorMessage}</span>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isRegistering}
                            className="button"
                        >
                            {isRegistering ? "Signing Up..." : "Sign Up"}
                        </button>

                        {/* Login Link */}
                        <div className="sign-up-link">
                            Already have an account?{" "}
                            <Link to={"/login"} className="link">
                                Continue
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;