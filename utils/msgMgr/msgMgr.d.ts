export interface MessageManager {
    connect(): void;
    readMsg(queue?: string): Promise<string>;
    sendMsg(message: string, queue?: string): void;
    sendErr(error: string): void;
}

declare module "MsgMgr";