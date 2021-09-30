/* eslint-disable @typescript-eslint/no-magic-numbers */
import test from 'ava';

import {
  formatBytes,
  formatByteThroughput,
  ThroughputStatistics,
} from './throughput-statistics';

const now = 1;
const fiveMinutesInMs = 5 * 60 * 1000;
const tenMinutesAgo = now - 2 * fiveMinutesInMs;

test('formatBytes', (t) => {
  t.deepEqual(formatBytes(0), '0 B');
  t.deepEqual(formatBytes(1), '1 B');
  t.deepEqual(formatBytes(10), '10 B');
  t.deepEqual(formatBytes(999), '999 B');
  t.deepEqual(formatBytes(1_000), '1.00 KB');
  t.deepEqual(formatBytes(50_220), '50.22 KB');
  t.deepEqual(formatBytes(999_990), '999.99 KB');
  t.deepEqual(formatBytes(999_995), '1.00 MB');
  t.deepEqual(formatBytes(1_000_000), '1.00 MB');
  t.deepEqual(formatBytes(1_999_000), '2.00 MB');
  t.deepEqual(formatBytes(50_999_000), '51.00 MB');
  t.deepEqual(formatBytes(400_440_000), '400.44 MB');
  t.deepEqual(formatBytes(999_990_000), '999.99 MB');
  t.deepEqual(formatBytes(999_995_000), '1.00 GB');
  t.deepEqual(formatBytes(1_000_000_000), '1.00 GB');
  t.deepEqual(formatBytes(4_445_000_000), '4.45 GB');
});

test('formatByteThroughput', (t) => {
  t.deepEqual(formatByteThroughput(0, 0), '- B/s');
  t.deepEqual(formatByteThroughput(0, 1_000), '0 B/s');
  t.deepEqual(formatByteThroughput(100, 100_000), '1 B/s');
  t.deepEqual(formatByteThroughput(50, 500), '100 B/s');
  t.deepEqual(formatByteThroughput(999, 1_000), '999 B/s');
  t.deepEqual(formatByteThroughput(1_000, 1_000), '1.00 KB/s');
  t.deepEqual(formatByteThroughput(50_220, 2_000), '25.11 KB/s');
  t.deepEqual(formatByteThroughput(999_990, 1_000), '999.99 KB/s');
  t.deepEqual(formatByteThroughput(999_995, 1_000), '1.00 MB/s');
  t.deepEqual(formatByteThroughput(1_000_000, 1_000), '1.00 MB/s');
  t.deepEqual(formatByteThroughput(1_999_000, 1_000), '2.00 MB/s');
  t.deepEqual(formatByteThroughput(50_999_000, 1_000), '51.00 MB/s');
  t.deepEqual(formatByteThroughput(400_440_000, 2_000), '200.22 MB/s');
  t.deepEqual(formatByteThroughput(999_990_000, 1_000), '999.99 MB/s');
  t.deepEqual(formatByteThroughput(999_995_000, 1_000), '1.00 GB/s');
  t.deepEqual(formatByteThroughput(1_000_000_000, 1_000), '1.00 GB/s');
  t.deepEqual(formatByteThroughput(4_440_000_000, 2_000), '2.22 GB/s');
});

test('ThroughputStatistics: single metric, serial', (t) => {
  const stats = new ThroughputStatistics(() => ({ unit: 0 }), fiveMinutesInMs);
  const a = stats.startStatistic(now);
  stats.stopStatistic(a, now + 1000, { unit: 20 });
  t.deepEqual(stats.aggregateStatistics(now + 1000), {
    activeDuration: 1000,
    average: { concurrency: 1, duration: 1000, perActiveSecond: { unit: 20 } },
    statisticsCount: 1,
    timeline: [
      { metrics: { concurrency: 1, unit: 20 }, time: 1 },
      { metrics: { concurrency: 0, unit: 0 }, time: 1001 },
    ],
    totals: { unit: 20 },
  });
  const b = stats.startStatistic(now + 1000);
  stats.stopStatistic(b, now + 1500, { unit: 16 });
  t.deepEqual(stats.aggregateStatistics(now + 1000), {
    activeDuration: 1500,
    average: { concurrency: 1, duration: 750, perActiveSecond: { unit: 24 } },
    statisticsCount: 2,
    timeline: [
      { metrics: { concurrency: 1, unit: 20 }, time: 1 },
      { metrics: { concurrency: 1, unit: 32 }, time: 1001 },
      { metrics: { concurrency: 0, unit: 0 }, time: 1501 },
    ],
    totals: { unit: 36 },
  });
});

test('ThroughputStatistics: single metric, parallel', (t) => {
  const stats = new ThroughputStatistics(() => ({ unit: 0 }), fiveMinutesInMs);
  const a = stats.startStatistic(now);
  const b = stats.startStatistic(now);
  stats.stopStatistic(a, now + 1000, { unit: 20 });
  stats.stopStatistic(b, now + 1000, { unit: 40 });
  t.deepEqual(stats.aggregateStatistics(now + 1000), {
    activeDuration: 1000,
    average: {
      concurrency: 2,
      duration: 1000,
      /**
       * Because there are 2 statistics contending for limited throughput, the
       * real per-second rate is double the simple average.
       */
      perActiveSecond: { unit: 60 },
    },
    statisticsCount: 2,
    timeline: [
      { metrics: { concurrency: 2, unit: 60 }, time: 1 },
      { metrics: { concurrency: 0, unit: 0 }, time: 1001 },
    ],
    totals: { unit: 60 },
  });

  const c = stats.startStatistic(now);
  const d = stats.startStatistic(now);
  stats.stopStatistic(c, now + 500, { unit: 30 });
  stats.stopStatistic(d, now + 500, { unit: 30 });
  /**
   * Because there are now 4 statistics contending for limited throughput in
   * the first half second, the "real throughput" in that half second is
   * double the throughput in the second half. (Even though each statistic
   * uses the average 30/1000ms rate from above.) Likewise, the average
   * concurrency is now 3 – in the first half second there are 4 statistics, in
   * the second half second there are 2.
   */
  t.deepEqual(stats.aggregateStatistics(now + 1000), {
    activeDuration: 1000,
    average: {
      concurrency: 3,
      duration: 750,
      perActiveSecond: { unit: 120 },
    },
    statisticsCount: 4,
    timeline: [
      { metrics: { concurrency: 4, unit: 180 }, time: 1 },
      { metrics: { concurrency: 2, unit: 60 }, time: 501 },
      { metrics: { concurrency: 0, unit: 0 }, time: 1001 },
    ],
    totals: { unit: 120 },
  });
});

test('ThroughputStatistics: multiple metrics, default retentionPeriod', (t) => {
  const stats = new ThroughputStatistics(() => ({ inputs: 0, outputs: 0 }));

  /**
   * Statistic is older than the retention window, gets discarded before
   * aggregation.
   */
  stats.addStatistic({
    durationMs: 100,
    metrics: { inputs: 999, outputs: 0 },
    startTime: tenMinutesAgo,
  });
  t.deepEqual(stats.aggregateStatistics(now), {
    activeDuration: 0,
    average: {
      concurrency: 0,
      duration: 0,
      perActiveSecond: { inputs: 0, outputs: 0 },
    },
    statisticsCount: 0,
    timeline: [],
    totals: { inputs: 0, outputs: 0 },
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { inputs: 10, outputs: 0 },
    startTime: now,
  });
  t.deepEqual(stats.aggregateStatistics(now), {
    activeDuration: 100,
    average: {
      concurrency: 1,
      duration: 100,
      perActiveSecond: { inputs: 100, outputs: 0 },
    },
    statisticsCount: 1,
    timeline: [
      { metrics: { concurrency: 1, inputs: 100, outputs: 0 }, time: 1 },
      { metrics: { concurrency: 0, inputs: 0, outputs: 0 }, time: 101 },
    ],
    totals: { inputs: 10, outputs: 0 },
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { inputs: 999, outputs: 999 },
    startTime: tenMinutesAgo,
  });
  t.deepEqual(stats.aggregateStatistics(now), {
    activeDuration: 100,
    average: {
      concurrency: 1,
      duration: 100,
      perActiveSecond: { inputs: 100, outputs: 0 },
    },
    statisticsCount: 1,
    timeline: [
      { metrics: { concurrency: 1, inputs: 100, outputs: 0 }, time: 1 },
      { metrics: { concurrency: 0, inputs: 0, outputs: 0 }, time: 101 },
    ],
    totals: { inputs: 10, outputs: 0 },
  });
  stats.addStatistic({
    durationMs: 1000,
    metrics: { inputs: 100, outputs: 0 },
    startTime: now,
  });
  stats.addStatistic({
    durationMs: 1000,
    metrics: { inputs: 0, outputs: 100 },
    startTime: now,
  });
  t.deepEqual(stats.aggregateStatistics(now), {
    activeDuration: 1000,
    average: {
      concurrency: 2.1,
      duration: 700,
      perActiveSecond: { inputs: 110, outputs: 100 },
    },
    statisticsCount: 3,
    timeline: [
      { metrics: { concurrency: 3, inputs: 200, outputs: 100 }, time: 1 },
      { metrics: { concurrency: 2, inputs: 100, outputs: 100 }, time: 101 },
      { metrics: { concurrency: 0, inputs: 0, outputs: 0 }, time: 1001 },
    ],
    totals: { inputs: 110, outputs: 100 },
  });
  stats.addStatistic({
    durationMs: 1000,
    metrics: { inputs: 100, outputs: 100 },
    startTime: now + 2000,
  });
  t.deepEqual(stats.aggregateStatistics(now), {
    activeDuration: 2000,
    average: {
      concurrency: 1.55,
      duration: 775,
      perActiveSecond: { inputs: 105, outputs: 100 },
    },
    statisticsCount: 4,
    timeline: [
      { metrics: { concurrency: 3, inputs: 200, outputs: 100 }, time: 1 },
      { metrics: { concurrency: 2, inputs: 100, outputs: 100 }, time: 101 },
      { metrics: { concurrency: 0, inputs: 0, outputs: 0 }, time: 1001 },
      { metrics: { concurrency: 1, inputs: 100, outputs: 100 }, time: 2001 },
      { metrics: { concurrency: 0, inputs: 0, outputs: 0 }, time: 3001 },
    ],
    totals: { inputs: 210, outputs: 200 },
  });
});

test('ThroughputStatistics: test highly-stacked statistics', (t) => {
  const stats = new ThroughputStatistics(() => ({ bytes: 0, transactions: 0 }));
  stats.addStatistic({
    durationMs: 100,
    metrics: { bytes: 2000, transactions: 10 },
    startTime: now,
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { bytes: 2000, transactions: 10 },
    startTime: now + 20,
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { bytes: 2000, transactions: 10 },
    startTime: now + 40,
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { bytes: 2000, transactions: 10 },
    startTime: now + 60,
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { bytes: 2000, transactions: 10 },
    startTime: now + 80,
  });
  stats.addStatistic({
    durationMs: 100,
    metrics: { bytes: 2000, transactions: 10 },
    startTime: now + 100,
  });
  t.deepEqual(stats.aggregateStatistics(now), {
    activeDuration: 200,
    average: {
      concurrency: 3,
      duration: 100,
      perActiveSecond: {
        bytes: 60000,
        transactions: 300,
      },
    },
    statisticsCount: 6,
    timeline: [
      {
        metrics: {
          bytes: 20000,
          concurrency: 1,
          transactions: 100,
        },
        time: 1,
      },
      {
        metrics: {
          bytes: 40000,
          concurrency: 2,
          transactions: 200,
        },
        time: 21,
      },
      {
        metrics: {
          bytes: 60000,
          concurrency: 3,
          transactions: 300,
        },
        time: 41,
      },
      {
        metrics: {
          bytes: 80000,
          concurrency: 4,
          transactions: 400,
        },
        time: 61,
      },
      {
        metrics: {
          bytes: 100000,
          concurrency: 5,
          transactions: 500,
        },
        time: 81,
      },
      {
        metrics: {
          bytes: 100000,
          concurrency: 5,
          transactions: 500,
        },
        time: 101,
      },
      {
        metrics: {
          bytes: 80000,
          concurrency: 4,
          transactions: 400,
        },
        time: 121,
      },
      {
        metrics: {
          bytes: 60000,
          concurrency: 3,
          transactions: 300,
        },
        time: 141,
      },
      {
        metrics: {
          bytes: 40000,
          concurrency: 2,
          transactions: 200,
        },
        time: 161,
      },
      {
        metrics: {
          bytes: 20000,
          concurrency: 1,
          transactions: 100,
        },
        time: 181,
      },
      {
        metrics: {
          bytes: 0,
          concurrency: 0,
          transactions: 0,
        },
        time: 201,
      },
    ],
    totals: {
      bytes: 12000,
      transactions: 60,
    },
  });
});

test('ThroughputStatistics throws when a statistic of duration 0ms is added', (t) => {
  const stats = new ThroughputStatistics(() => ({ unit: 0 }), fiveMinutesInMs);

  const a = stats.startStatistic(now);
  t.throws(
    () => {
      stats.stopStatistic(a, now, { unit: 1 });
    },
    {
      message:
        'A statistic duration may be no less than 1. startTimestamp: 1 | durationMs: 0 | {"unit":1}',
    }
  );
});
