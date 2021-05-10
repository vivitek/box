import {Logger} from "@tsed/logger";

const logger = new Logger("GraphQL");
logger.appenders
    .set ("std-log", {
        type: "stdout",
        levels: ["debug", "info", "trace"]
    })
    .set("error-log", {
        type: "stderr",
        levels: ["fatal", "error", "warn"],
        layout: {
            type: "pattern",
            pattern: "%d %p %c %X{user} %m%n"
        }
    })
    .set("all-log-file", {
        type: "file",
        filename: "../graphql.log",
        layout:{
            type: "json",
            separator: ","
        }
    });

export {
    logger
};