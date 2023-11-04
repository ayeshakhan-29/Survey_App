import React, { useEffect, useState, useRef } from 'react';
import bg1 from './bg1.jpg';
import { getAuth } from 'firebase/auth';
import { db } from '../src/Firebase/Firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SurveyPage = () => {
  const auth = getAuth(); // Initialize Firebase Auth
  const user = auth.currentUser; // Get the current authenticated user

  const [selectedItems, setSelectedItems] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [responses, setResponses] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isSurveyStarted, setIsSurveyStarted] = useState(false);

  const collectionName = 'questions';
  const shouldConfirmExit = useRef(false);

  useEffect(() => {
    queryCollection();
    window.addEventListener('beforeunload', confirmExit);

    return () => {
      window.removeEventListener('beforeunload', confirmExit);
    };
  }, []);

  const queryCollection = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setQuestions(data);
      setAnswers(new Array(data.length).fill(''));
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };

  const confirmExit = (event) => {
    if (isSurveyStarted && shouldConfirmExit.current) {
      event.preventDefault();
      event.returnValue = 'Are you sure you want to leave the survey? Your progress will be lost.';
    }
  };

  const handleNext = () => {
    shouldConfirmExit.current = true;
    if (currentStep < questions?.length - 1) {
      if (
        (questions[currentStep]?.type === 'checkbox' && selectedItems.length === 0) ||
        (questions[currentStep]?.type !== 'checkbox' && !answers[currentStep])
      ) {
        toast.error('Please choose an option before proceeding.');
      } else {
        const updatedResponses = [...responses];
        updatedResponses[currentStep] = {
          question: questions[currentStep]?.text,
          response: questions[currentStep]?.type === 'checkbox'
            ? selectedItems
            : answers[currentStep],
        };
        setResponses(updatedResponses);
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (isSurveyStarted) {
      shouldConfirmExit.current = true;
      if (window.confirm('Are you sure you want to leave the survey? Your progress will be lost.')) {
        setIsSurveyStarted(false);
        shouldConfirmExit.current = false;
        setCurrentStep(0);
      }
    } else {
      // You should navigate to the home page or a different page here
      // and prevent the logout action
      // For example, you can use React Router or any other navigation method
      // Replace the following line with your actual navigation logic
      // window.location.href = '/'; // Navigate to the home page
    }
  };


  const handleSubmit = async () => {
    shouldConfirmExit.current = false;
    const updatedResponses = [...responses];
    updatedResponses[currentStep] = {
      question: questions[currentStep]?.text,
      response: questions[currentStep]?.type === 'checkbox'
        ? selectedItems
        : answers[currentStep],
    };
    setResponses(updatedResponses);

    // Include the user's ID, email, and name in the responses
    const userData = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName, // Include the user's display name
      responses: updatedResponses,
    };

    // Now you can save the responses and user data to the database
    try {
      const responseRef = collection(db, 'responses');
      await addDoc(responseRef, userData);

      // Show a success toast message
      toast.success('Survey submitted successfully!');

      // You can also reset the state after saving
      setResponses([]);
      setAnswers(new Array(questions.length).fill(''));
      setCurrentStep(0);
      setIsSurveyStarted(false);
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentStep] = e.target.value;
    setAnswers(updatedAnswers);
  };

  const handleCheckboxChange = (value) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((item) => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  // ...

  return (
    <div className="relative">
      <img alt="background" src={bg1} className="w-full h-screen object-cover" />

      <div className="absolute inset-0 flex flex-col items-center justify-start bg-black bg-opacity-70 text-white">
        <div className="text-3xl font-bold m-4 mt-10">Mind and Well-Being Assessment Survey</div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2 absolute top-4 left-4"
          onClick={handleBack}
        >
          Back
        </button>

        <div className="bg-white bg-opacity-75 rounded-lg p-4 mt-6" style={{ width: '70vw', height: '15rem' }}>
          {questions.length > 0 && (
            <>
              <div className="text-xl text-black mb-4">
                {questions[currentStep]?.text}
              </div>
              {questions[currentStep]?.options.map((item) => (
                <label key={item} className="flex items-center text-black space-x-2">
                  {questions[currentStep]?.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      value={item}
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                  ) : (
                    <input
                      type="radio"
                      value={item}
                      checked={answers[currentStep] === item}
                      onChange={handleChange}
                    />
                  )}
                  {item}
                </label>
              ))}
            </>
          )}
        </div>

        <div className="flex justify-center mt-4">
          {currentStep > 0 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
              onClick={handlePrev}
            >
              Previous
            </button>
          )}
          {currentStep < questions?.length - 1 && (
            <button
              className="bg-blue-500 hover-bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
              onClick={handleNext}
            >
              Next
            </button>
          )}
          {currentStep === questions?.length - 1 && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
