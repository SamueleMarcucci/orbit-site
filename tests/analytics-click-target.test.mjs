import assert from 'node:assert/strict';
import test from 'node:test';
import { analyticsClickTarget } from '../lib/analytics-click-target.ts';

// The click listener first resolves closest('[data-analytics-event]').
// An unlabelled input, label, or submit button inside a labelled form resolves
// to that form; only the separate submit listener should track its submission.
test('a form resolved from a field or submit-button click is not a click event', () => {
  const form = { tagName: 'FORM', dataset: { analyticsEvent: 'support_form_submit' } };
  assert.equal(analyticsClickTarget(form), null);
  const testflightForm = { tagName: 'FORM', dataset: { analyticsEvent: 'testflight_application_submit' } };
  assert.equal(analyticsClickTarget(testflightForm), null);
});

test('an explicitly annotated descendant control remains a click target', () => {
  // closest() returns the annotated descendant before its enclosing form.
  const button = { tagName: 'BUTTON', dataset: { analyticsEvent: 'help_click' } };
  assert.equal(analyticsClickTarget(button), button);
});

test('App Store anchor identity and parameters remain available to the listener', () => {
  const anchor = {
    tagName: 'A',
    href: 'https://apps.apple.com/us/app/live-orbit/id6794325315',
    dataset: { analyticsEvent: 'app_store_cta_click', analyticsLabel: 'Hero download' }
  };
  assert.equal(analyticsClickTarget(anchor), anchor);
});

test('a click with no annotated ancestor remains untracked', () => {
  assert.equal(analyticsClickTarget(null), null);
});
