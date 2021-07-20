import classes from './SearchBar.module.css';
import { Fragment, useContext, useState, useEffect } from 'react';
import SearchContext from '../../store/search-context';
import Selector from './Selector';
import RangeSelector from './RangeSelector';
import _ from 'lodash';
import { useLocation, useHistory } from 'react-router-dom';

const serialize = function(obj) {
	var str = [];
	for (var p in obj)
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	return str.join('&');
};

function SearchBar(props) {
	const { buttonText } = props;
	const {
		setSearching,
		searchQuery,
		setSearchQuery,
		view,
		setView,
		advancedSearchOptions,
		setAdvancedSearchOptions,
		filterItems,
		filterRangedItems
	} = useContext(SearchContext);

	const [ advancedSearchOn, setAdvancedSearchOn ] = useState(false);
	const setInitialRangedItems = () => {
		let initialRangedItems = { ...filterRangedItems };

		for (const key of Object.keys(initialRangedItems)) {
			initialRangedItems[key] = { min: false, max: false, text: false };
		}

		return initialRangedItems;
	};
	const [ rangeItems, setRangeItems ] = useState(setInitialRangedItems());

	//* ON LOAD, check query parameters & update seachQuery & advancedSearchOptions - START
	const location = useLocation();
	useEffect(
		() => {
			let search = location.search.substring(1);
			if (search) {
				let queryParams = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(
					key,
					value
				) {
					return key === '' ? value : decodeURIComponent(value);
				});

				if (queryParams.q) {
					setSearchQuery(queryParams.q);
				}

				setAdvancedSearchOptions(queryParams);
				setSearching(true);
			}
		},
		[ setSearchQuery, setAdvancedSearchOptions, setSearching, location.search ]
	);
	//! ON LOAD, check query parameters & update seachQuery & advancedSearchOptions - END

	const history = useHistory();
	function submitHandler(e) {
		e.preventDefault();

		history.push(`/search-recipes?${serialize({ ...advancedSearchOptions, q: searchQuery })}`); //add query Parameters to URL upon search
		setSearching(true);
	}

	function searchInputChangeHandler(e) {
		setSearchQuery(e.target.value);
	}

	function toogleAdvancedSearch() {
		setAdvancedSearchOn((prev) => {
			if (!prev === false) {
				resetSearchOptions();
			}
			return !prev;
		});
	}

	function advancedOptHandler(e) {
		if (e.target.value === 'none') {
			setAdvancedSearchOptions((prev) => {
				const newValue = { ...prev };
				delete newValue[_.camelCase(e.target.name)];
				return newValue;
			});
		} else {
			setAdvancedSearchOptions((prev) => {
				return { ...prev, [_.camelCase(e.target.name)]: e.target.value };
			});
		}
	}

	//* RANGED FILTERS - START ----------------------------------------------------------------------

	function rangeItemChange(e, category) {
		if (e.target.name === 'min') {
			setRangeItems((prev) => {
				return { ...prev, [category]: { ...prev[category], min: e.target.value } };
			});
		} else {
			setRangeItems((prev) => {
				return { ...prev, [category]: { ...prev[category], max: e.target.value } };
			});
		}
	}

	//Everytime a Ranged min/max value updates, update the respective text
	useEffect(
		() => {
			for (const [ key, value ] of Object.entries(rangeItems)) {
				if (value.min && value.max && value.text !== `${value.min}-${value.max}`) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: `${value.min}-${value.max}` } };
					});
				} else if (value.min && !value.max && value.text !== `${value.min}+`) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: `${value.min}+` } };
					});
				} else if (!value.min && value.max && value.text !== `0-${value.max}`) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: `0-${value.max}` } };
					});
				} else if (!value.min && !value.max && value.text !== false) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: false } };
					});
				}
			}
		},
		[ rangeItems ]
	);

	//Update advancedSearchOptions when text in a Ranged Filter updates
	useEffect(
		() => {
			for (const [ key, value ] of Object.entries(rangeItems)) {
				if (value.text) {
					setAdvancedSearchOptions((prev) => {
						return { ...prev, [key]: value.text };
					});
				} else {
					setAdvancedSearchOptions((prev) => {
						const newValue = { ...prev };
						delete newValue[key];
						return newValue;
					});
				}
			}
		},
		// [rangeItems.calories.text, rangeItems.time.text, setAdvancedSearchOptions] //hard coded version
		[ ...Object.keys(rangeItems).map((key) => rangeItems[key].text), setAdvancedSearchOptions ]
	);

	//* RANGED FILTERS - END ----------------------------------------------------------------------

	function resetSearchOptions() {
		setAdvancedSearchOptions({});
		setRangeItems(setInitialRangedItems());
	}

	return (
		<Fragment>
			<div className={classes.searchBar}>
				<div className={classes.searchBarFind}>
					<form onSubmit={submitHandler} className={classes.inputSection}>
						<div>
							<input
								onChange={searchInputChangeHandler}
								placeholder={buttonText}
								id="search"
								type="text"
								value={searchQuery}
							/>
							<button type="submit">
								<i className="fas fa-search" />
							</button>
						</div>
					</form>
					<div className={classes.view}>
						<button className={view === 'grid' ? classes.viewSelected : ''} onClick={() => setView('grid')}>
							<i className="fas fa-th-large" />
						</button>
						<button className={view === 'list' ? classes.viewSelected : ''} onClick={() => setView('list')}>
							<i className="fas fa-bars" />
						</button>
					</div>
				</div>
				<button onClick={toogleAdvancedSearch} className={classes.filter}>
					Filter {!advancedSearchOn ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-up" />}
				</button>
				{advancedSearchOn && (
					<div className={classes.advancedSearch}>
						<button onClick={resetSearchOptions}>reset filter</button>
						{Object.keys(filterItems).map(function(key) {
							return (
								<Selector
									className={classes.categoryWrapper}
									key={key}
									keyValue={key}
									values={filterItems[key]}
									advancedOptHandler={advancedOptHandler}
								/>
							);
						})}
						{Object.keys(filterRangedItems).map(function(key) {
							return (
								<RangeSelector
									className={classes.categoryWrapper}
									key={key}
									name={key}
									label={filterRangedItems[key]}
									min={rangeItems[key].min}
									max={rangeItems[key].max}
									rangeItemChange={rangeItemChange}
								/>
							);
						})}
					</div>
				)}
			</div>
		</Fragment>
	);
}

export default SearchBar;
