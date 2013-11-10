/**
 * Created by jimmy on 09/11/13.
 */

exports.getAppUrl = function (req, res) {
  var protocol = req.protocol;
  var host = req.host;
  var port = process.env.PORT || 3000;

  res.send(protocol + '://' + host + ':' + port + '/deezer/get_channel');
};
