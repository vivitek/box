import { Console } from 'console'
import * as fs from 'fs'
import { stdout, stderr } from 'process'

export class Logger {
    private fileLog: Console
    private displayLog: Console
    private logFile: fs.WriteStream
    private errorFile: fs.WriteStream

    constructor(logFilePath?: string, errorFilePath?: string) {
        if (logFilePath && errorFilePath) {
            this.errorFile = fs.createWriteStream(errorFilePath, { flags: 'a'});
            this.logFile = fs.createWriteStream(logFilePath)
        }

        this.fileLog = new Console({
            stdout: this.logFile,
            stderr: this.errorFile,
            colorMode: false,
        })
        this.displayLog = new Console({
            stdout: stdout,
            stderr: stderr,
            colorMode: 'auto'
        })
    }

    /**
     * Info
     * 
     * 
     * 
     * @param data any
     * @param args any
     * 
     * @returns void
     */
    public info(data: any, ...args: any): void {
        const timestamp: string = `[${new Date().toUTCString()}] - INFO - `;
        this.fileLog.info(timestamp, data, args);
        this.displayLog.info(`${timestamp}${data}`, args);
    }

    /**
     * Warn
     * 
     * 
     * 
     * @param data any
     * @param args any
     */
    public warn(data: any, ...args: any): void {
        const timestamp: string = `[${new Date().toUTCString()}] - WARN - `;
        this.fileLog.warn(timestamp, data, args);
        this.displayLog.warn(`${timestamp}${data}`, args);
    }
}