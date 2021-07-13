import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './store/search-context';

ReactDOM.render(
	<BrowserRouter>
		<SearchProvider>
			<App />
		</SearchProvider>
	</BrowserRouter>,
	document.getElementById('root')
);
