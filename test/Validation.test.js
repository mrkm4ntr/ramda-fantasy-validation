var assert = require('assert');
var jsc = require('jsverify');
var R = require('ramda');
var Validation = require('..');

var equalsInvoker = R.invoker(1, 'equals');

describe('Validation', function() {

  // TODO : should create arbitrary of validation

  jsc.property("is a Functor", "nat -> nat", "nat -> nat", "nat", function(f, g, n) {
    var v = Validation.of(n);
    return equalsInvoker(v.map(R.identity), v) && equalsInvoker(v.map(R.compose(g, f)), v.map(f).map(g));
  });

  jsc.property("is an Apply", "nat -> nat", "nat -> nat", "nat", function(f, g, n) {
    var v = Validation.of(n);
    var a = Validation.of(f);
    var u = Validation.of(g);

    var compose = function(f) {
      return function(g) {
        return function(x) {
          return f(g(x))
        };
      };
    }

    return equalsInvoker(a.map(compose).ap(u).ap(v), a.ap(u.ap(v)));
  });

  // TODO
  // jsc.property("is an Applicative", "");

  // TODO
  // jsc.property("is not a Chain");
});
