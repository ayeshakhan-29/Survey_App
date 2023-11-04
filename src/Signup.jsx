import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { auth, db } from './Firebase/Firebase';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { doc, setDoc } from 'firebase/firestore';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const navigate = useNavigate(); // Use useNavigate to perform navigation

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: displayName,
            });

            console.log('User signed up:', userCredential.user);

            // Save user data to Firestore with a unique identifier (UID)
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userDocRef, {
                email: email,
                displayName: displayName,
            });

            console.log('User data saved to Firestore');

            // Show a success toast message
            toast.success('Signup successful!');

            // Navigate to the login page
            navigate('/LoginPage');

        } catch (error) {
            console.error('Error signing up:', error);

            // Show a failure toast message
            toast.error('Signup failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Display Name"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    onClick={handleSignup}
                    className="w-full bg-green-500 text-white rounded py-2 hover-bg-green-700"
                >
                    Sign Up
                </button>
                <Link className='align-text' to="/LoginPage">Already have an account? Login</Link>
            </div>

            {/* Add the ToastContainer to display toast messages */}
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};

export default Signup;
