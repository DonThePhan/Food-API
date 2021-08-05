import classes from './UserProfile.module.css';
import { Fragment, useCallback, useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

import RecipesListItem from '../searchRecipes/RecipesListItem';
import AuthContext from '../../store/auth-context';
import SearchContext from '../../store/search-context';
import GridLayout from '../ui/GridLayout';

const UserProfile = () => {
	const { email } = useContext(AuthContext);
	const { searching, setSearching, view } = useContext(SearchContext);
	const [ recipes, setRecipes ] = useState([]);

	const loadRecipes = useCallback(
		async () => {
			setSearching(true);
			try {
				const response = await fetch('https://food-api-f23bf-default-rtdb.firebaseio.com/saved-recipes.json');
				const loadedRecipes = await response.json();
				console.log(loadedRecipes);
				console.log(email);

				const favouritedAccountRecipes = [];

                for (const value of Object.values(loadedRecipes)) {
                    console.log(value.favouritedAccounts);
					if (value.favouritedAccounts.includes(email)) {
						favouritedAccountRecipes.push(value);
					}
				}
				setRecipes(favouritedAccountRecipes);
			} catch (e) {
				console.log(e);
			}
			setSearching(false);
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
			{searching && <LoadingSpinner />}
			{!searching && (
				<GridLayout>
					{recipes &&
						recipes.length > 0 &&
						!searching &&
						recipes.map((recipe, index) => (
							<RecipesListItem
								className={classes.recipe}
								recipe={recipe}
								recipeId={recipe.id} //recipe id from API
								key={recipe.id}
							/>
						))}
				</GridLayout>
			)}
			{recipes &&
			recipes.length === 0 &&
			!searching && <h2>Sorry, no results came up. Try modifying your search</h2>}
		</Fragment>
	);
};

export default UserProfile;
