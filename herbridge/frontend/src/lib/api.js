import axios from 'axios'
import {httpErrorFromAPIError} from '../utils/error'

const login = (password) => {
  return (
    axios.post('/api/login', {password})
      .then(response => response.data.token)
      .catch(error => {
        throw httpErrorFromAPIError(error)
      })
  )
}

const getImages = (polygon) => {
  return (
    axios.post('/api/images/search', polygon)
      .then(response => response.data)
      .catch(error => {
        throw httpErrorFromAPIError(error)
      })
  )
}

const getResources = (polygon) => {
  return (
    axios.post('/api/eamena/resources', polygon)
      .then(response => response.data)
      .catch(error => {
        throw httpErrorFromAPIError(error)
      })
  )
}

const submitSingle = (submission) => {
  return (
    axios.post('/api/eamena/submit', submission)
      .then(response => response.data)
      .catch(error => {
        throw httpErrorFromAPIError(error)
      })
  )
}

const submit = (submissions) => {
  const promises = submissions.map(submitSingle)
  return axios.all(promises)
}

module.exports = {
  login,
  getImages,
  getResources,
  submit
}