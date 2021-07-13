import classes from './MainHeader.module.css';
import { NavLink } from 'react-router-dom';

function MainHeader() {
	return (
		<header>
			<div className={classes.logo}>
				<h2>Food API</h2>
			</div>
			<div className={classes.nav}>
				<ul>
					<NavLink to="/search-recipes" activeClassName={classes.active}>
						Search Recipes
					</NavLink>
					<NavLink to="/fooddb" activeClassName={classes.active}>
						Food DB
					</NavLink>
				</ul>
			</div>
		</header>
	);
}

export default MainHeader;
