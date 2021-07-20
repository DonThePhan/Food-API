import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider } from './store/search-context';
import { AuthContextProvider } from './store/auth-context';

ReactDOM.render(
	<BrowserRouter>
		<SearchProvider>
			<AuthContextProvider>
				<App />
			</AuthContextProvider>
		</SearchProvider>
	</BrowserRouter>,
	document.getElementById('root')
);
