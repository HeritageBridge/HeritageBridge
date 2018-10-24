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
    axios.post('http://34.248.167.252/api/herbridge/get', polygon)
      .then(response => resolve(response))
      .catch(error => reject(error))
  })
}

module.exports = {
  login,
  getResources
}