const { sendTaskerCommandViaJoin } = require("rbs34/joaojoin");
const { applyBrightnessPreset, applyColorPreset } = require("rbs34/lights");
const { TaggedRuleName, Timer } = require("rbs34/utils");

let logger = log("sleep");
const SleepRule = new TaggedRuleName("sleep");
const WakeTimer = new Timer(function() {
    logger.info("Entering Sleep State: AWAKE");
    items.getItem("SleepState").postUpdate("AWAKE");
    // TODO disable spotify auto playback
    // TODO reset lights according to Time of Day
    sendTaskerCommandViaJoin("dailyPhone", "initMorningRoutine");
});


rules.JSRule({name: SleepRule.get("Process Message from Sleep As Android"),
    description: "Update Sleep State based on received message",
    id: "sleepAsAndroidReceivedCommand",
    triggers: [
        triggers.ItemCommandTrigger("SleepAsAndroid"),
    ],
    execute: event => {
        logger.info("Processing Sleep Command");
        const cmd = event.receivedCommand.toString();
        let newState;
        switch (cmd) {
            case "GoToSleep":                           newState = "BEDTIME"; break;
            case "StartRecording":                      newState = "SLEEPING"; break;
            case "AlarmStarted":                        newState = "ALARM"; break;
            case "AlarmStopped": case "StopRecording":  newState = "WAKING"; break;
            case "DayTime":                             newState = "AWAKE"; break;
            default: logger.error("Unknown Sleep Command: {}", cmd); return;
        };
        const SleepState = items.getItem("SleepState");
        const curState  = SleepState.state.toString();
        if (newState == curState || (newState == "BEDTIME" && curState == "SLEEPING")) return;
        logger.info("Updating Sleep State: {}", newState);
        SleepState.sendCommand(newState);
    }
});


rules.JSRule({name: SleepRule.get("Bedtime"),
    description: "Dim the lights to signal Bedtime",
    id: "initSleepStateBedtime",
    triggers: [triggers.ItemCommandTrigger("SleepState", "BEDTIME")],
    execute: event => {
        // TODO Skip Lighting Control when in Movie Mode
        logger.info("Entering Sleep State: BEDTIME");
        applyBrightnessPreset("loungeBulb", "off");
        applyColorPreset("bulbHolmo", "yellow_dark");
        applyColorPreset("tvLamp", "yellow_dark");
    }
});


rules.JSRule({name: SleepRule.get("Sleeping"),
    description: "Turn off all devices and lights except Bed LEDs",
    id: "initSleepStateSleeping",
    triggers: [triggers.ItemCommandTrigger("SleepState", "SLEEPING")],
    execute: event => {
        logger.info("Entering Sleep State: SLEEPING");
        for (const member of items.getItem("mgAllPowerSwitches").members) {
            if (member.name == "bedPlugLEDStripPower") continue;
            member.sendCommand("OFF");
        };
        if (WakeTimer.active) WakeTimer.cancel();
    }
});


rules.JSRule({name: SleepRule.get("Alarm - Ringing"),
    description: "Turn on Chair Lamp",
    id: "initSleepStateAlarm",
    triggers: [triggers.ItemCommandTrigger("SleepState", "ALARM")],
    execute: event => {
        logger.info("Entering Sleep State: ALARM");
        applyColorPreset("loungeBulb", "yellow");
    }
});


rules.JSRule({name: SleepRule.get("Alarm - Dismissed"),
    description: "Turn On Lights and Schedule Wake Timer",
    id: "initSleepStateWaking",
    triggers: [triggers.ItemCommandTrigger("SleepState", "WAKING")],
    execute: event => {
        logger.info("Entering Sleep State: WAKING");
        // TODO start spotify morning playback
        for (const lamp of ["bulbHolmo", "tvLamp"]) {
            applyColorPreset(lamp, "yellow");
        };
        const WakingDurMinutes = 5 
        if (WakeTimer.active) {
            WakeTimer.reschedule(WakingDurMinutes * 60000);
        } else {
            WakeTimer.schedule(WakingDurMinutes * 60000);
        }
    }
});
