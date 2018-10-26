class HttpError {
  static get defaults() {
    return {
      statusCode: 400,
      message: "An unknown error occurred"
    }
  }

  constructor(statusCode, message) {
    this.error = new Error(message)
    this.message = message || HttpError.defaults.message
    this.statusCode = statusCode || HttpError.defaults.statusCode
  }
}

function httpErrorFromAPIError(error) {
  const res = error.response
  return new HttpError(res.status, res.data.message || res.data.detail)
}

module.exports = {
  HttpError,
  httpErrorFromAPIError,
}