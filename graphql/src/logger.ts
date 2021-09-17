import { Logger } from "@tsed/logger";

const logger = new Logger("GraphQL");
logger.appenders
    .set ("std-log", {
        type: "stdout",
        levels: ["debug", "info", "trace"]
    })
    .set("error-log", {
        type: "stderr",
        levels: ["fatal", "error", "warn"]
    })

export {
    logger
};