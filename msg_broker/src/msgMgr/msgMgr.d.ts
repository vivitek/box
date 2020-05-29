export interface MessageManager {
    connect(): void;
    readMsg(queue?: string): Promise<string>;
}

declare module "MsgMgr";