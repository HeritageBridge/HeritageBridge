import moment from 'moment'

const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const concat = (x, y) =>
  x.concat(y)

const flatMap = (array, comparator) =>
  array.map(comparator).reduce(concat, [])

module.exports = {
  capitalize,
  concat,
  flatMap
}