const { applyBrightnessPreset, applyColorPreset } = require("rbs34/lights");
const { TaggedRuleName } = require("rbs34/utils");

const LightingRule = new TaggedRuleName("lighting");
let logger = log("lighting");


rules.JSRule({name: LightingRule.get("Apply Brightness Preset"),
    description: "Applies the currently selected brightness preset to triggering Lamp",
    id: "lightingApplyBrightnessPreset",
    triggers: [
        triggers.ItemCommandTrigger("lightingPresetBrightnessApplyGlobally", "ON"),
        triggers.ItemCommandTrigger("bulbHolmo_BrightnessTrigger", "ON"),
        triggers.ItemCommandTrigger("loungeBulb_BrightnessTrigger", "ON"),
        triggers.ItemCommandTrigger("tvLamp_BrightnessTrigger", "ON"),
    ],
    execute: event => {
        logger.info("Brightness Preset Application was triggered");
        const triggeringItemName = event.itemName;
        let lamps;
        if (triggeringItemName == "lightingPresetBrightnessApplyGlobally") {
            lamps = ["bulbHolmo", "loungeBulb", "tvLamp"]
        } else {
            lamps = [triggeringItemName.split("_")[0]];
        }
        const preset = items.getItem("lightingPresetBrightness").state.toString();
        lamps.forEach(lamp => applyBrightnessPreset(lamp, preset));
        items.getItem(triggeringItemName).postUpdate("OFF");
    }
});


rules.JSRule({name: LightingRule.get("Apply Color Preset"),
    description: "Applies the currently selected color preset to triggering Lamp",
    id: "lightingApplyColorPreset",
    triggers: [
        triggers.ItemCommandTrigger("lightingPresetColorApplyGlobally", "ON"),
        triggers.ItemCommandTrigger("bulbHolmo_ColorTrigger", "ON"),
        triggers.ItemCommandTrigger("loungeBulb_ColorTrigger", "ON"),
        triggers.ItemCommandTrigger("tvLamp_ColorTrigger", "ON"),
    ],
    execute: event => {
        logger.info("Color Preset Application was triggered");
        const triggeringItemName = event.itemName;

        let lamps;
        if (triggeringItemName == "lightingPresetColorApplyGlobally") {
            lamps = ["bulbHolmo", "loungeBulb", "tvLamp"]
        } else {
            lamps = [triggeringItemName.split("_")[0]];
        }
        const preset = items.getItem("lightingPresetColor").state.toString();
        lamps.forEach(lamp => applyColorPreset(lamp, preset));
        items.getItem(triggeringItemName).postUpdate("OFF");
    }
});


/*rules.JSRule({name: "[LIGHTING] Apply Brightness Preset",
    description: "Applies to selected cmd to all activated Lights",
    id: "lightingApplyBrightnessPreset",
    triggers: [triggers.ItemCommandTrigger("lightingPresetBrightness")],
    execute: event => {
        const preset = event.receivedCommand.toString();
        ["bulbHolmo", "loungeBulb", "tvLamp"].forEach(lamp => {
            applyBrightnessPreset(lamp, preset);
        });
    }
});


rules.JSRule({name: "[LIGHTING] Apply Color Preset",
    description: "Applies selected color preset to activated Lights",
    id: "lightingApplyColorPreset",
    triggers: [triggers.ItemCommandTrigger("lightingPresetColor")],
    execute: event => {
        const preset = event.receivedCommand.toString();
        ["bulbHolmo", "loungeBulb", "tvLamp"].forEach(lamp => {
            applyColorPreset(lamp, preset);
        });
    }
});*/
