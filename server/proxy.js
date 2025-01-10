"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableProxyAgent = enableProxyAgent;
require("global-agent/bootstrap");
var undici_1 = require("undici");
var proxyEnv = 
// process.env.GLOBAL_AGENT_HTTP_PROXY ||
process.env.GLOBAL_AGENT_HTTPS_PROXY;
function enableProxyAgent() {
    if (proxyEnv) {
        var proxyUrl = new URL(proxyEnv);
        (0, undici_1.setGlobalDispatcher)(new undici_1.ProxyAgent({
            uri: proxyUrl.protocol + proxyUrl.host,
            token: proxyUrl.username && proxyUrl.password
                ? "Basic ".concat(Buffer.from("".concat(proxyUrl.username, ":").concat(proxyUrl.password)).toString('base64'))
                : undefined,
        }));
    }
}
