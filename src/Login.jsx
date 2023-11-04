import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import PasswordInput from '../src/Components/PasswordInput';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Add isAuthenticated state

    const handleLogin = async () => {
        try {
            if (!validateEmail(email)) {
                toast.error('Invalid email format');
                return;
            }

            if (!validatePassword(password)) {
                toast.error('Password must be at least 6 characters');
                return;
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            toast.success('Logged in successfully');

            // Set isAuthenticated to true after successful login
            setIsAuthenticated(true);

            // Redirect to Home page
            navigate(`/?name=${user.displayName}`);
        } catch (error) {
            handleLoginError(error.code);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleLoginError = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                toast.error('Invalid email format');
                break;
            case 'auth/wrong-password':
                toast.error('Invalid password');
                break;
            case 'auth/user-not-found':
                toast.error('User not found');
                break;
            default:
                toast.error('Error logging in');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl text-center mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white rounded py-2 hover:bg-blue-700"
                >
                    Login
                </button>
                <Link to="/SignupPage">
                    <button className="w-full bg-green-500 text-white rounded py-2 mt-4 hover:bg-blue-700">
                        Signup
                    </button>
                </Link>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Login;
