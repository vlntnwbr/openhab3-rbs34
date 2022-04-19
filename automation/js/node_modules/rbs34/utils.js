const { actions } = require("openhab");

let logger = log("rbs34.utils");
const SECRETS_DIR = "/openhab/conf/secrets";


class TaggedRuleName {
    constructor(tag) {this.tag = tag.toUpperCase()};
    get(name) {return "[" + this.tag + "] " + name};
};


class Timer {
    constructor(func) {
        this.timeoutId = undefined;
        this.active = false;
        this.execute = function() {func(); this.active = false;};
    };
    schedule(delay) {
        this.throw_error_if("active", "Unable to Schedule");
        this.timeoutId = setTimeout(this.execute, delay);
        this.active = true;
    };
    reschedule(delay) {
        this.throw_error_if("inactive", "Unable to Reschedule");
        this.cancel();
        this.schedule(delay);
    };
    cancel() {
        this.throw_error_if("inactive", "Unable to Cancel");
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        this.active = false;
    };
    throw_error_if(activeState, errorMessage) {
        switch (activeState) {
            case "active":
                if (!this.active) break;
                errorMessage += ": Timer is already active";
                logger.error(errorMessage);
                throw new Error(errorMessage);
            case "inactive":
                if (this.active) break;
                errorMessage += ": Timer is inactive"
                logger.error(errorMessage);
                throw new Error(errorMessage);
            default:
                logger.warning("Invalid Timer.active state: {}", activeState);
        }
    }
};


function loadJsonSecrets(filename) {
    return require(SECRETS_DIR + "/" + filename + ".json");
}


function sendEventGhostCommand(command) {
    const err_msg = "Unable to send command to EventGhost: {}"
    if (items.getItem("desktopComputerOnline").state != "ON") {
        logger.error(err_msg, "Computer Offline");
    }
    logger.info("Sending command to Event Ghost: {}", command);
    const url = "http://vweber-desk:2187/?rbs34." + command;
    actions.HTTP.sendHttpGetRequest(url, 60000);
    return true
};


function iterObject(obj) {
    for (const key in obj) { logger.info("{}: {}", key, obj[key]); };
}


module.exports = {
    Timer,
    TaggedRuleName,
    sendEventGhostCommand,
    iterObject,
    loadJsonSecrets
};
