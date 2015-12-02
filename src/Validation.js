import * as R from 'ramda'

export default class Validation {
  constructor(value) {
    this.value = value;
  }
  equals(that) {
    return that instanceof this.constructor && R.equals(this.value, that.value);
  }

  map() {
    return this;
  }
  // Validation is Applicative, this method does not satisfy Monad Laws.
  nonMonadicChain() {
    return this;
  }

  get isSuccess() {
    return false;
  }
  get isFailure() {
    return false;
  }

  fold(f1, f2) {
    return this.success ? f1(this.value) : f2(this.value);
  }

  static of(value) {
    return new Success(value);
  }
  static success(value) {
    return Validation.of(value);
  }
  static failure(value) {
    return new Failure([value]);
  }
  static liftAN(n, fn) {
    return R.curryN(n, function(...validations) {
      return R.reduce((a1, a2) => a1.ap(a2), R.head(validations).map(R.curry(fn)), R.tail(validations));
    });
  }
}

class Success extends Validation {
  constructor(x) {
    super(x);
  }
  map(fn) {
    return new Success(fn(this.value));
  }
  ap(that) {
    return that.isSuccess ? that.map(this.value) : that;
  }
  nonMonadicChain(fn) {
    return fn(this.value);
  }
  get isSuccess() {
    return true;
  }
  toString() {
    return `Validation.Success(${R.toString(this.value)})`;
  }
}

class Failure extends Validation {
  constructor(x) {
    super(x);
  }
  ap(that) {
    return that.isSuccess ? this : new Failure(this.value.concat(that.value));
  }
  get isFailure() {
    return true;
  }
  toString() {
    return `Validation.Failure(${R.toString(this.value)})`
  }
}
