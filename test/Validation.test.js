var assert = require('assert');
var jsc = require('jsverify');
var R = require('ramda');
var Validation = require('..');

var equalsInvoker = R.invoker(1, 'equals');

var vArb= function(arb) {
  return arb.smap(
    function(nat) {
      return Validation.of(nat);
    },
    function(v) {
      return v.value;
    }
  );
}

var compose = function(f) {
  return function(g) {
    return function(x) {
      return f(g(x))
    };
  };
}

describe('Validation', function() {

  jsc.property("is a Functor", "nat -> nat", "nat -> nat", vArb(jsc.nat),
    function(f, g, v) {
      return equalsInvoker(v.map(R.identity), v) && equalsInvoker(v.map(R.compose(g, f)), v.map(f).map(g));
    }
  );

  jsc.property("is an Apply(composition)", vArb(jsc.fn(jsc.nat)), vArb(jsc.fn(jsc.nat)), vArb(jsc.nat),
    function(a, u, v) {
      return equalsInvoker(a.map(compose).ap(u).ap(v), a.ap(u.ap(v)));
    }
  );

  jsc.property("is an Applicative(identity)", vArb(jsc.nat),
    function(v) {
      return equalsInvoker(Validation.of(R.identity).ap(v), v);
    }
  );

  jsc.property("is an Applicative(homomorphism)", "nat -> nat", "nat",
    function(f, x) {
      return equalsInvoker(Validation.of(f).ap(Validation.of(x)), Validation.of(f(x)));
    }
  );

  jsc.property("is an Applicative(interchange)", vArb(jsc.fn(jsc.nat)), "nat",
    function(u, y) {
      return equalsInvoker(u.ap(Validation.of(y)), Validation.of(function(f) { return f(y); }).ap(u));
    }
  );

  // TODO
  // jsc.property("is not a Chain");
});
