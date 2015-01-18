var events = require('dom-event-stream')
  , debounce = require('debounce')
  , test = require('tape')

var values = require('./')

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

    t.end()
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

    t.end()
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
