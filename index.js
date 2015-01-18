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
      os.set(
          event.target.name
        , event.target.value !== null && event.target.value !== undefined ?
            event.target.value :
            defaultValue
      )

      return
    }

    var error

    if (!event.target) {
      error = new Error('`event.target` was not available.')
    } else if (!event.target.name) {
      error = new Error('`event.target` was available, but the element was not named')
    }

    os.emit('error', error)
  }
}
