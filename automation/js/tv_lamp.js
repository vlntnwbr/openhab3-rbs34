/* --- Rules for synchronizing light bulbs making up the TV Lamp --- */
const {log, rules, triggers} = require("openhab");

let logger = log("television_lamp");


const triggerGroupMap = {
    "tvLampBrightness": "mgTelevisionLampBrightness",
    "tvLampColor": "mgTelevisionLampColor",
    "tvLampColorTemperature": "mgTelevisionLampColorTemperature",
    "tvLampPower": "mgTelevisionLampPower",
}


rules.JSRule({name: "[TV-LAMP] Trigger Item Activated",
    description: "Send command received by trigger to matching group members",
    id: "televisionLampTriggerHandler",
    triggers: [
        triggers.ItemCommandTrigger("tvLampBrightness"),  // cmd => PercentType
        triggers.ItemCommandTrigger("tvLampColor"),  // cmd => HSBType
        triggers.ItemCommandTrigger("tvLampColorTemperature"),  // cmd => DecimalType
        triggers.ItemCommandTrigger("tvLampPower")  // cmd => OnOffType
    ],
    execute: event => {
        const cmd = event.receivedCommand.toString();
        const item = event.itemName;
        const groupName = triggerGroupMap[item];
        logger.info("trigger for '{}' was activated", groupName);
        const tvLampBulbs = items.getItem(groupName).members;
        for (let i = 0; i < tvLampBulbs.length; i++) {
            const groupMember = tvLampBulbs[i];
            logger.info("sending '{}' to '{}'", cmd, groupMember.name);
            groupMember.sendCommand(cmd);
        };
    }
});