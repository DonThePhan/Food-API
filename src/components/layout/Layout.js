import classes from './Layout.module.css';

function Layout(props) {
	return <div className={classes.layout}>{props.children}</div>;
}

export default Layout;
