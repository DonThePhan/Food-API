import { useParams } from 'react-router-dom';
import { useContext, useCallback, useEffect, Fragment } from 'react';
import SearchContext from '../store/search-context';
import classes from './RecipeDetails.module.css';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function RecipeDetails() {
	const recipeId = useParams().recipeId;
	const { searching, setSearching, searchRecipeResults, setSearchRecipeResults } = useContext(SearchContext);

	const {
		calories,
		cautions,
		cuisineType,
		dietLabels,
		digest,
		dishType,
		healthLabels,
		image,
		ingredientLines,
		label,
		totalTime,
		yield: serves,
		url
	} = searchRecipeResults;

	const baseURL = 'https://api.edamam.com/api/recipes/v2';

	const recipeSearch = useCallback(
		async () => {
			const params = new URLSearchParams({
				type: 'public',
				app_id: process.env.REACT_APP_API_ID,
				app_key: process.env.REACT_APP_API_KEY
			});

			try {
				const response = await fetch(`${baseURL}/${recipeId}?${params.toString()}`);

				const data = await response.json();
				console.log(data.recipe);
				setSearchRecipeResults(data.recipe);
			} catch (err) {
				console.log(err.message);
			}

			setSearching(false);
		},
		[ setSearching ]
	);

	useEffect(() => {
		setSearching(true);
		recipeSearch();
	}, []);

	return (
		<Fragment>
			{searching && <LoadingSpinner />}
			{!searching && (
				<div className={classes.itemListView}>
					<div className={classes.imgContainer}>
						<img src={image} alt="" />
					</div>

					<div className={classes.list}>
						<h2>{label}</h2>
						<div className={classes.infoAndIngredients}>
							<div className={classes.ingredients}>
								<div className={classes.ingredientTitle}>
									<h3>Ingredients</h3>
									<p>serves {serves}</p>
								</div>
								{ingredientLines &&
									ingredientLines.map((ingredient, index) => <p key={index}>{ingredient}</p>)}
								<a href={url} target="_blank" rel="noopener noreferrer">
									<i className="fas fa-clipboard-list" /> <b>Recipe</b>
								</a>
							</div>
							<div className={classes.info}>
								<h3>Info</h3>
								<div className={classes.infoCategory}>
									<p className={classes.label}>Cuisine Type</p>
									<p className={classes.description}>{cuisineType && cuisineType}</p>
								</div>
								<div className={classes.infoCategory}>
									<p className={classes.label}>Cautions</p>
									<p className={classes.description}>{cautions && cautions}</p>
								</div>
								<div className={classes.infoCategory}>
									<p className={classes.label}>Diet Labels</p>
									<p className={classes.description}>{dietLabels && dietLabels}</p>
								</div>
								<div className={classes.infoCategory}>
									<p className={classes.label}>Dish Type</p>
									<p className={classes.description}>{dishType && dishType}</p>
								</div>
								{/* <div className={classes.infoCategory}>
							<p className={classes.label}>Health Labels</p>
							<p className={classes.description}>{healthLabels && healthLabels}</p>
						</div> */}
								{/* <div className={classes.infoCategory}>
							<p className={classes.label}>Digest</p>
							<p className={classes.description}>{digest && digest}</p>
						</div> */}
								<div className={classes.infoCategory}>
									<p className={classes.label}>Calories</p>
									<p className={classes.description}>
										{Math.round(calories).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									</p>
								</div>
								<div className={classes.infoCategory}>
									<p className={classes.label}>Total Time</p>
									<p className={classes.description}>
										{Math.round(totalTime).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} min
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</Fragment>
	);
}

export default RecipeDetails;
