# dom-value-object-stream

Convert a stream of DOM events into an object of its values.

[![Build Status](http://img.shields.io/travis/fardog/dom-value-object-stream/master.svg?style=flat)](https://travis-ci.org/fardog/dom-value-object-stream)
[![npm install](http://img.shields.io/npm/dm/dom-value-object-stream.svg?style=flat)](https://www.npmjs.org/package/dom-value-object-stream)

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

- `values([defaultValue])` - Create a new value transform stream
    - `defaultValue` - If no value is found, substitute this value. Default is
      '', a blank string.

Returns a duplex stream that accepts DOM events, and emits a value object. The
value object is only emitted when its values have changed.

Internally, this looks at `event.target.name` and `event.target.value`, so be
sure that any HTML element you're using has a `name` attribute. Unnamed
elements are ignored.

## License

MIT. See [LICENSE](./LICENSE) for details.
