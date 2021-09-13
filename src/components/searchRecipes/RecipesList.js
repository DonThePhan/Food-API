import { useEffect, useCallback, useContext, useState } from 'react';
import RecipesListItem from './RecipesListItem';
import { Fragment } from 'react';
import classes from './RecipesList.module.css';
import SearchContext from '../../store/search-context';
import LoadingSpinner from '../ui/LoadingSpinner';
import GridLayout from '../ui/GridLayout';


// Proxy to bypass CORS blocking policy - see link for details -> https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
const proxy = process.env.REACT_APP_PROXY
const edamamRecipeBaseURL = `https://api.edamam.com/api/recipes/v2`
const baseURL = `${proxy}${edamamRecipeBaseURL}`;

function Viewer(props) {
	const { view } = useContext(SearchContext);
	let content = <GridLayout GridLayout> {props.children}</GridLayout>;
	if (view !== 'grid') {
		content = <div className={classes.listView}>{props.children}</div>;
	}
	return content;
}

function RecipesList() {
	const {
		searching,
		setSearching,
		searchRecipeResults,
		setSearchRecipeResults,
		searchQuery,
		view,
		advancedSearchOptions
	} = useContext(SearchContext);
	const [ initialSearch, setInitialSearch ] = useState(false);

	const recipeSearch = useCallback(
		async () => {
			const preParams = {
				type: 'public',
				app_id: process.env.REACT_APP_API_ID,
				app_key: process.env.REACT_APP_API_KEY,
				q: searchQuery
			};

			Object.assign(preParams, advancedSearchOptions);
			// console.log(preParams);
			const params = new URLSearchParams(preParams);

			try {
				const response = await fetch(`${baseURL}?${params.toString()}`);

				const data = await response.json();
				setSearchRecipeResults(data.hits);
				// console.log(data.hits);
			} catch (err) {
				console.log(err.message);
			}

			setSearching(false);
		},
		[ searchQuery, setSearching, setSearchRecipeResults, advancedSearchOptions ]
	);

	useEffect(
		() => {
			if (searching === true) {
				setInitialSearch(true);
				recipeSearch();
			}
		},
		[ searching, recipeSearch, setInitialSearch ]
	);

	const Content = (
		<Viewer>
			{searchRecipeResults &&
				searchRecipeResults.length > 0 &&
				!searching &&
				searchRecipeResults.map((recipe, index) => (
					<RecipesListItem
						className={classes.recipe}
						recipe={recipe.recipe}
						recipeId={recipe._links.self.href.replace(`${edamamRecipeBaseURL}/`, '').split('?')[0]} //recipe id from API
						key={index}
					/>
				))}
		</Viewer>
	);

	return (
		<Fragment>
			{searching && <LoadingSpinner />}
			{!searching && initialSearch && Content}
			{searchRecipeResults &&
			searchRecipeResults.length === 0 &&
			initialSearch &&
			!searching && <h2>Sorry, no results came up. Try modifying your search</h2>}
		</Fragment>
	);
}

export default RecipesList;
