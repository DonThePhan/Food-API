import { Fragment } from 'react';
import RecipesList from '../components/searchRecipes/RecipesList';
import SearchBar from '../components/ui/SearchBar';

function SearchRecipes() {
	return (
		<Fragment>
			<SearchBar buttonText="Find Recipes" />
			<RecipesList />
		</Fragment>
	);
}

export default SearchRecipes;