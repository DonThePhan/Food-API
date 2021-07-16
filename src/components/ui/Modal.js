import classes from './Modal.module.css';
import ReactDOM from 'react-dom';
import { Fragment } from 'react';

function ModalOverlay(props) {
    return <div className={classes.modal} >
        <p>Modal Here!</p>
    </div>;
}

function Modal(props) {
	return (
		<Fragment>
            {ReactDOM.createPortal(<ModalOverlay />, document.getElementById('overlay-root'))}
		</Fragment>
	);
}

export default Modal;
