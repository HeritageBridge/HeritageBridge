import axios from 'axios'

const login = (password) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/login', {password})
      .then(response => resolve(response.data.token))
      .catch(error => reject(error))
  })
}

const getResources = (polygon) => {
  return new Promise((resolve, reject) => {
    axios.post('/api/eamena/resources', polygon)
      .then(response => resolve(response.data))
      .catch(error => reject(error))
  })
}

module.exports = {
  login,
  getResources
}