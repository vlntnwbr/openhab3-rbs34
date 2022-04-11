const { TaggedRuleName } = require("rbs34/utils")

let logger = log("speakers");
const SpeakerRule = new TaggedRuleName("speakers")


rules.JSRule({name: SpeakerRule.get("Sound System - Power On when TV turned on"),
    description: "Power on the Sound System when the Television is turned on",
    id: "speakersPowerFromTV",
    triggers: [
        triggers.ItemStateChangeTrigger("tvWebOSPower", "OFF", "ON"),
    ],
    execute: event => {
        items.getItem("speakersPower").sendCommandIfDifferent("ON");
    }
});


rules.JSRule({name: SpeakerRule.get("Sound System - Power On"),
    description: "Turns on speakersPlug and initiates Chromecast Boot Sequence",
    id: "speakersPowerOn",
    triggers: [
        triggers.ItemCommandTrigger("speakersPower", "ON")
    ],
    execute: event => {
        logger.info("Turning on Sound System");
        items.getItem("speakersPlugPower").sendCommand("ON");
        items.getItem("speakersChromecastBooting").postUpdate("ON");
        items.getItem("speakersChromecastReady").postUpdate("OFF");
    }
});


rules.JSRule({name: SpeakerRule.get("Sound System - Power Off"),
    description: "Stop playback on Chromecast and turn off speakersPlug",
    id: "speakersPowerOff",
    triggers: [
        triggers.ItemCommandTrigger("speakersPower", "OFF"),
    ],
    execute: event => {
        logger.info("Shutting down Sound System");
        items.getItem("speakersChromecastStop").sendCommand("ON");
        items.getItem("speakersPlugPower").sendCommand("OFF");
    }
});


rules.JSRule({name: SpeakerRule.get("Chromecast - Abort Boot Sequence"),
    description: "Updates boot sequence switches when speakersPlug turned off",
    id: "speakersChromecastForceEndBoot",
    triggers: [
        triggers.ItemStateChangeTrigger("speakersPlugPower", "ON", "OFF")
    ],
    execute: event => {
        logger.info("Aborting Chromecast boot sequence")
        items.getItem("speakersChromecastBooting").postUpdate("OFF");
        items.getItem("speakersChromecastReady").postUpdate("OFF");
        items.getItem("speakersPower").postUpdate("OFF");
    }
});


rules.JSRule({name: SpeakerRule.get("Chromecast - End Boot Sequence"),
    description: "Updates boot sequence switches when Chromecast comes online",
    id: "speakersChromecastEndBoot",
    triggers: [
        triggers.ThingStatusChangeTrigger("chromecast:audio:speakers", "ONLINE", "OFFLINE")
    ],
    execute: event => {
        logger.info("Sound System is online");
        items.getItem("speakersChromecastBooting").postUpdate("OFF");
        items.getItem("speakersChromecastReady").postUpdate("ON");
    }
});