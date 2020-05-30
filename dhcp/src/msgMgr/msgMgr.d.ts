export interface MessageManager {
    connect(): void;
    sendMsg(message: string, queue?: string): void;
    sendErr(error: string): void;
}

declare module "MsgMgr";