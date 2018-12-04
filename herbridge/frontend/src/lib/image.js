import moment from 'moment'

const imageSectionsFromImages = (images) => {
  let sections = {}
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const date = moment(image.captureDate).startOf('day').toISOString()
    if (date in sections) {
      const section = sections[date]
      section.push(image)
    } else {
      sections[date] = []
      sections[date].push(image)
    }
  }
  let imageSections = []
  Object.keys(sections).map((key) => {
    const section = sections[key]
    imageSections.push({
      date: key,
      images: section
    })
  })
  return imageSections
}

module.exports = {
  imageSectionsFromImages
}