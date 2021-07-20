import classes from './UserProfile.module.css';
import { Fragment, useCallback, useState, useEffect, useContext } from 'react';

import RecipesListItem from '../searchRecipes/RecipesListItem';
import AuthContext from '../../store/auth-context';

const UserProfile = () => {
	const { email } = useContext(AuthContext);
	const [ recipes, setRecipes ] = useState([]);

	const loadRecipes = useCallback(
		async () => {
			try {
				const response = await fetch('https://food-api-f23bf-default-rtdb.firebaseio.com/saved-recipes.json');
				const loadedRecipes = await response.json();
				console.log(loadedRecipes);
				console.log(email);

				const favouritedAccountRecipes = [];

				for (const value of Object.values(loadedRecipes)) {
					if (value.favouritedAccounts.includes(email)) {
						favouritedAccountRecipes.push(value);
					}
				}
				setRecipes(favouritedAccountRecipes);
			} catch (e) {
				console.log(e);
			}
		},
		[ email ]
	);

	useEffect(
		() => {
			if (email) {
				console.log('email:', email);
				loadRecipes();
			}
		},
		[ loadRecipes, email ]
	);

	return (
		<Fragment>
			<h1>Your Saved Recipes</h1>
			{recipes.length > 0 &&
				recipes.map((recipe) => {
					return (
						<RecipesListItem
							className={classes.recipe}
							recipe={recipe}
							recipeId={recipe.id} //recipe id from API
							key={recipe.id}
						/>
					);
				})}
		</Fragment>
	);
};

export default UserProfile;
