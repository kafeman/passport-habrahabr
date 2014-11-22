# passport-habrahabr

[Passport](http://passportjs.org/) strategy for authenticating with
[Habrahabr](http://habrahabr.ru/) using the OAuth 2.0 API.

This module lets you authenticate using Habrahabr in your Node.js applications.
By plugging into Passport, Habrahabr authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm install passport-habrahabr
```

## Usage

#### Configure Strategy

The Habrahabr authentication strategy authenticates users using a Habrahabr
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying an app ID, app secret and callback URL.

```javascript
passport.use(new HabrahabrStrategy({
    clientID: HABRAHABR_APP_ID,
    clientSecret: HABRAHABR_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/habrahabr/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ habrahabrId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'habrahabr'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```javascript
app.get('/auth/habrahabr',
  passport.authenticate('habrahabr'));

app.get('/auth/habrahabr/callback',
  passport.authenticate('habrahabr', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## Credits

* [Jared Hanson](http://github.com/jaredhanson)
* [kafeman](http://github.com/kafeman)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2011-2014 Jared Hanson http://jaredhanson.net/
Copyright (c) 2014 kafeman http://habrahabr.ru/users/kafeman/
