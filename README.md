# dom-value-object-stream

Convert a stream of DOM events into an object of its values.

[![Build Status](http://img.shields.io/travis/fardog/dom-value-object-stream/master.svg?style=flat)](https://travis-ci.org/fardog/dom-value-object-stream)
[![npm install](http://img.shields.io/npm/dm/dom-value-object-stream.svg?style=flat)](https://www.npmjs.org/package/dom-value-object-stream)

This module was written to make listening to form objects easier as a whole,
rather than listening to each input individually.

## Example

Some HTML with three inputs:

```html
<div rel="inputs">
  <input type="text" name="one" />
  <input type="text" name="two" />
  <input type="text" name="three" />
</div>
```

&hellip;and the following Javascript:

```javascript
var events = require('dom-event-stream')
  , values = require('dom-value-object-stream')

events(document.querySelector('[rel=inputs]'), 'input')
  .pipe(values()).on('data', function(data) {
    // some input occurs, entering "One" "Two" and "Three" into their
    // respective inputs
    console.log(data) // {one: 'One', two: 'Two', three: 'Three'}
  })
```

## API

- `values([defaultValue] [, ignoreUnnamed])` - Create a new value transform stream
    - `defaultValue` - String. If no value is found, substitute this value.
      Default is '', a blank string.
    - `ignoreUnnamed` - Boolean. If `true`, unnamed inputs will not raise cause
      the stream to emit an error. Default `false`.

Returns a duplex stream that accepts DOM events, and emits a value object. The
value object is only emitted when its values have changed.

## Events

- Emits a `data` event as any good stream should, with a key/value object, where
  the keys are the element names, and the value is the value of that element.
- Internally, this looks at `event.target.name` and `event.target.value`, so be
  sure that any HTML element you're using has a `name` attribute. 
- The stream will emit `'error'` events if `event.target` or `event.target.name`
  are not available.

## Notes

- `data` events will be fired each time a value changes, so for inputs where a
  user is typing into a form, you will get progressive events, one for each key

## License

MIT. See [LICENSE](./LICENSE) for details.
