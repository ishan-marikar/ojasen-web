// lib/auth-logger.ts
// Simple logger for authentication events that works in both browser and server

export class AuthLogger {
  static log(level: 'info' | 'warn' | 'error', message: string, metadata?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      metadata,
    };

    // Always log to console
    console.log(`[AUTH ${level.toUpperCase()}]`, message, metadata || '');

    // In server environment, we could write to a file
    // But for now, we'll just log to console in both environments
    if (typeof window === 'undefined') {
      // Server-side logging could be implemented here
      // For example, writing to a file or sending to a logging service
    }
  }

  static info(message: string, metadata?: any) {
    this.log('info', message, metadata);
  }

  static warn(message: string, metadata?: any) {
    this.log('warn', message, metadata);
  }

  static error(message: string, metadata?: any) {
    this.log('error', message, metadata);
  }
}