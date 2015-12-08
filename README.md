ramda-fantasy-validation
=============

[Fantasy Land][1] compatible Validation with [Ramda][2].  

[1]: https://github.com/fantasyland/fantasy-land
[2]: https://github.com/ramda/ramda

Example
--------

```js
var Validation = require('ramda-fantasy-validation');
var R = require('ramda');

function validateName(name) {
  if (name.length > 0) {
    return Validation.of(name);
  }
  return Validation.failure(['Name is required.']);
}

function validateAge(age) {
  if (age >= 18) {
    return Validation.of(age);
  }
  return Validation.failure(['Age must be or over 18.']);
}

function createUser(name, age) {
  return { 'name': name, 'age': age };
}

// Validation.Success({"age": 99, "name": "mrkm4ntr"})
validateName('mrkm4ntr').map(R.curry(createUser)).ap(validateAge(99));
// or 
Validation.liftAN(2, createUser)(validateName('mrkm4ntr'))(validateAge(99));

// Validation can accumulate error informations.
// Validation.Failure(["Name is required.", "Age must be or over 18."])
Validation.liftAN(2, createUser)(validateName(''))(validateAge(17));
```
