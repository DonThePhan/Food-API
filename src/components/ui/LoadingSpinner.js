import classes from './LoadingSpinner.module.css';

function LoadingSpinner() {
	return (
		<div className={classes.spinner}>
			<i className="fas fa-utensils fa-3x" />
		</div>
	);
}

export default LoadingSpinner;
