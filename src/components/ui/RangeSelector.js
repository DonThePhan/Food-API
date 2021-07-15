function RangeSelector(props) {
	return (
		<div className={props.className}>
			<label htmlFor="">{props.label}</label>
			<input
				value={props.min}
				onChange={(e) => props.rangeItemChange(e, props.name)}
				name="min"
				type="number"
				min="0"
				placeholder="Min"
				style={{ width: '80px' }}
			/>
			<input
				value={props.max}
				onChange={(e) => props.rangeItemChange(e, props.name)}
				name="max"
				type="number"
				min="0"
				placeholder="Max"
				style={{ width: '80px' }}
			/>
		</div>
	);
}

export default RangeSelector