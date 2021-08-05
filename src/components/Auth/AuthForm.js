import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import { useHistory } from 'react-router-dom'; /**(5) */

import classes from './AuthForm.module.css';

const AuthForm = () => {
	const history = useHistory(); /**(5) */

	const [ isLogin, setIsLogin ] = useState(true);
	const [ isLoading, setIsLoading ] = useState(false);

	const { login, API_KEY } = useContext(AuthContext);

	const emailInputRef = useRef();
	const passwordInputRef = useRef();

	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState);
	};

	function submitHandler(e) {
		e.preventDefault();
		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = passwordInputRef.current.value;
		//! we're skipping entry validation for this tutorial

		setIsLoading(true);

		let URL;
		if (isLogin) {
			/**(3) SIGN IN */
			URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
		} else {
			/**(2) SIGN UP*/
			URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
		}

		/**(2) & (3) - review Angela Yu's class on fetch.then.catch if unclear*/
		const params = {
			method: 'POST',
			body: JSON.stringify({
				email: enteredEmail,
				password: enteredPassword,
				returnSecureToken: true
			}),
			headers: { 'Content-Type': 'application/json' }
		};
		fetch(URL, params)
			.then((res) => {
				setIsLoading(false);
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMsg = 'Authentication failed!';

						/**This is a possible way display errors! */
						// if (data && data.error && data.error.message) {
						// 	errorMsg = data.error.message;
						// }

						console.log(errorMsg);
						throw new Error(errorMsg);
					});
				}
			})
            .then((data) => {
                console.log(data);
				console.log(data);
                if (isLogin) {
                    console.log(data.expiresIn);
                    
                    const expirationTime = new Date(new Date().getTime() + (+data.expiresIn*1000 /**convert from s to ms */)) /**(9) */

					/**w/ Firebase, we are using Authentication Tokens */
					login(data.idToken, expirationTime.toISOString() /**(9) */);

					history.replace('/' /** (5) will redirect to homepage */);
					/** .replace prevents user from being able to go back to previous page */
				}
			})
			/** if there are any errs thrown, we'll skip the remaining .then's & jump to .catch */
			.catch((err) => {
				alert(err);
			});
	}

	return (
		<section onSubmit={submitHandler} className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" required ref={emailInputRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" required ref={passwordInputRef} />
				</div>
				<div className={classes.actions}>
					{!isLoading && <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>}
					{isLoading && <p>Sending Request...</p>}
					<button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
