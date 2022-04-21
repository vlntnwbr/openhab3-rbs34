const { actions, items } = require ("openhab");
const { TaggedRuleName, sendEventGhostCommand } = require("./rbs34/utils");
const { sendTaskerCommandViaJoin } = require("./rbs34/joaojoin");

let logger = log("desktop");
const DesktopRule = new TaggedRuleName("desktop");


function sendComputerStatesToDailyPhone() {
    sendTaskerCommandViaJoin(
        "dailyPhone", "rbs34DesktopControl",
        items.getItem("desktopComputerPower").state,
        items.getItem("desktopComputerPowerControlSuspended").state
    );
};


rules.JSRule({name: DesktopRule.get("Power Control Suspension Changed"),
    description: "Send Computer States to dailyPhone using Join API",
    id: "desktopPowerControlSuspendedChanged",
    triggers: [
        triggers.ItemStateChangeTrigger("desktopComputerPowerControlSuspended"),
    ],
    execute: event => { sendComputerStatesToDailyPhone(); }
});


rules.JSRule({name: DesktopRule.get("Power On"),
    description: "Wake Desktop, turn on monitors and initiate boot sequence.",
    id: "desktopComputerPowerOn",
    triggers: [
        triggers.ItemCommandTrigger("desktopComputerPower", "ON")
    ],
    execute: event => {
        if (items.getItem("desktopComputerShuttingDown").state == "ON") {
            logger.warn("Aborting Desktop Shutdown");
            items.getItem("desktopComputerPowerOptions").sendCommand("abort");
            return;
        }
        logger.info("Turning on Desktop Computer");
        const desktop = actions.thingActions(
            "network", "network:pingdevice:desktopcomputer"
        );
        desktop.sendWakeOnLanPacketViaMac();
        items.getItem("deskPlugPower").sendCommand("ON");
        items.getItem("desktopComputerShuttingDown").postUpdate("OFF");
        items.getItem("desktopComputerBooting").postUpdate("ON");
    }
});


rules.JSRule({name: DesktopRule.get("Power Off"),
    description: "Initiate Remote shutdown unless remote is disabled.",
    id: "desktopComputerPowerOff",
    triggers: [
        triggers.ItemCommandTrigger("desktopComputerPower", "OFF"),
    ],
    execute: event => {
        if (items.getItem("desktopComputerOnline").state != "ON") {
            logger.error("Computer is already off");
            return;
        } else if (items.getItem("desktopComputerPowerControlSuspended").state == "ON") {
            logger.error("Remote Desktop Power Control is suspended");
            items.getItem("desktopComputerPower").postUpdate("ON");
            return;
        };
        logger.info("Turning off Desktop Computer");
        items.getItem("desktopComputerPowerOptions").sendCommand("shutdown");
    }
});


rules.JSRule({name: DesktopRule.get("Computer Online"),
    description: "Turn on Monitors and finish boot sequence.",
    id: "desktopComputerIsOnline",
    triggers: [
        triggers.ItemStateChangeTrigger("desktopComputerOnline", "OFF", "ON")
    ],
    execute: event => {
        logger.info("Desktop Computer is Online");
        items.getItem("desktopComputerPower").postUpdate("ON");
        items.getItem("desktopComputerBooting").postUpdate("OFF");
        items.getItem("desktopComputerShuttingDown").postUpdate("OFF");
        items.getItem("deskPlugPower").sendCommandIfDifferent("ON");
        sendComputerStatesToDailyPhone();
    }
});


rules.JSRule({name: DesktopRule.get("Computer Offline"),
    description: "Turn off Monitors and end shutdown sequence.",
    id: "desktopComputerIsOffline",
    triggers: [
        triggers.ItemStateChangeTrigger("desktopComputerOnline", "ON", "OFF")
    ],
    execute: event => {
        logger.info("Desktop Computer is Offline");
        items.getItem("desktopComputerPower").postUpdate("OFF");
        items.getItem("desktopComputerShuttingDown").postUpdate("OFF");
        items.getItem("desktopComputerBooting").postUpdate("OFF");
        items.getItem("deskPlugPower").sendCommand("OFF");
        items.getItem("desktopComputerPowerOptions").postUpdate("NULL");
        sendComputerStatesToDailyPhone();
    }
});


rules.JSRule({name: DesktopRule.get("Computer Power Option Triggered"),
    description: "description",
    id: "desktopComputerPowerOptionTriggered",
    triggers: [
        triggers.ItemCommandTrigger("desktopComputerPowerOptions")
    ],
    execute: event => {
        const validPowerOptions = ["abort", "hibernate", "shutdown", "restart"];
        const powerOption = event.receivedCommand.toString();
        items.getItem("desktopComputerPowerOptions").postUpdate("NULL");
        if (!powerOption in validPowerOptions) {
            logger.error("Invalid Power Option: {}", powerOption);
            return;
        } else if (powerOption == "abort") {
            items.getItem("desktopComputerShuttingDown").postUpdate("OFF");
        } else if (powerOption == "shutdown") {
            items.getItem("desktopComputerShuttingDown").postUpdate("ON");
        }
        logger.info("Sending Desktop Power Option: {}", powerOption);
        sendEventGhostCommand(powerOption);
    }
});
