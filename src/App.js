import './App.css';
import MainHeader from './components/nav/MainHeader';
import Layout from './components/layout/Layout';
import { Fragment } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import SearchRecipes from './pages/SearchRecipes';
import FoodDB from './pages/FoodDB';
import RecipeDetails from './pages/RecipeDetails';

function App() {
	return (
		<Fragment>
			<MainHeader />
			<Layout>
				<Switch>
					<Route path={`/search-recipes/:recipeId`} exact>
						<RecipeDetails />
					</Route>
					<Route path="/" exact>
						<Redirect to="/search-recipes" />
					</Route>
					<Route path="/search-recipes" exact>
						<SearchRecipes />
					</Route>
					<Route path="/fooddb" exact>
						<FoodDB />
					</Route>{' '}
				</Switch>
			</Layout>
		</Fragment>
	);
}

export default App;
