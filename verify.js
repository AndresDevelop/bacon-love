'use strict';

var path = require('path');

var _ = require('lodash');
var Bacon = require('baconjs');
var exerciser = require('workshopper-exercise');
var filecheck = require('workshopper-exercise/filecheck');
var execute = require('workshopper-exercise/execute');

module.exports = function (tests, testRun) {
  var exercise = _.compose(execute, filecheck)(exerciser());

  exercise.addProcessor(function (mode, callback) {
    var isRunMode = mode === 'run', self = this, passed = true, usersolution;
    var usersolution;

    try{
      usersolution = require(path.resolve(process.cwd(), this.args[0]));
    } catch (e) {
      var message = (e.code !== 'MODULE_NOT_FOUND'
                      ? 'Could not find your file. Make sure the path is correct.'
                      : 'You need to install all of the dependencies you are using in your solution (e.g. "npm install baconjs")');

      this.emit('fail', message);
      return callback(null, false);
    }

    if(typeof usersolution !== 'function'){
      this.emit('fail', 'You should always return a function using module.exports.');
      return callback(null, false);
    }

    if(isRunMode) {
      return run(self, usersolution, testRun, callback);
    }

    var whenAllTestsDone = _.after(tests.length, function() {
      callback(null, passed);
    });

    _.each(tests, function (test, testTitle) {
      run(self, usersolution, test, testTitle, function (err, success) {
        if (!success) passed = false;
        whenAllTestsDone();
      });
    });
  });

  return exercise;
};

function run (exercise, usersolution, test, testTitle, callback) {
  var stream;

  if (typeof testTitle === 'function') {
    callback = testTitle;
    testTitle = void 0;
  }
  testTitle = testTitle || 'Test run';

  try {
    stream = fn.apply(fn, garanteeArray(test.input));
  } catch (e) { }

  if (!isStream(stream)) {
    exercise.emit('fail', 'The exported function should always return an event stream or property.');
    return false;
  }

  test.expect(stream, exercise, function (err) {
    if (err) {
      exercise.emit('fail', testTitle);
      return callback(null, false);
    }

    exercise.emit('pass', testTitle);
    return callback(null, true);
  });
}

function isStream (obj) {
  return obj instanceof Bacon.Property || obj instanceof Bacon.EventStream;
}

function garanteeArray (input) {
  return _.isArray(input) ? input : [input];
}