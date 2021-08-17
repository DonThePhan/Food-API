import './App.css';
import MainHeader from './components/nav/MainHeader';
import Layout from './components/layout/Layout';
import { Fragment, useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import SearchRecipes from './pages/SearchRecipes';
import FoodDB from './pages/FoodDB';
import RecipeDetails from './pages/RecipeDetails';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import AuthContext from './store/auth-context';


function App() {
	const { isLoggedIn } = useContext(AuthContext);

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
					</Route>
					{/**(7) method 1 - simply NO access*/ !isLoggedIn && (
						<Route path="/auth">
							<AuthPage />
						</Route>
					)}
					{/**(7) method 2 - Redirect */}
					<Route path="/profile">
						{isLoggedIn && <ProfilePage />}
						{!isLoggedIn && <Redirect to="/auth" />}
					</Route>
					<Route path="*">
						<Redirect to="/" />
					</Route>
				</Switch>
			</Layout>
		</Fragment>
	);
}

export default App;
