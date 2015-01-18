var through = require('through')
  , duplexer = require('duplexer')
  , objectstate = require('objectstate')

module.exports = valueObjectStream

function valueObjectStream(_defaultValue) {
  var input = through(write)
    , os = objectstate()
    , defaultValue = _defaultValue || ''

  return duplexer(input, os)

  function write(event) {
    if(event.target && event.target.name) {
      os.set(event.target.name, event.target.value || defaultValue)
    }
  }
}
