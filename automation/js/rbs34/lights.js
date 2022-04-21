/**
 * Lights namespace.
 * This namespace exports objects and functions for use in rules.
 * 
 * @namespace lights
 */

let logger = log("rbs34.lighting")

const presets = {
    "brightness": {
        "off": "0,0,0",
        "low": "0,0,25",
        "mid": "0,0,50",
        "high": "0,0,75",
        "full": "0,0,100"
    },
    "color": {
        "red": "0,100,100",
        "red_dark": "0,100,50",   
        "orange": "30,100,100",
        "orange_dark": "30,100,50",
        "yellow": "60,100,100",
        "yellow_dark": "60,100,50",
        "green": "120,100,100",
        "green_dark": "120,100,50",
        "cyan": "180,100,100",
        "cyan_dark": "180,100,50",
        "blue": "240,100,100",
        "blue_dark": "240,100,50",
        "purple": "270,100,100",
        "pink": "300,100,100"
    }
};


/**
 * Apply a brightness preset to the referenced lamp.
 * @memberof lights
 * @param {string} lamp prefix for needed lighting items
 * @param {string} preset preset to apply
 */
function applyBrightnessPreset(lamp, preset) {
    if (!presets.brightness.hasOwnProperty(preset)) {
        logger.error("unknown brightness preset: {}", preset);
        return;
    };
    logger.info("Applying Brightness Preset: {}: {}", lamp, preset);
    let cmd;
    let itemSuffix;
    if (preset == "off") {
        cmd = "OFF";
        itemSuffix = "Power";
    } else {
        cmd = presets.brightness[preset]
        itemSuffix = "Color"
    };
    items.getItem(lamp + itemSuffix).sendCommand(cmd);
    items.getItem(lamp + "_ColorMode").sendCommand("OFF");
};


/**
 * Apply a color preset to the referenced lamp.
 * @memberof lights
 * @param {string} lamp prefix for needed lighting items
 * @param {string} preset preset to apply
 */
function applyColorPreset(lamp, preset) {
    if (!presets.color.hasOwnProperty(preset)) {
        logger.error("unknown color preset: {}", preset);
        return;
    };
    logger.info("Applying Color Preset: {}: {}", lamp, preset);
    items.getItem(lamp + "Color").sendCommand(presets.color[preset]);
    items.getItem(lamp + "_ColorMode").sendCommand("ON");    
};


module.exports = {
    applyBrightnessPreset,
    applyColorPreset
};
