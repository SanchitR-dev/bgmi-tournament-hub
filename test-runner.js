import { strict as assert } from 'assert';
import { calculateTotalPoints } from './src/utils/scoring.js';

function run() {
  console.log('Running node test runner for scoring.js');

  // test 1
  assert.equal(calculateTotalPoints(1, 0, [15,12,10]), 15, 'placement points');

  // test 2
  assert.equal(calculateTotalPoints(2, 3, [15,12,10], 2), 18, 'placement + kill multiplier');

  // test 3
  assert.equal(calculateTotalPoints(10, 4, [15,12,10], 1), 4, 'out of range uses only kills');

  console.log('All node tests passed');
}

run();
