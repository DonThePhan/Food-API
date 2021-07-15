import { useContext } from 'react';
import SearchContext from '../../store/search-context';
import _ from 'lodash'


function Selector(props) {
    const {advancedSearchOptions} = useContext(SearchContext)
	return (
		<div className={props.className}>
			<label htmlFor="">{_.startCase(props.keyValue)}</label>
			<select
				// defaultValue={advancedSearchOptions.diet}
				value={advancedSearchOptions && advancedSearchOptions[_.camelCase(props.keyValue)] ? advancedSearchOptions[_.camelCase(props.keyValue)] : 'none'}
				onChange={props.advancedOptHandler}
				name={props.keyValue}
				id={props.keyValue}
			>
				{props.values.map(value => <option key={value} value={value}>{value}</option>)}
			</select>
		</div>
	);
}

export default Selector;
