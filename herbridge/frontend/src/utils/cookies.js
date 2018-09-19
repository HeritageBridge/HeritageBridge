import Cookies from 'js-cookie'
const SESSION_KEY = "tokenId"

const isLoggedIn = () => {
  return getSessionId() !== undefined
}

const getSessionId = () => {
  return Cookies.get(SESSION_KEY)
}

const setSessionId = (id) => {
  Cookies.set(SESSION_KEY, id, { expires: 7 });
}

module.exports = {
  isLoggedIn,
  getSessionId,
  setSessionId
}
