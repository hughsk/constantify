var through = require('through')
var constantify = require('./from-string')

module.exports = transform
module.exports.fromString = constantify

function transform(file) {
  var buffer = ''

  return through(function(data) {
    buffer += data
  }, function() {
    this.queue(constantify(buffer))
    this.queue(null)
  })
}
