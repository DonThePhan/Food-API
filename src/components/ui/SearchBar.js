import classes from './SearchBar.module.css';
import LoadingSpinner from './LoadingSpinner';
import { Fragment, useContext, useState, useEffect } from 'react';
import SearchContext from '../../store/search-context';

function SearchBar(props) {
	const { buttonText } = props;
	const {
		searching,
		setSearching,
		searchQuery,
		setSearchQuery,
		view,
		setView,
		advancedSearchOptions,
		setAdvancedSearchOptions
	} = useContext(SearchContext);

	const [ advancedSearchOn, setAdvancedSearchOn ] = useState(false);
	const [ calories, setCalories ] = useState({ min: false, max: false, text: false });

	function submitHandler(e) {
		e.preventDefault();
		setSearching(true);
	}

	function searchInputChangeHandler(e) {
		setSearchQuery(e.target.value);
	}

	function toogleAdvancedSearch() {
		setAdvancedSearchOn((prev) => !prev);
	}

	function advancedOptHandler(e) {
		if (e.target.value === 'none') {
			setAdvancedSearchOptions((prev) => {
				const newValue = { ...prev };
				delete newValue[e.target.name];
				return newValue;
			});
		} else {
			setAdvancedSearchOptions((prev) => {
				return { ...prev, [e.target.name]: e.target.value };
			});
		}
	}

	function calorieChange(e) {
		if (e.target.name === 'min') {
			setCalories((prev) => {
				return { ...prev, min: e.target.value };
			});
		} else {
			setCalories((prev) => {
				return { ...prev, max: e.target.value };
			});
		}
	}

	useEffect(
		() => {
			if (calories.min && calories.max) {
				setCalories((prev) => {
					return { ...prev, text: `${calories.min}-${calories.max}` };
				});
			} else if (calories.min && !calories.max) {
				setCalories((prev) => {
					return { ...prev, text: `${calories.min}+` };
				});
			} else if (!calories.min && calories.max) {
				setCalories((prev) => {
					return { ...prev, text: `0-${calories.max}` };
				});
			} else if (!calories.min && !calories.max) {
				setCalories((prev) => {
					return { ...prev, text: false };
				});
			}
		},
		[ calories.min, calories.max ]
	);

	useEffect(
		() => {
			if (calories.text) {
				setAdvancedSearchOptions((prev) => {
					return { ...prev, calories: calories.text };
				});
			} else {
				setAdvancedSearchOptions((prev) => {
					const newValue = { ...prev };
					delete newValue['calories'];
					return newValue;
				});
			}
		},
		[ calories.text ]
	);

	function resetSearchOptions() {
		setAdvancedSearchOptions({});
		console.log(advancedSearchOptions);
	}

	return (
		<Fragment>
			{searching && <LoadingSpinner />}
			{!searching && (
				<div className={classes.searchBar}>
					<div className={classes.searchBarFind}>
						<form onSubmit={submitHandler} className={classes.inputSection}>
							<div>
								<input
									onChange={searchInputChangeHandler}
									placeholder={buttonText}
									id="search"
									type="text"
									value={searchQuery}
								/>
								<button type="submit">
									<i className="fas fa-search" />
								</button>
							</div>
						</form>
						<div className={classes.view}>
							<button
								className={view === 'grid' ? classes.viewSelected : ''}
								onClick={() => setView('grid')}
							>
								<i className="fas fa-th-large" />
							</button>
							<button
								className={view === 'list' ? classes.viewSelected : ''}
								onClick={() => setView('list')}
							>
								<i className="fas fa-bars" />
							</button>
						</div>
					</div>
					<button onClick={toogleAdvancedSearch} className={classes.byCategory}>
						By Category{' '}
						{!advancedSearchOn ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-up" />}
					</button>
					{advancedSearchOn && (
						<div className={classes.advancedSearch}>
							<button onClick={resetSearchOptions}>reset search options</button>
							<select
								defaultValue={advancedSearchOptions.diet}
								onClick={advancedOptHandler}
								name="diet"
								id="diet"
							>
								<option value="none">Diet</option>
								<option value="balanced">balanced</option>
								<option value="high-fiber">high-fiber</option>
								<option value="high-protein">high-protein</option>
								<option value="low-carb">low-carb</option>
								<option value="low-fat">low-fat</option>
								<option value="low-sodium">low-sodium</option>
							</select>
							<select
								defaultValue={advancedSearchOptions.health}
								onClick={advancedOptHandler}
								name="health"
								id="health"
							>
								<option value="none">Health</option>
								<option value="alcohol-free">alcohol-free</option>
								<option value="celery-free">celery-free</option>
								<option value="crustacean-free">crustacean-free</option>
								<option value="dairy-free">dairy-free</option>
								<option value="egg-free">egg-free</option>
								<option value="fodmap-free">fodmap-free</option>
								<option value="gluten-free">gluten-free</option>
								<option value="immuno-supportive">immuno-supportive</option>
								<option value="keto-friendly">keto-friendly</option>
								<option value="kosher">kosher</option>
								<option value="low-fat-abs">low-fat-abs</option>
								<option value="low-potassium">low-potassium</option>
								<option value="low-sugar">low-sugar</option>
								<option value="low-sugar">low-sugar</option>
								<option value="lupine-free">lupine-free</option>
								<option value="mustard-free">mustard-free</option>
								<option value="no-oil-added">no-oil-added</option>
								<option value="paleo">paleo</option>
								<option value="peanut-free">peanut-free</option>
								<option value="pecatarian">pecatarian</option>
								<option value="pork-free">pork-free</option>
								<option value="red-meat-free">red-meat-free</option>
								<option value="sesame-free">sesame-free</option>
								<option value="shellfish-free">shellfish-free</option>
								<option value="soy-free">soy-free</option>
								<option value="sugar-conscious">sugar-conscious</option>
								<option value="tree-nut-free">tree-nut-free</option>
								<option value="vegan">vegan</option>
								<option value="vegetarian">vegetarian</option>
								<option value="wheat-free">wheat-free</option>
							</select>
							<select
								defaultValue={advancedSearchOptions.cuisineType}
								onClick={advancedOptHandler}
								name="cuisineType"
								id="cuisineType"
							>
								<option value="none">Cuisine Type</option>
								<option value="American">American</option>
								<option value="Asian">Asian</option>
								<option value="British">British</option>
								<option value="Caribbean">Caribbean</option>
								<option value="Central Europe">Central Europe</option>
								<option value="Chinese">Chinese</option>
								<option value="Eastern Europe">Eastern Europe</option>
								<option value="French">French</option>
								<option value="Indian">Indian</option>
								<option value="Italian">Italian</option>
								<option value="Japanese">Japanese</option>
								<option value="Kosher">Kosher</option>
								<option value="Mediterranean">Mediterranean</option>
								<option value="Mexican">Mexican</option>
								<option value="Middle Eastern">Middle Eastern</option>
								<option value="Nordic">Nordic</option>
								<option value="South American">South American</option>
								<option value="South East Asian">South East Asian</option>
							</select>
							<select
								defaultValue={advancedSearchOptions.mealType}
								onClick={advancedOptHandler}
								name="mealType"
								id="mealType"
							>
								<option value="none">Meal Type</option>
								<option value="Breakfast">Breakfast</option>
								<option value="Dinner">Dinner</option>
								<option value="Lunch">Lunch</option>
								<option value="Snack">Snack</option>
								<option value="Teatime">Teatime</option>
							</select>
							<select
								defaultValue={advancedSearchOptions.dishType}
								onClick={advancedOptHandler}
								name="dishType"
								id="dishType"
							>
								<option value="none">Dish Type</option>
								<option value="Biscuits and cookies">Biscuits and cookies</option>
								<option value="Bread">Bread</option>
								<option value="Cereals">Cereals</option>
								<option value="Condiments and sauces">Condiments and sauces</option>
								<option value="Desserts">Desserts</option>
								<option value="Drinks">Drinks</option>
								<option value="Main course">Main course</option>
								<option value="Pancake">Pancake</option>
								<option value="Preps">Preps</option>
								<option value="Preserve">Preserve</option>
								<option value="Salad">Salad</option>
								<option value="Sandwiches">Sandwiches</option>
								<option value="Side dish">Side dish</option>
								<option value="Soup">Soup</option>
								<option value="Starter">Starter</option>
								<option value="Sweets">Sweets</option>
							</select>
							<div className={classes.calories}>
								<p>Calories</p>
								<input
									value={calories.min}
									onChange={calorieChange}
									name="min"
									type="number"
									min="0"
									placeholder="Min"
								/>
								<input
									value={calories.max}
									onChange={calorieChange}
									name="max"
									type="number"
									min="0"
									placeholder="Max"
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</Fragment>
	);
}

export default SearchBar;
