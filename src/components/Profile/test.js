const asdf = {a: 1}
const fdsa = asdf

asdf.a = 2
fdsa.a = 3
console.log(asdf, fdsa);
console.log(asdf === fdsa)