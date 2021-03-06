const filterItems = {
	diet: [ 'balanced', 'high-fiber', 'high-protein', 'low-carb', 'low-fat', 'low-sodium' ],
	health: [
		'alcohol-free',
		'celery-free',
		'crustacean-free',
		'dairy-free',
		'egg-free',
		'fodmap-free',
		'gluten-free',
		'immuno-supportive',
		'keto-friendly',
		'kosher',
		'low-fat-abs',
		'low-potassium',
		'low-sugar',
		'lupine-free',
		'mustard-free',
		'no-oil-added',
		'paleo',
		'peanut-free',
		'pescatarian',
		'pork-free',
		'red-meat-free',
		'sesame-free',
		'shellfish-free',
		'soy-free',
		'sugar-conscious',
		'tree-nut-free',
		'vegan',
		'vegetarian',
		'wheat-free'
	],
	'cuisine type': [
		'American',
		'Asian',
		'British',
		'Caribbean',
		'Central Europe',
		'Chinese',
		'Eastern Europe',
		'French',
		'Indian',
		'Italian',
		'Japanese',
		'Kosher',
		'Mediterranean',
		'Mexican',
		'Middle Eastern',
		'Nordic',
		'South American',
		'South East Asian'
	],
	'meal type': [ 'Breakfast', 'Dinner', 'Lunch', 'Snack', 'Teatime' ],
	'dish type': [
		'Biscuits and cookies',
		'Bread',
		'Cereals',
		'Condiments and sauces',
		'Desserts',
		'Drinks',
		'Main course',
		'Pancake',
		'Preps',
		'Preserve',
		'Salad',
		'Sandwiches',
		'Side dish',
		'Soup',
		'Starter',
		'Sweets'
	]
};

// export const filterRangedItems = {
// 	calories: 'Calories',
// 	time: 'Time (minutes)',
// 	sugar: 'Sugar'
// };
export const filterRangedItems = [
	{ category: 'calories', label: 'Calories', range: [ 0, 5000 ] },
	{ category: 'time', label: 'Time (minutes)', range: [ 0, 300 ] }
];

export default filterItems;
