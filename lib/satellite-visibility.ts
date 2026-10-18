export type VisibilityConditions = {
  aboveHorizon: boolean;
  sunlit: boolean;
  darkSky: boolean;
};

export const visibilityConditions = [
  {
    key: 'aboveHorizon',
    label: 'Above your horizon',
    detail: 'The satellite is on your side of the visible horizon.',
    explanation: 'Below your horizon, the Earth blocks your line of sight. A satellite being in orbit does not mean it is overhead at your location.',
  },
  {
    key: 'sunlit',
    label: 'Satellite in sunlight',
    detail: 'Sunlight reaches the satellite, even if it is dark where you are.',
    explanation: 'In this example, Earth’s shadow keeps sunlight from reaching the satellite. Without that sunlight to reflect, this visual pass is not an observing opportunity.',
  },
  {
    key: 'darkSky',
    label: 'Dark observer sky',
    detail: 'Your sky is dark enough to help a moving point of light stand out.',
    explanation: 'A bright sky reduces contrast. Very bright satellites can sometimes be seen in brighter twilight, so darkness is a useful viewing condition rather than an absolute boundary.',
  },
] as const;

export function evaluateVisibility(conditions: VisibilityConditions) {
  const limitations = visibilityConditions.filter(condition => !conditions[condition.key]);
  const favorable = limitations.length === 0;
  const title = !conditions.aboveHorizon
    ? 'The satellite is below your horizon.'
    : !conditions.sunlit
      ? 'The satellite is in Earth’s shadow.'
      : !conditions.darkSky
        ? 'A bright sky can hide the satellite.'
        : 'Conditions favor viewing.';

  return {
    favorable,
    favorableCount: visibilityConditions.length - limitations.length,
    title,
    summary: favorable
      ? 'All three conditions are favorable in this illustration. This is not a guarantee of a sighting: brightness, clouds, glare, and obstructions still matter.'
      : 'Change one condition at a time to see why a satellite on a tracker may not be visible to your eyes.',
    limitations,
  };
}
