import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'
import "./logout.css";


const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <nav className='logout'>
            {
                userLoggedIn
                    ?
                    <>
                        <button
                            onClick={() => {
                                doSignOut().then(() => {
                                navigate('/login');
                                });
                            }}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                    </>
            }

        </nav>
    )
}

export default Header