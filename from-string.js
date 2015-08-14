var generate = require('escodegen').generate
var evaluate = require('static-eval')
var esprima = require('esprima')
var astw = require('astw')

module.exports = constantify

function constantify(buffer) {
  var ast = esprima.parse(buffer)
  var walk = astw(ast)
  var body = ast.body
  var clear = []
  var list = Object.create(null)

  for (var i = 0; i < body.length; i += 1) {
    var node = body[i]
    if (!isConst(node)) continue
    var constants = node.declarations

    for (var c = 0; c < constants.length; c += 1) {
      var name = constants[c].id.name
      var value = evaluate(constants[c].init)

      if (isClean(value)) {
        list[name] = { type: 'Literal', value: value }
        constants.splice(c--, 1)
      }
    }

    if (!constants.length) clear.push(node)
  }

  for (var i = 0; i < clear.length; i += 1) {
    var idx = body.indexOf(clear[i])
    if (idx !== -1) body.splice(idx, 1)
  }

  walk(function(node) {
    if (node.type === 'Identifier' && list[node.name] && isExpression(node.parent))
      rewrite(node, list[node.name])
  })

  return generate(ast, {
    format: {
        semicolons: false
      , indent: { style: '  ' }
    }
  })
}

function isConst(node) {
  return node.type === 'VariableDeclaration'
      && node.kind === 'const'
}

function isClean(value) {
  return value !== undefined
      && typeof value !== 'object'
      && typeof value !== 'function'
}

function isExpression(node) {
  return /Expression$/g.test(node.type)
}

function rewrite(prev, curr) {
  var parent = prev.parent

  for (var key in prev) {
    if (prev.hasOwnProperty(key)) delete prev[key]
  }
  for (var key in curr) {
    if (curr.hasOwnProperty(key)) prev[key] = curr[key]
  }

  curr.parent = parent
}
