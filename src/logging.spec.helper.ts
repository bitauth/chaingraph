import type pino from 'pino';

export const mockLogger = () => {
  const mockLog = () => {
    const output = [] as unknown[];
    const logFunction: pino.LogFn = (...args: unknown[]) => {
      output.push(args);
    };
    return { logFunction, output };
  };
  const { logFunction: debug, output: debugOut } = mockLog();
  const { logFunction: error, output: errorOut } = mockLog();
  const { logFunction: info, output: infoOut } = mockLog();
  const { logFunction: trace, output: traceOut } = mockLog();
  const { logFunction: warn, output: warnOut } = mockLog();
  const loggerMock = {
    debug,
    error,
    info,
    trace,
    warn,
  } as unknown as pino.Logger;
  const output = {
    debug: debugOut,
    error: errorOut,
    info: infoOut,
    trace: traceOut,
    warn: warnOut,
  };
  return {
    loggerMock,
    output,
  };
};
