var events = require('dom-delegation-stream')
  , debounce = require('debounce')
  , test = require('tape')

var values = require('./index')

test('streams values for a single node', function(t) {
  t.plan(1)

  var el = sandbox()
    , stream = events(el, 'click').pipe(values())
    , target = document.createElement('input')

  target.type = 'button'
  target.name = 'test'
  target.value = 'something'

  el.appendChild(target)

  stream.on('data', done)

  target.click()

  function done(data) {
    t.deepEqual({test: 'something'}, data)
  }
})

test('streams values for multiple nodes', function(t) {
  t.plan(1)

  var el = sandbox()
    , stream = events(el, 'click').pipe(values())
    , target1 = document.createElement('input')
    , target2 = document.createElement('input')

  target1.type = 'button'
  target2.type = 'button'
  target1.name = 'one'
  target1.value = 'One'
  target2.name = 'two'
  target2.value = 'Two'

  el.appendChild(target1)
  el.appendChild(target2)

  stream.on('data', debounce(done, 100))

  target1.click()
  target2.click()

  function done(data) {
    t.deepEqual({
        one: 'One'
      , two: 'Two'
    }, data)
  }
})

test('unnamed events cause errors to be emitted', function(t) {
  t.plan(1)

  var el = sandbox()
    , stream = events(el, 'click').pipe(values())
    , target = document.createElement('input')

  target.type = 'button'
  target.value = 'something'

  el.appendChild(target)

  stream.on('data', onData)
  stream.on('error', onError)

  target.click()

  function onData(data) {
    t.fail('should not emit data')
  }

  function onError(err) {
    t.pass('should emit error')
  }
})

test('unnamed events can be ignored', function(t) {
  t.plan(1)

  var el = sandbox()
    , stream = events(el, 'click').pipe(values(null, true))
    , target = document.createElement('input')

  target.type = 'button'
  target.value = 'something'

  el.appendChild(target)

  stream.on('data', onData)
  stream.on('error', onError)

  target.click()

  setTimeout(function() {
    t.pass('should emit no events')
  }, 100)

  function onData(data) {
    t.fail('should not emit data')
  }

  function onError(err) {
    t.fail('should not emit an error')
  }
})

function sandbox(html) {
  var el = document.createElement('div')

  document.body.appendChild(el)

  el.innerHTML = html || ''
  el.destroy = destroy

  return el

  function destroy() {
    if(el && el.parentNode) {
      el.parentNode.removeChild(el)
    }
    el = null
  }
}
