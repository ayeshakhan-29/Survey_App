import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const PasswordInput = ({ label, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700">{label}</label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 border rounded"
                    value={value}
                    placeholder='Password'
                    onChange={onChange}
                />
                <button
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;
