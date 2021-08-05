import classes from './SearchBar.module.css';
import { Fragment, useContext, useState, useEffect, useCallback } from 'react';
import SearchContext from '../../store/search-context';
import _ from 'lodash';
import { useLocation, useHistory } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

import SliderFilter from './SliderFilter';

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

	const selectorItems = Object.keys(filterItems).map((key) => {
		return {
			[key]: filterItems[key].map((value) => {
				return { value: value, label: value };
			})
		};
	});

	const [ advancedSearchOn, setAdvancedSearchOn ] = useState(false);

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

	//begin search upon submit & updated query params in URL to match
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

	function advancedOptHandler(e, category) {
		if (!e) {
			setAdvancedSearchOptions((prev) => {
				const newValue = { ...prev };
				delete newValue[_.camelCase(category)];
				return newValue;
			});
		} else {
			setAdvancedSearchOptions((prev) => {
				return { ...prev, [_.camelCase(category)]: e.value };
			});
		}
	}

	//* RANGED FILTERS - START ----------------------------------------------------------------------
	const [ rangedFilters, setRangedFilters ] = useState(
		filterRangedItems.map((categoryObj) => {
			return { [categoryObj.category]: categoryObj.range };
		})
	); //i.e. [{time: [0,300]},{calories: [0,5000]}]
	const [ selRangeCat, setSelRanCat ] = useState(null);

	useEffect(
		() => {
			if (selRangeCat) {
				const selRange = rangedFilters.find((categoryObj) => selRangeCat in categoryObj)[selRangeCat];
				const selBaseRange = filterRangedItems.find((catObj) => catObj.category === selRangeCat).range;

				setAdvancedSearchOptions((prev) => {
					if (selRange[0] === selBaseRange[0] && selRange[1] === selBaseRange[1]) {
						//* min range 0, range max range hit -> delete parameter

						const newValue = { ...prev };
						delete newValue[_.camelCase(selRangeCat)];
						console.log(newValue);
						return newValue;
					} else if (selRange[1] === selBaseRange[1]) {
						//* min range & max range=max -> 'minRange+'

						if (prev && selRangeCat in prev && prev[selRangeCat] === `${selRange[0]}+`) return prev;
						console.log(`${selRange[0]}+`);
						return { ...prev, [selRangeCat]: `${selRange[0]}+` };
					} else if (selRange[0] === selBaseRange[0]) {
						//* min range=min & max range -> 'maxRange'

						if (prev && selRangeCat in prev && prev[selRangeCat] === `${selRange[1]}`) return prev;
						console.log(`${selRange[1]}`);
						return { ...prev, [selRangeCat]: `${selRange[1]}` };
					} else {
						//* min range & max range -> 'minRange-maxRange'

						if (prev && selRangeCat in prev && prev[selRangeCat] === `${selRange[0]}-${selRange[1]}`)
							return prev;
						console.log(`${selRange[0]}-${selRange[1]}`);
						return { ...prev, [selRangeCat]: `${selRange[0]}-${selRange[1]}` };
					}
				});
			}
		},
		[ selRangeCat, rangedFilters, filterRangedItems, setAdvancedSearchOptions ]
	);
	//* RANGED FILTERS - END ----------------------------------------------------------------------

	function resetSearchOptions() {
		setAdvancedSearchOptions({});
		setRangedFilters(
			filterRangedItems.map((categoryObj) => {
				return { [categoryObj.category]: categoryObj.range };
			})
		);
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
					{!advancedSearchOn ? 'Filter ' : 'Reset Filter '}
					{!advancedSearchOn ? <i className="fas fa-caret-down" /> : <i className="fas fa-caret-up" />}
				</button>
				{advancedSearchOn && (
					<div className={classes.advancedSearch}>
						{selectorItems.map((categoryObj) => {
							return Object.keys(categoryObj).map((key) => {
								return (
									<div key={key} className={classes.categoryWrapper}>
										<label htmlFor="">{_.startCase(key)}</label>
										<Select
											className={classes.select}
											options={categoryObj[key]}
											placeholder="Select..."
											onChange={(e) => advancedOptHandler(e, key)}
											isClearable
										/>
									</div>
								);
							});
						})}
						<div className={classes.rangeItems}>
							{filterRangedItems.map((categoryObj) => {
								return (
									<SliderFilter
										key={categoryObj.category}
										info={categoryObj}
										currentRange={
											rangedFilters.find((obj) => {
												return categoryObj.category in obj;
											})[categoryObj.category]
										}
										setRangedFilters={setRangedFilters}
										setSelRanCat={setSelRanCat}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</Fragment>
	);
}

export default SearchBar;
