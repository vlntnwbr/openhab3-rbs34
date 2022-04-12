const { iterObject, TaggedRuleName } = require("rbs34/utils");
const { sendTaskerCommandViaJoin } = require("rbs34/joaojoin");

const TestRule = new TaggedRuleName("testing");
let logger = log("tests");


rules.JSRule({name: TestRule.get("Sending Push to Device Via Join"),
    id: "testingJoinPush",
    triggers: [
        triggers.ItemCommandTrigger("testSwitch"),
    ],
    execute: event => {
        logger.info("Testing request to Join API");
        const device = "dailyPhone";
        sendTaskerCommandViaJoin(device, "openHAB", "Hello from openHAB");
    }
});
