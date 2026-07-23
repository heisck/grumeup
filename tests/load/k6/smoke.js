import { check, sleep } from "k6";
import http from "k6/http";
import { stages, thresholds } from "./config.js";

/**
 * k6 Smoke Test
 *
 * Verifies the application handles minimal load correctly.
 * Run with: k6 run tests/load/k6/smoke.js
 *
 * Environment:
 *   BASE_URL - Target URL (default: http://localhost:3000)
 */

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  stages: stages.smoke,
  thresholds: thresholds,
};

export default function () {
  // ─── Homepage ──────────────────────────────────────────
  const homeResponse = http.get(`${BASE_URL}/`);

  check(homeResponse, {
    "homepage status is 200": (r) => r.status === 200,
    "homepage loads in < 500ms": (r) => r.timings.duration < 500,
    "homepage contains GrumeUp": (r) => r.body && r.body.includes("GrumeUp"),
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

// k6 built-in text summary
function textSummary(data, opts) {
  // k6 provides this automatically in newer versions
  return JSON.stringify(data, null, 2);
}
