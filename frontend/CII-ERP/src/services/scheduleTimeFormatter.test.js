import test from "node:test";
import assert from "node:assert/strict";

import { formatSessionTime } from "./scheduleTimeFormatter.js";

test("formats a plain HH:mm string", () => {
  assert.deepEqual(formatSessionTime("13:00"), { time: "1:00", period: "PM" });
});

test("formats ISO timestamps and handles missing values", () => {
  assert.deepEqual(formatSessionTime("1970-01-01T05:00:00.000Z"), {
    time: "5:00",
    period: "AM",
  });
  assert.deepEqual(formatSessionTime(null), { time: "—", period: "" });
});
