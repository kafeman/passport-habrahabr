/**
 * `HabrahabrAPIError` error.
 *
 * @constructor
 * @param {Number} [code]
 * @param {String} [message]
 * @param {Object} [additional]
 * @api public
 */
function HabrahabrAPIError(code, message, additional) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.name = 'HabrahabrAPIError';
  this.code = code;
  this.message = message;
  this.additional = additional;
}

/**
 * Inherit from `Error`.
 */
HabrahabrAPIError.prototype.__proto__ = Error.prototype;


/**
 * Expose `HabrahabrAPIError`.
 */
module.exports = HabrahabrAPIError;
