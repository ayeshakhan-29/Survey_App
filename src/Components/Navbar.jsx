import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="bg-blue-500 text-white p-4">
            <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">Survey</div>
                <div>
                    <Link to="/LoginPage">
                        <button className="text-white font-bold py-2 px-4 rounded mr-4">
                            Login
                        </button>
                    </Link>
                    <Link to="/SignupPage">
                        <button className="text-white font-bold py-2 px-4 rounded">
                            Signup
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
