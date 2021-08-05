import classes from './MainHeader.module.css';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { useContext } from 'react';

function MainHeader() {
	const { isLoggedIn, logout } = useContext(AuthContext);

	/**(6) */
	function logoutHandler() {
		logout();
		//! optional: redirect w/ useHistory -> check (7) for alternative 'react-router-dom' Redirect method
	}

	return (
		<header>
			<div className={classes.logo}>
				<h2>Food API</h2>
			</div>
			<div className={classes.nav}>
				<ul>
					<li>
						<NavLink to="/search-recipes" activeClassName={classes.active}>
							Search Recipes
						</NavLink>
					</li>
					<li>
						<NavLink to="/fooddb" activeClassName={classes.active}>
							Food DB
						</NavLink>
					</li>
					{!isLoggedIn && (
						<li>
							<NavLink to="/auth" activeClassName={classes.active}>
								Login/Sign-Up
							</NavLink>
						</li>
					)}
					{isLoggedIn && (
						<li>
							<NavLink to="/profile" activeClassName={classes.active}>
								Profile
							</NavLink>
						</li>
					)}
					{isLoggedIn && (
						<li>
							<NavLink to='/' onClick={logoutHandler}>
								Sign Out
							</NavLink>
						</li>
					)}
				</ul>
			</div>
		</header>
	);
}

export default MainHeader;
