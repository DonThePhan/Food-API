import './App.css';
import MainHeader from './components/nav/MainHeader';
import Layout from './components/layout/Layout';
import { Fragment } from 'react';
import SearchRecipes from './pages/SearchRecipes';
import FoodDB from './pages/FoodDB';
import { Route, Redirect } from 'react-router-dom';

function App() {
	return (
		<Fragment>
			<MainHeader />
			<Layout>
				<Route path="/" exact>
					<Redirect to="/search-recipes" />
				</Route>
				<Route path="/search-recipes">
					<SearchRecipes />
				</Route>
				<Route path="/fooddb">
					<FoodDB />
				</Route>
			</Layout>
		</Fragment>
	);
}

export default App;
