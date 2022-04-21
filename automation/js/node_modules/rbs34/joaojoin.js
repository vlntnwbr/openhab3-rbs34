const { actions } = require("openhab");
const { loadJsonSecrets } = require("rbs34/utils");

let logger = log("rbs34.join");
const VALID_API_PARAMETERS = [
    "apikey", "deviceId", "deviceIds", "deviceNames",
    "text", "url", "clipboard", "file", "find",
    "callnumber", "smsnumber", "smstext", "smscontactname",
    "mmssubject", "mmsfile", "mmsurgent",
    "wallpaper", "lockWallpaper",
    "mediaVolume", "ringVolume", "alarmVolume", "interruptionFilter",
    "say", "language", "app", "appPackage"
];


function getValueOfInvalidApiParam(key) {
    if (key in VALID_API_PARAMETERS) return;
    return key;  
};


function sendTaskerCommandViaJoin(device) {
    const body = new JoinPushBody(device);
    const command_args = Array.from(arguments).slice(1);
    if (!command_args.length) {
        errorMessage = "Cannot send command with no arguments"
        logger.error(errorMessage);
        throw new Error(errorMessage);
    };
    const command = command_args.join("=:=");
    logger.info("Sending Tasker Command via Join: {}", command);
    body.text = command;
    const requestJSON = JSON.stringify(body);
    const joinRequest = actions.HTTP.sendHttpPostRequest(
        "https://joinjoaomgcd.appspot.com/_ah/api/messaging/v1/sendPush",
        "application/json", requestJSON, 60000
    );
    const joinResponse = JSON.parse(joinRequest);
    if (!joinResponse.success) {
        logger.error("Join API Call failed: {}", joinResponse);
    };
};


class JoinPushBody {
    constructor(device) {
        logger.info("Fetching Join secrets: {}", device);
        const joinSecrets = loadJsonSecrets("join");
        if (!(device in joinSecrets)) {
            const errorMessage = "Join Device ID not found"
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }
        this.apikey = joinSecrets.apikey;
        this.deviceId = joinSecrets[device];
    };
};

module.exports = {
    sendTaskerCommandViaJoin,
    JoinPushBody
}