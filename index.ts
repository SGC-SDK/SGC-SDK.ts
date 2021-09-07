import {
  Client,
  Message,
  TextChannel,
  TextBasedChannel,
  TextBasedChannels,
  Channel
} from "discord.js";

let client:Client | undefined;

function setup(cli:Client) {
  client = cli;
}

class SGCClient {
  private readonly channel_v1:TextBasedChannels; 
  constructor(
    channel_v1:string,
    channel_v2:string
  ) {
    if (!client) throw new ReferenceError("client is not defined");
    const temp:Channel | undefined = client.channels.cache.get(channel_v1);
    if (!temp) throw new ReferenceError("channel_v1 channel not found");
    if (!temp.isText()) throw new ReferenceError("channel_v1 channel is not a text channel")
    this.channel_v1 = temp;
    
  }
}

export {
  SGCClient,
  setup
}