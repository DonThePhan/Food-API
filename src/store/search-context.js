import { createContext, useState } from 'react';
import filterItems, { filterRangedItems} from './filterItems';

const SearchContext = createContext({
    initialLoad: false,
    setInitialLoad: () => { },
	searchRecipeResults: [],
	setSearchRecipeResults: () => {},
	searchQuery: '',
	setSearchQuery: () => {},
	searching: false,
	setSearching: () => {},
	view: 'grid',
	setView: () => {},
	advancedSearchOptions: {},
	setAdvancedSearchOptions: () => {},
    filterItems: {},
    filterRangedItems: {},
    savedRecipes: [],
    setSavedRecipes: () => { }
});

export function SearchProvider(props) {
    const [initialLoad, setInitialLoad] = useState(false)
	const [ searchRecipeResults, setSearchRecipeResults ] = useState([]);
	const [ searchQuery, setSearchQuery ] = useState('');
	const [ searching, setSearching ] = useState(false);
	const [ view, setView ] = useState('grid');
    const [advancedSearchOptions, setAdvancedSearchOptions] = useState({});
    const [savedRecipes, setSavedRecipes] = useState([])

	return (
		<SearchContext.Provider
            value={{
                initialLoad,
                setInitialLoad,
				searchRecipeResults,
				setSearchRecipeResults,
				searchQuery,
				setSearchQuery,
				searching,
				setSearching,
				view,
				setView,
				advancedSearchOptions,
				setAdvancedSearchOptions,
                filterItems,
                filterRangedItems,
                savedRecipes,
                setSavedRecipes
			}}
		>
			{props.children}
		</SearchContext.Provider>
	);
}

export default SearchContext;
