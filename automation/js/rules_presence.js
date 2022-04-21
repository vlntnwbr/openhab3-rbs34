const { TaggedRuleName } = require("./rbs34/utils");
const { sendTaskerCommandViaJoin } = require("./rbs34/joaojoin");


let logger = log("presence");
const PresenceRule = new TaggedRuleName("presence");


// TODO Rule: Presence Notification


rules.JSRule({name: PresenceRule.get("Valentin - Presence Detection Suspension changed"),
    description: "Send current state of suspension item to daily phone",
    id: "presenceDetectionValentinSuspensionChange",
    triggers: [
        triggers.ItemStateChangeTrigger("presenceValentinSuspended", "", ""),
    ],
    execute: event => { sendTaskerCommandViaJoin(
        "dailyPhone", "ohPresenceDetection",
        items.getItem("presenceValentinSuspended").state
    )}
});


rules.JSRule({name: PresenceRule.get("Valentin"),
    description: "Control Presence if not suspended upon Phone Network State",
    id: "presenceDetectionValentin",
    triggers: [
        triggers.ItemStateChangeTrigger("presencePhoneValentinOnline", "ON", "OFF"),
        triggers.ItemStateChangeTrigger("presencePhoneValentinOnline", "OFF", "ON")
    ],
    execute: event => {
        const presence = items.getItem("presenceValentin");
        const phone = items.getItem("presencePhoneValentinOnline");
        const suspended = items.getItem("presenceValentinSuspended").state;
        if (phone.state == "ON") {
            logger.info("Presence Phone for Valentin is online")
            presence.sendCommand("ON");
        } else {
            logger.info("Presence Phone for Valentin is unreachable");
            if (suspended == "ON") {
                logger.warn("Presence Detection for Valentin is suspended");
                return;
            };
            presence.sendCommand("OFF");
        };
    }
});


rules.JSRule({name: PresenceRule.get("Valentin - Arrival"),
    description: "description",
    id: "presenceDetectionValentinArrived",
    triggers: [
        triggers.ItemCommandTrigger("presenceValentin", "ON"),
    ],
    execute: event => {
        logger.info("Detected Arrival of Valentin");
        // TODO start spotify morning music
        // TODO control lights according to Time Of Day
        if (items.getItem("desktopComputerPower").state == "ON") {
            items.getItem("deskPlugPower").sendCommand("ON");
        };
        items.getItem("plugFanPower").sendCommand("ON");
        sendTaskerCommandViaJoin("dailyPhone", "trashRemoval");
    }
});


rules.JSRule({name: PresenceRule.get("Valentin - Departure"),
    description: "Turn Off all Lights and Devices",
    id: "presenceDetectionValentinDeparted",
    triggers: [
        triggers.ItemCommandTrigger("presenceValentin", "OFF"),
    ],
    execute: event => {
        logger.info("Detected Departure of Valentin");
        for (const member of items.getItem("mgAllPowerSwitches").members) {
            member.sendCommand("OFF");
        };
    }
});
