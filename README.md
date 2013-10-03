# constantify [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

A [browserify](http://browserify.org) transform (and standalone function)
that inlines `const` values into your code. Like
[envify](http://github.com/hughsk/envify), this comes in handy for things
such as conditional compilation and as such works well with
[uglifyify](http://github.com/hughsk/uglifyify).

## Usage ##

[![constantify](https://nodei.co/npm/constantify.png?mini=true)](https://nodei.co/npm/constantify)

constantify will pick up `const` definitions at the top of your module, i.e.
outside of any closures, and replace their references with their actual values.
Note that this only works with strings and numbers.

For example, the following code:

``` javascript
const generate = require('./generate')
const SIZE = 64
const SIZE_SQUARED = 64*64

var array = new Float32Array(SIZE_SQUARED)
var n = 0

for (var x = 0; x < SIZE; x += 1)
for (var y = 0; y < SIZE; y += 1) {
  array[n++] = generate(x, y)
}
```

Will be transformed to become this:

``` javascript
const generate = require('./generate')

var array = new Float32Array(4096)
var n = 0

for (var x = 0; x < 64; x += 1)
for (var y = 0; y < 64; y += 1) {
  array[n++] = generate(x, y)
}
```

You can use constantify the same you would as any other browserify transform:

``` bash
browserify -t constantify
```

And to use it from another module, just pass it your source as a string to the
`fromString` method, like so:

``` javascript
var constantify = require('constantify')
var fs = require('fs')

var file = fs.readFileSync(__dirname + '/index.js', 'utf8')
var transformed = constantify.fromString(file)

console.log(transformed)
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/constantify/blob/master/LICENSE.md) for details.
