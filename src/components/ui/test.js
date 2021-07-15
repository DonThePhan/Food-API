const filter = { diet: ['none', 'balanced', 'high - fiber', 'high - protein', 'low - carb', 'low - fat', 'low - sodium'] };

console.log(Object.keys(filter).map(function(key, index) {
    return filter[key].map(item=> item)
  }))