const { utils } = require("openhab");
const { CONF_SECRETS, TaggedRuleName, JoinPushBody } = require("rbs34/utils")

const TestRule = new TaggedRuleName("testing");
let logger = log("tests");


rules.JSRule({name: TestRule.get("Sending Push to Device Via Join"),
    id: "testingJoinPush",
    triggers: [
        triggers.ItemCommandTrigger("testSwitch"),
    ],
    execute: event => {
        logger.info("Testing request to Join API");
        const cmd = event.receivedCommand.toString();
        let requestBody;
        if (cmd == "ON") { requestBody = new JoinPushBody("dailyPhone")
        } else { requestBody = new JoinPushBody("proxyPhone") };
        logger.info("apikey={} deviceId={}", requestBody.apikey, requestBody.deviceId);
    }
});


/*rules.JSRule({name: "[TESTING] setting color temp of lamps to 0",
    description: "blub",
    id: "testingColorTemp",
    triggers: [
        triggers.ItemCommandTrigger("testSwitch")
    ],
    execute: event => {
        items.getItem("bulbHolmoColorTemperature").sendCommand("0");
    }
});

/*rules.JSRule({name: "[TESTING] Test Switch Received Command",
    description: "Log the item name, state and received command",
    triggers: [triggers.ItemCommandTrigger("testSwitch")],
    execute: event => {
        logger.info("logging event from file based rule");
        const event_keys = Object.keys(event);
        for (let i = 0; i < event_keys.length; i++) {
            const key = event_keys[i];
            logger.info("{}: {}", key, event[key]);
        };
    }
});


/*rules.JSRule({name: "[TESTING] using stuff from other files",
    description: "Try to access variables imported from custom script",
    id: "testRequireModules",
    triggers: [
        triggers.ItemCommandTrigger("testSwitch"),
    ],
    execute: event => {
        logger.info("started rule execution");
        utils.dumpObject(myValue);
    }
});
*/