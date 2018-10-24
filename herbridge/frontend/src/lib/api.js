import axios from 'axios'

const login = (password) => {
    return new Promise((resolve, reject) => {
        axios.post('/api/login', { password })
            .then(response => resolve(response.data.token))
            .catch(error => reject(error))
    })
}

module.exports = {
    login
}