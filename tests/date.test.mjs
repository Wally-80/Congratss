import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateCountdown } from "../src/lib/dateUtils.ts";
test("legacy annual and one-time countdown behavior is retained", () => {
  const RealDate = Date;
  const fixed = new RealDate("2026-10-21T12:00:00Z").valueOf();
  globalThis.Date = class extends RealDate {
    constructor(...args) {
      super(...(args.length ? args : [fixed]));
    }
    static now() {
      return fixed;
    }
  };
  try {
    assert.equal(calculateCountdown("2000-10-21").daysLeft, 0);
    assert.equal(calculateCountdown("2000-10-22").daysLeft, 1);
    assert.equal(calculateCountdown("2000-10-20").daysLeft, 364);
    assert.equal(calculateCountdown("2026-10-20", "one_time").isPast, true);
    assert.equal(calculateCountdown("2026-10-22", "one_time").daysLeft, 1);
  } finally {
    globalThis.Date = RealDate;
  }
});
