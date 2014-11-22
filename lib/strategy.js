/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , HabrahabrAPIError = require('./errors/habrahabrapierror');


/**
 * `Strategy` constructor.
 *
 * The Habrahabr authentication strategy authenticates requests by delegating to
 * Habrahabr using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Habrahabr application's App ID
 *   - `clientSecret`  your Habrahabr application's App Secret
 *   - `callbackURL`   URL to which Habrahabr will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new HabrahabrStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/habrahabr/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://habrahabr.ru/auth/o/login/';
  options.tokenURL = options.tokenURL || 'https://habrahabr.ru/auth/o/access-token/';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'habrahabr';
  this._clientID = options.clientID;
  this._profileURL = options.profileURL || 'https://api.habrahabr.ru/v1/users/me';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Habrahabr.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`           always set to `habrahabr`
 *   - `id`                 the user's Habrahabr ID
 *   - `username`           the user's Habrahabr username
 *   - `fullname`           the user's full name
 *   - `gender`             the user's gender
 *   - `time_registered`    the user's registration date
 *   - `score`              the user's score ("karma")
 *   - `rating`             the user's rating
 *   - `rating_position`    the user's rating position
 *   - `location.country`   the user's country
 *   - `location.region`    the user's region
 *   - `location.city`      the user's city
 *   - `counters.posts`     the user's posts counter
 *   - `counters.comments`  the user's comments counter
 *   - `counters.followed`  the user's followed counter
 *   - `counters.followers` the user's followers counter
 *   - `badges`             the user's badges
 *   - `avatar`             the user's avatar
 *   - `is_readonly`        is the user in readonly mode
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = this._profileURL;
  var headers = {
    'client': this._clientID,
    'token': accessToken
  };

  this._oauth2._request('GET', url, headers, '', null, function(err, body, res) {
    var json;

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      if (json && typeof json == 'object') {
        return done(new HabrahabrAPIError(json.code, json.message, json.additional));
      }
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider = 'habrahabr';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
