/**material here belongs to (4) unless otherwise tagged */

import classes from './ProfileForm.module.css';

import { useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import { useHistory } from 'react-router-dom'; /**(5) */

const ProfileForm = () => {
    const history = useHistory() /**(5) */

	const newPasswordInputRef = useRef();
	const { API_KEY, token } = useContext(AuthContext);

	function submitHandler(e) {
		e.preventDefault();

		const enteredNewPassword = newPasswordInputRef.current.value;
		//! again we are skipping entry validation

        /**This is what's required from Firebase to change user password (as per it's documentation). You'll need to FIGURE OUT how it's done based on what db you use */
		const params = {
			method: 'POST',
			body: JSON.stringify({
				idToken: token, /** depending on the API you're using, the way the token is passed on will vary. See video 305 @ 9:45*/
				password: enteredNewPassword,
				returnSecureToken: false
			}),
			headers: { 'Content-Type': 'application/json' }
		};
        fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`, params)
            .then(res => {
            history.replace('/') /**(5) redirect home & delete this page from history so you can't go back to it */
        }) //! we are leaving out .catch for this example, though it SHOULD be included if request fails
	}

	return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input type="password" id="new-password" minLength='7' ref={newPasswordInputRef} />
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
