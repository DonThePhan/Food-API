import classes from './SearchBar.module.css';
import { Fragment, useContext, useState, useEffect } from 'react';
import SearchContext from '../../store/search-context';
import Selector from './Selector';
import RangeSelector from './RangeSelector';
import _ from 'lodash';

function SearchBar(props) {
	const { buttonText } = props;
	const {
		setSearching,
		searchQuery,
		setSearchQuery,
		view,
		setView,
		setAdvancedSearchOptions,
		filterItems,
		filterRangedItems
	} = useContext(SearchContext);

	const [ advancedSearchOn, setAdvancedSearchOn ] = useState(false);
	const [ rangeItems, setRangeItems ] = useState({
		calories: { min: false, max: false, text: false },
		time: { min: false, max: false, text: false }
	});

	function submitHandler(e) {
		e.preventDefault();
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
				if (value.min && value.max) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: `${value.min}-${value.max}` } };
					});
				} else if (value.min && !value.max) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: `${value.min}+` } };
					});
				} else if (!value.min && value.max) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: `0-${value.max}` } };
					});
				} else if (!value.min && !value.max) {
					setRangeItems((prev) => {
						return { ...prev, [key]: { ...value, text: false } };
					});
				}
			}
		},
		// [ rangeItems.calories.min, rangeItems.calories.max, rangeItems.time.min, rangeItems.time.max ] //hard coded version
		[
			...Object.keys(rangeItems).map((key) => rangeItems[key].min),
			...Object.keys(rangeItems).map((key) => rangeItems[key].max),
		]
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
		setRangeItems({
			calories: { min: false, max: false, text: false },
			time: { min: false, max: false, text: false }
		});
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
