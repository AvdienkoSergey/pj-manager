export interface Colors {
  info: string;
  debug: string;
  error: string;
  system: string;
  access: string;
}

export class Logger {
  constructor(logPath: string);
  close(): Promise<void>;
  write(type: keyof Colors, message: string): void;
  log(...args: any[]): void;
  dir(...args: any[]): void;
  debug(...args: any[]): void;
  error(...args: any[]): void;
  system(...args: any[]): void;
  access(...args: any[]): void;
}

export const logger: Logger;
