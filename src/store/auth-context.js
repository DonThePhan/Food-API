/** This is a REVIEW of Context API (Section 10) */

import React, { useState, useEffect, useCallback } from 'react';

const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
	API_KEY: '',
	email: ''
});

/**(9) add helper function */
const calculateRemainingTime = (expirationTime) => {
	const currentTime = new Date().getTime(); //ms
	const adjExpirationTime = new Date(expirationTime).getTime(); //ms

	const remainingDuration = adjExpirationTime - currentTime;

	return remainingDuration;
};

/**(10) */
let logoutTimer;

/**(10) */
function retrieveStoredToken() {
	const storedToken = localStorage.getItem('token');
	const storedExpirationDate = localStorage.getItem('expirationTime');
	const remainingTime = calculateRemainingTime(storedExpirationDate);

	if (remainingTime <= 60000 /** 1 minute */) {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		return null;
	}

	return {
		token: storedToken,
		duration: remainingTime
	};
}

export const AuthContextProvider = (props) => {
	const API_KEY = process.env.REACT_APP_FIREBASE_API_KEY;

	const tokenData = retrieveStoredToken(); /**(10) check if there's a saved Token session in browser (to stay logged in if you refresh page)*/

	/**(8) commented out because of step 10 below*/
	// const initialToken = localStorage.getItem('token');

	/**(10) */
	let initialToken;
	if (tokenData) {
		initialToken = tokenData.token;
	}
	const [ token, setToken ] = useState(initialToken);

	const userIsLoggedIn = !!token; //! '!!' transforms value (defined, undefined, null) into a boolean (true/false)

	const [ email, setEmail ] = useState(null); // return user email or ''
	const getUserEmail = useCallback(
		async () => {
			try {
				const response = await fetch(
					`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
					{
						method: 'POST',
						body: JSON.stringify({ idToken: token }),
						headers: { 'Content-Type': 'application/json' }
					}
				);
				const data = await response.json();
				const retrievedEmail = data.users[0].email;
				// console.log(retrievedEmail);
				setEmail(retrievedEmail);
            } catch (error) {
                console.log('no one is logged in')
            }
		},
		[ token, API_KEY ]
	);

	useEffect(
		() => {
			if (token) {
				getUserEmail();
			}
		},
		[ token, getUserEmail ]
	);

	// function logOutHandler() {
	/** (10) we use useCallback because we don't want func to change for useEffect (prevents infinite rerender) */
	const logOutHandler = useCallback(() => {
		setToken(null);

		localStorage.removeItem('token'); /**(8) */
		localStorage.removeItem('expirationTime'); /**(10) */

		/**(10) */
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	function loginHandler(token, expirationTime /**(9) added expiration Time*/) {
		setToken(token);
		localStorage.setItem('token', token); /**(8) here we pass in a key/value pair */
		localStorage.setItem('expirationTime', expirationTime /**(string */); /**(9) */

		/**(9) */
		const remainingTime = calculateRemainingTime(expirationTime);
		// setTimeout(logOutHandler, remainingTime)
		logoutTimer = setTimeout(logOutHandler, remainingTime); /**(10) */
	}

	/**(10) setting timed logout*/
	useEffect(
		() => {
			if (tokenData) {
				// console.log(tokenData.duration);
				logoutTimer = setTimeout(logOutHandler, tokenData.duration);
			}
		},
		[ tokenData, logOutHandler ]
	);

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logOutHandler,
		API_KEY,
		email
	};

	return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
