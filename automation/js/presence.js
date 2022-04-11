var {log, items, rules, triggers} = require("openhab");

let logger = log("presence")


rules.JSRule({name: "Presence Valentin", description: "Set presence from presencePhoneValentin",
    triggers: [
        triggers.ItemStateChangeTrigger("presencePhoneValentinOnline", "ON", "OFF"),
        triggers.ItemStateChangeTrigger("presencePhoneValentinOnline", "OFF", "ON")
    ],
    execute: data => {
        let presence = items.getItem("presenceValentin");
        let phone = items.getItem("presencePhoneValentinOnline");
        let suspended = items.getItem("presenceValentinSuspended").state;
        if (phone.state == "ON") {
            presence.sendCommand("ON");
            logger.info("Detected Presence of Valentin")
        } else {
            if (suspended == "ON") {
                logger.warning("Presence Detection for Valentin is suspended");
                return
            };
            presence.sendCommand("OFF");
            logger.info("Detected Absence of Valentin");
        };
    }
});