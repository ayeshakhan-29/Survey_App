import React, { useState } from 'react';
import bg1 from '../src/bg1.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, getAuth } from 'firebase/auth'; // Import signOut function and getAuth from Firebase Auth

function Home() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const displayName = queryParams.get('name');
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logged out successfully');
        // Redirect to the Home page after logout
        navigate('/');
      })
      .catch((error) => {
        toast.error('Error logging out');
      });
  };

  const handleStartSurveyClick = () => {
    if (displayName) {
      // Redirect to the Survey page
      navigate('/SurveyPage');
    } else {
      toast.error('Please log in to start the survey.', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="relative h-screen">
      <img
        alt="background"
        src={bg1}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col text-white px-[18rem]">
        <div className="text-3xl font-bold mt-20 text-center">Survey</div>

        {displayName && (
          <div className="text-xl text-center mt-4">
            Hi, {displayName}!
          </div>
        )}

        <div className="text-2xl mt-4 ml-5 mb-20">
          Together, we are gathering information about the unique and fascinating diet of the common barn owl. In this survey, you'll have the chance to record your findings after dissecting a barn owl pellet, including prey species and their bone and exoskeleton discoveries.
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleStartSurveyClick}
          >
            Start Survey
          </button>
        </div>

        <div className="absolute top-4 right-4 flex">
          {!displayName ? (
            <Link to="/LoginPage" className="mr-4">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
          ) : (
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
          {!displayName && (
            <Link to="/SignupPage">
              <button className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Signup
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
