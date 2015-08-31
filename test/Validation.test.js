var assert = require('assert');
var jsc = require('jsverify');
var R = require('ramda');
var Validation = require('..');

var equalsInvoker = R.invoker(1, 'equals');

describe('Validation', function() {
  var v = Validation.of(3);
  var success = Validation.success(4);
  var failure = Validation.failure('error');

  jsc.property("is a Functor", "nat -> nat", "nat -> nat", "nat", function(f, g, n) {
    var v = Validation.of(n);
    return equalsInvoker(v.map(R.identity), v) && equalsInvoker(v.map(R.compose(g, f)), v.map(f).map(g));
  });

  // TODO
  // jsc.property("is an Apply", "");

  // TODO
  // jsc.property("is an Applicative", "");

  // TODO
  // jsc.property("is not a Chain");
});
