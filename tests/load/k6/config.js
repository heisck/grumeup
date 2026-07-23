/**
 * k6 Load Test Configuration
 *
 * Shared thresholds and helper functions for all load test scripts.
 */

// Target thresholds for performance SLOs
export const thresholds = {
  // 95th percentile response time < 500ms
  http_req_duration: ["p(95)<500", "p(99)<1000"],

  // Error rate < 1%
  http_req_failed: ["rate<0.01"],

  // At least 100 requests per second throughput
  http_reqs: ["rate>100"],
};

// Standard stage configurations for progressive load testing
export const stages = {
  smoke: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "30s", target: 0 },
  ],
  load: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 100 },
    { duration: "2m", target: 500 },
    { duration: "5m", target: 500 },
    { duration: "2m", target: 0 },
  ],
  stress: [
    { duration: "2m", target: 500 },
    { duration: "5m", target: 1000 },
    { duration: "5m", target: 2500 },
    { duration: "5m", target: 5000 },
    { duration: "5m", target: 0 },
  ],
  spike: [
    { duration: "10s", target: 100 },
    { duration: "1m", target: 5000 },
    { duration: "3m", target: 5000 },
    { duration: "10s", target: 100 },
    { duration: "3m", target: 100 },
    { duration: "10s", target: 0 },
  ],
};
