import { ErrorMapper } from "./ErrorMapper";

export enum LEVEL{
    LEVEL_ERROR = 0,
    LEVEL_WARN = 1,
    LEVEL_INFO = 2,
    LEVEL_DEBUG = 3
}

export class Logger{
    private level: LEVEL;

    constructor(level?: LEVEL) {
        if(level != null) this.level = level;
        else this.level = LEVEL.LEVEL_INFO;
    }

    private getLevelStr(level: LEVEL): string {
        switch (level) {
            case LEVEL.LEVEL_DEBUG:
                return "DBUG"
            case LEVEL.LEVEL_INFO:
                return "INFO"
            case LEVEL.LEVEL_WARN:
                return "WARN"
            case LEVEL.LEVEL_ERROR:
                return "ERRO"
            default:
                return "????"
        }
    }

    private getLevelColor(level: LEVEL): string{
        switch (level) {
            case LEVEL.LEVEL_DEBUG:
                return "green"
            case LEVEL.LEVEL_INFO:
                return "blue"
            case LEVEL.LEVEL_WARN:
                return "yellow"
            case LEVEL.LEVEL_ERROR:
                return "red"
            default:
                return "white"
        }
    }

    private getLogStr(level: LEVEL, callee: string, message?: string, e?: Error|null): string|null {
        if(level > this.level) return null;
        let color = this.getLevelColor(level);
        let levelStr = this.getLevelStr(level);
        if(message == null) message = "";
        if(e == null) return `<span style='color:${color}'> ${levelStr} [${callee}] :${message}</span>`
        else if ("sim" in Game.rooms) {
            const message = `Source maps don't work in the simulator - displaying original error`;
            return `<span style='color:${color}'>${message}<br>${_.escape(e.stack)}</span>`;
        }else {
            return `<span style='color:${color}'> ${levelStr} [${callee}] : ${message}<br>${_.escape(ErrorMapper.sourceMappedStackTrace(e))}</span>`
        }
    }

    public log(level: LEVEL, message?: string, e?: Error|null, callee?: string) : void {
        if(callee == null){
            const error = new Error();
            if (error.stack) {
                const stackLines = error.stack.split('\n');
                callee = stackLines[1].trim();
            }
            else callee = "";
        }
        let logStr = this.getLogStr(level, callee, message, e);
        if(logStr == null) return;
        console.log(logStr)
    }

    private format(format: string, ...args: any[]): string {
        let formated: string = "";
        try{
            formated = format.replace(/{(\d+)}/g, (match, index) => {
                const argIndex = parseInt(index, 10);
                if(isNaN(argIndex) || argIndex < 0 || argIndex >= args.length)
                    throw new Error(`Invalid argument index: ${index}`);
                return args[argIndex] !== undefined ? args[argIndex] : match;
            });
            return formated;
        }
        catch(e) {
            if(e instanceof Error){
                this.log(LEVEL.LEVEL_WARN, "", e);
                return format;
            }
            else {
                throw e;
            }
        }
    }

    public debug(format: string, ...args: any[]): void {
        let callee: string;
        const error = new Error();
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            callee = stackLines[1].trim();
        }
        else callee = "";

        let logStr = this.format(format, ...args);
        this.log(LEVEL.LEVEL_DEBUG, logStr, null, callee);
    }

    public info(format: string, ...args: any[]): void {
        let callee: string;
        const error = new Error();
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            callee = stackLines[1].trim();
        }
        else callee = "";

        let logStr = this.format(format, ...args);
        this.log(LEVEL.LEVEL_INFO, logStr, null, callee);
    }

    public warn(format: string, ...args: any[]): void {
        let callee: string;
        const error = new Error();
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            callee = stackLines[1].trim();
        }
        else callee = "";

        let logStr = this.format(format, ...args);
        this.log(LEVEL.LEVEL_WARN, logStr, null, callee);
    }

    public error(format: string, ...args: any[]): void {
        let callee: string;
        const error = new Error();
        if (error.stack) {
            const stackLines = error.stack.split('\n');
            callee = stackLines[1].trim();
        }
        else callee = "";

        let logStr = this.format(format, ...args);
        this.log(LEVEL.LEVEL_ERROR, logStr, null, callee);
    }
}
