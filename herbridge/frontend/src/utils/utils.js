const capitalize = s => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const formattedDateStringFromISOString = iso => {
  if (typeof iso !== 'string') return ''
  const date = new Date(iso)
  return date.toLocaleDateString("en-US", {day: 'numeric'})
    + " "
    + date.toLocaleDateString("en-US", {month: 'short'})
    + " "
    + date.toLocaleDateString("en-US", {year: 'numeric'})
}

module.exports = {
  capitalize,
  formattedDateStringFromISOString
}