import {
  Client,
  Message,
  TextChannel,
  TextBasedChannel,
  TextBasedChannels,
  Channel,
  Snowflake,
  MessagePayload,
  WebhookMessageOptions,
  MessageOptions
} from "discord.js";

let client:Client | undefined;

function setup(cli:Client) {
  client = cli;
}

class SGCClient {
  private readonly channel_v1:TextBasedChannels; 
  private readonly channel_v2:TextBasedChannels; 
  private readonly isWebhook:boolean;
  private readonly messageData:MessageOptions | MessagePayload | WebhookMessageOptions
  /**
   * 
   * @param {Snowflake} channel_v1 Super Global Chat v1でしようするチャンネル。
   * @param {Snowflake} channel_v2S uper Global Chat v2でしようするチャンネル。
   * @param {boolean} isWebhook 送信にウェブフックを使用するかどうか。
   */
  constructor(
    channel_v1:Snowflake,
    channel_v2:Snowflake,
    isWebhook:boolean,
    messageData:MessageOptions | MessagePayload | WebhookMessageOptions
  ) {
    if (!client) throw new ReferenceError("client is not defined");
    const temp:Channel | undefined = client.channels.cache.get(channel_v1);
    if (!temp) throw new ReferenceError("channel_v1 channel not found");
    if (!temp.isText()) throw new ReferenceError("channel_v1 channel is not a text channel")
    this.channel_v1 = temp;
    const temp2:Channel | undefined = client.channels.cache.get(channel_v2);
    if (!temp) throw new ReferenceError("channel_v1 channel not found");
    if (!temp.isText()) throw new ReferenceError("channel_v1 channel is not a text channel")
    this.channel_v2 = temp;
    this.isWebhook = isWebhook;
    this.messageData = messageData;
  }
}

export {
  SGCClient,
  setup
}