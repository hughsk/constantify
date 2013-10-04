var through = require('through')
var constantify = require('./from-string')

module.exports = transform
module.exports.fromString = constantify

function transform(file) {
  if (/\.json$/.test(file)) return through()

  var buffer = ''

  return through(function(data) {
    buffer += data
  }, function() {
    this.queue(constantify(buffer))
    this.queue(null)
  })
}
