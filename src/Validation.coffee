R = require 'ramda'

class Validation
  equals: (that) ->
    that instanceof @constructor && R.equals @value, that.value
  map: -> @
  # Validation is Applicative, this method does not satisfy Monad Laws.
  nonMonadicChain: -> @
  isSuccess: false
  isFailure: false

  fold: (f1, f2) ->
    if @isSuccess then f1(@value) else f2(@value)

  @of: (value) -> new Success value
  @success: (value) -> Validation.of value
  @failure: (value) -> new Failure [value]

  @liftAN: (n, fn) ->
    R.curryN n, ->
      tmp = arguments[0].map R.curry fn
      for a in Array.prototype.slice.call arguments, 1, n
        tmp = tmp.ap a
      tmp

class Success extends Validation
  constructor: (x) -> @value = x
  map: (fn) -> new Success fn @value
  ap: (that) -> if that.isSuccess then that.map @value else that
  nonMonadicChain: (fn) -> fn @value
  isSuccess: true
  toString: -> 'Validation.Success(' + R.toString(@value) + ')'

class Failure extends Validation
  constructor: (x) -> @value = x
  ap: (that) -> if that.isSuccess then @ else new Failure @value.concat that.value
  isFailure: true
  toString : -> 'Validation.Failure(' + R.toString(@value) + ')'

module.exports = Validation
