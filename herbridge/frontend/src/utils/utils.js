const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const concat = (x, y) =>
  x.concat(y)

const debounce = (func, delay) => {
  let inDebounce
  return function() {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

const flatMap = (array, comparator) =>
  array.map(comparator).reduce(concat, [])

module.exports = {
  capitalize,
  concat,
  debounce,
  flatMap
}