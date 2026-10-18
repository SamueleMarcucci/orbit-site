import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateVisibility, visibilityConditions } from '../lib/satellite-visibility.ts';

test('all three conditions favor viewing without promising a sighting', () => {
  const result = evaluateVisibility({ aboveHorizon: true, sunlit: true, darkSky: true });
  assert.equal(result.favorable, true);
  assert.equal(result.favorableCount, 3);
  assert.equal(result.title, 'Conditions favor viewing.');
  assert.deepEqual(result.limitations, []);
  assert.match(result.summary, /not a guarantee/);
});

test('every combination explains each missing condition, including simultaneous blockers', () => {
  for (const aboveHorizon of [false, true]) {
    for (const sunlit of [false, true]) {
      for (const darkSky of [false, true]) {
        const inputs = { aboveHorizon, sunlit, darkSky };
        const result = evaluateVisibility(inputs);
        assert.equal(result.favorable, aboveHorizon && sunlit && darkSky);
        assert.equal(result.favorableCount, Object.values(inputs).filter(Boolean).length);
        assert.deepEqual(result.limitations.map(item => item.key), visibilityConditions.filter(item => !inputs[item.key]).map(item => item.key));
      }
    }
  }
});

test('below-horizon and shadow examples name the physical blocker', () => {
  assert.equal(evaluateVisibility({ aboveHorizon: false, sunlit: true, darkSky: true }).title, 'The satellite is below your horizon.');
  assert.match(evaluateVisibility({ aboveHorizon: true, sunlit: false, darkSky: true }).limitations[0].explanation, /reflect/);
});

test('a bright observer sky reduces contrast instead of being an absolute impossibility', () => {
  const result = evaluateVisibility({ aboveHorizon: true, sunlit: true, darkSky: false });
  assert.equal(result.favorable, false);
  assert.equal(result.title, 'A bright sky can hide the satellite.');
  assert.match(result.limitations[0].explanation, /bright satellites can sometimes/);
});
