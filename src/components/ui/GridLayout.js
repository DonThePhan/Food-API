import classes from './GridLayout.module.css';

function GridLayout(props) {
	return <div className={classes.gridLayout}>{props.children}</div>;
}

export default GridLayout;
