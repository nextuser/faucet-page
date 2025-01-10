import 'global-agent/bootstrap';
import { setGlobalDispatcher, ProxyAgent } from 'undici';


const proxyEnv =
 // process.env.GLOBAL_AGENT_HTTP_PROXY ||
  process.env.GLOBAL_AGENT_HTTPS_PROXY;

function enableProxyAgent(){
  if (proxyEnv) {
    const proxyUrl = new URL(proxyEnv);
    setGlobalDispatcher(
      new ProxyAgent({
        uri: proxyUrl.protocol + proxyUrl.host,
        token:
          proxyUrl.username && proxyUrl.password
            ? `Basic ${Buffer.from(
                `${proxyUrl.username}:${proxyUrl.password}`,
              ).toString('base64')}`
            : undefined,
      }),
    );
  }
}

export {enableProxyAgent}
