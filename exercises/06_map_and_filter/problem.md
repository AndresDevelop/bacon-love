# Map and Filter with Observables

Being able to easily transform the values in observables is what makes FRP
such a powerful tool. You are probably already familiar with the map and
filter combinators from functional programming (if not, I would suggest taking
a look at the `functional-javascript-workshop` workshopper). `map` and
`filter` works pretty much the same way on Observables as they do on
Collections.

An example of how map would work on a stream of clicks from a button:
```js
var clicks = Bacon.fromEventTarget(document.querySelector('button'), 'clicks');
var ones = clicks.map(function (c) { return 1; });

/*
  clickStream: ---c----c--c----c------c-->

               vvvv    map(c => 1)    vvvv

  oneStream:   ---1----1--1----1------1-->
*/
```

This is also where immutablitiy comes into play again. When mapping or
filtering an Observable you will get a whole new Observable instead of
modifying the source Observable. This goes for all the combinators in Bacon.js
aswell. The new Observable will emit the transformed value each time the
source Observable emits a value.

`filter` also transforms the values, but instead of giving them a new value it
will decide wether the value should be emitted or skipped entirely. This gives
it an important distinction from `map` which will emit a value each time the
source emits a value.

To illustrate:
```js
var values = Bacon.fromEventTarget(document.querySelector('input'), 'keyup');
var highValues = clicks.filter(function (v) { return v > 10; });

/*
  valueStream: --4----11--3----12------15-->

               vvv  filter(v => v > 10)  vvv

  highValues:  -------11-------12------15-->
*/
```

## The problem

The year is 3001 and the planet Earth is under attack by the Zrrks of planet
Omicron Persei 7. In order to help the Earthian Defence Force you have been
tasked with the gathering of intelligence on the incoming Zrrk invasion. The
EDF has provided you with two key sensors which gives constant readings on
critical metrics of the invading Zrrk force:

- A sensor which registers all ships that enter our solar system.
- A sensor which at any time registers the position of the Zrrk Planet
Destroyer in lightyears.

Your assignment is to provide three key strategical pieces of information:

- A stream which emits a 1 for Zrrk ships and a 0 for all other ships which
passes the sensor.
- A property which reads the current threat level based on the distance of the
Zrrk Planet Destroyer.
  - Low threat for `x>5`.
  - Medium threat for `5=>x>2`.
  - High threat for `2=>x>=1`.
  - Extreme threat for `x<1`.
- A stream which emits a 1 for Zrrk ships and a 0 for all other ships which
passes the sensor, but only after we have achieved extreme threat.

Ships entering the solar system will have this information:
```json
{
  "type": "zrrk|earthian|purple|martian"
}
```

## Template


```js
// include the Bacon.js library
var Bacon = require('baconjs');

module.exports = function (enteringShips, destroyerPosition) {
  return {
    ships: void 0, // Your ship counter goes here
    threat: void 0, // Your threat level goes here
    postArrivalShips: void 0 // Your ship counter post arrival goes here
  };
};
```