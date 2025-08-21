import { describe, it, expect } from 'vitest';
import { calculateTotalPoints } from '../../utils/scoring';

describe('calculateTotalPoints', () => {
  it('returns placement points when kills=0', () => {
    const pts = calculateTotalPoints(1, 0, [15,12,10]);
    expect(pts).toBe(15);
  });

  it('adds kill points', () => {
    const pts = calculateTotalPoints(2, 3, [15,12,10], 2);
    // placement 12 + kills 3*2 = 6 => 18
    expect(pts).toBe(18);
  });

  it('returns only kills when rank out of range', () => {
    const pts = calculateTotalPoints(10, 4, [15,12,10], 1);
    expect(pts).toBe(4);
  });
});
