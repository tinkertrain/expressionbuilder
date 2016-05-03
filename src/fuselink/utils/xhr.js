/**
 * Calls the specified repeatFn until untilFn returns truthy value
 * at an interval of repeatInterval
 * @param {Function} repeatFn            A function that returns promise
 * @param {Function} untilFn             A function that return truthy value based on result of repeatFn
 * @param {Integer} repeatInterval=5000 Interval at which repeatFn is called
 * @return {Promise} Returns a promise that is resolved after untilFn returns truthy value
 */
'use strict';

function waitUntil(repeatFn, untilFn) {
  var repeatInterval = arguments.length <= 2 || arguments[2] === undefined ? 5000 : arguments[2];

  return new Promise(function (resolve, reject) {
    var repeater = setInterval(function () {
      repeatFn().then(function (result) {
        if (untilFn(result)) {
          clearInterval(repeater);
          resolve(result);
        }
      })['catch'](function (error) {
        reject(error);
      });
    }, repeatInterval);
  });
}

/**
 * Handle responses from fuse
 * @param  {Object} response The reponse from fuse
 * @return {Object} The body from the response or an object with a status indicating success
 */
function handleResponse(response) {
  if (response && response.body) {
    return Promise.resolve(response.body);
  }
  return Promise.resolve({
    status: response.status,
    statusText: response.statusText
  });
}

/**
 * Handles errors generated when calling fuse
 * @param  {Object} err The error
 * @return {Promise}     Rejects with a object with a prop type: 'error' and info about the error
 */
function handleError(err) {
  if (err.status) {
    return Promise.reject({
      type: 'error',
      status: err.status,
      msg: err.message,
      description: err.body && err.body.description,
      info: err.body && err.body.info,
      _response: err.response
    });
  }
  return Promise.reject({
    type: 'error',
    msg: err.message
  });
}

module.exports = {
  handleResponse: handleResponse,
  handleError: handleError,
  waitUntil: waitUntil
};