import Cookies from 'js-cookie'
const TOKEN_KEY = "token"

const isLoggedIn = () => {
  return getToken() !== undefined
}

const getToken = () => {
  return Cookies.get(TOKEN_KEY)
}

const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
}

module.exports = {
  isLoggedIn,
  getToken,
  setToken
}
