import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";

const withAuthentication = (WrappedComponent) => {
    return function AuthComponent(props) {
        const [isAuthenticated, setIsAuthenticated] = useState(null); // Use null to represent unknown state

        useEffect(() => {
            // Find the 'token' cookie string
            const token = document.cookie.split('; ').find((row) => row.startsWith('token='));
            console.log("Token check:", token);

            // If token is found, extract its value
            if (token) {
                const tokenValue = token.split('=')[1];
                if (tokenValue) {
                    console.log("Token found");
                    setIsAuthenticated(true);  // Set state to true if token is valid
                }
            } else {
                console.log("Token not found");
                setIsAuthenticated(false);  // Set state to false if no token
            }
        }, []); // Run on initial mount

        // Show loading until isAuthenticated state is determined
        if (isAuthenticated === null) {
            return <div>Loading...</div>;  // Or any other loading indicator
        }

        if (isAuthenticated) {
            return <WrappedComponent {...props} />;
        } else {
            return <Navigate to="/login" />;
        }
    };
};

export default withAuthentication;
