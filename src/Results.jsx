import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from './Firebase/Firebase'; // Import your Firebase Firestore configuration
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const ResultsPage = () => {
    const [user, setUser] = useState(null);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const auth = getAuth();

        onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                // User is signed in, you can access their data
                setUser(authUser);

                // Fetch user responses from Firestore using the user's UID
                const userId = authUser.uid;
                const responseCollection = collection(db, 'responses');
                const userResponsesQuery = query(responseCollection, where('userId', '==', userId));
                const querySnapshot = await getDocs(userResponsesQuery);

                const userResponses = [];

                querySnapshot.forEach((doc) => {
                    userResponses.push(doc.data());
                });

                setResponses(userResponses);
            } else {
                // No user is signed in
                setUser(null);
                setResponses([]);
            }
        });
    }, []);

    return (
        <div>
            <h1>User Information:</h1>
            {user && (
                <div>
                    <p>User ID: {user.uid}</p>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.displayName}</p>
                </div>
            )}

            <h1>User Responses:</h1>
            {responses.length > 0 && (
                <ul>
                    {responses.map((userResponse, index) => (
                        <li key={index}>
                            {userResponse.responses.map((item, innerIndex) => (
                                <p key={innerIndex}>
                                    {item.question}: {item.response}
                                </p>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ResultsPage;
