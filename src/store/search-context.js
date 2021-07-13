import { createContext, useState } from 'react';

const SearchContext = createContext({
	searchRecipeResults: [],
	setSearchRecipeResults: () => {},
	searchQuery: '',
	setSearchQuery: () => {},
	searching: false,
	setSearching: () => {},
	view: 'grid',
	setView: () => {},
	advancedSearchOptions: {},
	setAdvancedSearchOptions: () => {}
});

export function SearchProvider(props) {
	const [ searchRecipeResults, setSearchRecipeResults ] = useState([]);
	const [ searchQuery, setSearchQuery ] = useState('');
	const [ searching, setSearching ] = useState(false);
	const [ view, setView ] = useState('grid');
	const [ advancedSearchOptions, setAdvancedSearchOptions ] = useState();

	return (
		<SearchContext.Provider
			value={{
				searchRecipeResults,
				setSearchRecipeResults,
				searchQuery,
				setSearchQuery,
				searching,
				setSearching,
				view,
				setView,
				advancedSearchOptions,
				setAdvancedSearchOptions
			}}
		>
			{props.children}
		</SearchContext.Provider>
	);
}

export default SearchContext;
