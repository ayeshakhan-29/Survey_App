import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './Home';
import SurveyPage from './SurveyPage';
import Login from './Login';
import Signup from './Signup';
import Results from './Results';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Simulate user authentication (you should replace this with your actual authentication logic)
  const isAuthenticated = /* Check if the user is authenticated */ true;

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/SurveyPage'
          element={isAuthenticated ? <SurveyPage /> : <Navigate to='/LoginPage' />}
        />
        <Route path='/LoginPage' element={<Login />} />
        <Route path='/SignupPage' element={<Signup />} />
        <Route path='/ResultsPage' element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
