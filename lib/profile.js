/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  var profile = {
    id: json.data.id,
    username: json.data.login,
    time_registered: json.data.time_registered,
    score: json.data.score,
    fullname: json.data.fullname,
    gender: json.data.sex,
    rating: json.data.rating,
    rating_position: json.data.rating_position,
    location: {
      country: json.data.geo.country,
      region: json.data.geo.region,
      city: json.data.geo.city
    },
    counters: {
      posts: json.data.counters.posts,
      comments: json.data.counters.comments,
      followed: json.data.counters.followed,
      followers: json.data.counters.followers
    },
    badges: json.data.badges,
    avatar: json.data.avatar,
    is_readonly: json.data.is_readonly
  };

  return profile;
};
