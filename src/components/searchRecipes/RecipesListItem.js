import { Fragment, useContext } from 'react';
import classes from './RecipesListItem.module.css';
import SearchContext from '../../store/search-context';
import {  Link } from 'react-router-dom';


function RecipesListItem(props) {
    // console.log(1)
    // console.log(props.recipe)
	const {
		url,
		dietLabels,
		label,
		image,
		cuisineType,
		ingredientLines,
		calories,
		yield: serves,
		totalTime
	} = props.recipe;
	const { view } = useContext(SearchContext);

	return (
		<Fragment>
	
			<div>
				<div className={`${view === 'grid' ? classes.itemGridView : classes.itemListView} ${props.className}`}>
					<Link to={`/search-recipes/${props.recipeId}`}>
						<div className={classes.imgContainer}>
							<img src={image} alt="" />
							{view === 'grid' && <h1>{label}</h1>}
						</div>
					</Link>

					{view === 'grid' && (
						<h2 className={classes.name}>{label.length < 20 ? label : `${label.slice(0, 20)}...`}</h2>
					)}

					{view === 'list' && (
						<div className={classes.list}>
							<h2>{label}</h2>
							<div className={classes.infoAndIngredients}>
								<div className={classes.ingredients}>
									<div className={classes.ingredientTitle}>
										<h3>Ingredients</h3>
										<p>serves {serves}</p>
									</div>
									{ingredientLines.map((ingredient, index) => <p key={index}>{ingredient}</p>)}
								</div>
								<div className={classes.info}>
									<a href={url} target="_blank" rel="noopener noreferrer">
										<i className="fas fa-clipboard-list" /> <b>Recipe</b>
									</a>
									{cuisineType && <p>{cuisineType}</p>}
									<p>{dietLabels}</p>
									<p>{Math.round(calories).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} cal</p>
									<p>{Math.round(totalTime).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} min</p>
								</div>
							</div>
						</div>
					)}
				</div>
				{view === 'list' && <hr />}
			</div>
		</Fragment>
	);
}

export default RecipesListItem;
