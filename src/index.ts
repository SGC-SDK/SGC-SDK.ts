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
  MessageOptions,
  Collection,
  TextBasedChannelFields,
  EmojiResolvable
} from "discord.js";

class SGCError extends Error {
  constructor(message:string) {
    super(message);
    this.name === "SGCError"
  }
}

interface SGCClientOptions {
  channel_v1: Snowflake,
  channel_v2: Snowflake,
  isWebhook: boolean,
  messageData: MessageOptions | MessagePayload | WebhookMessageOptions
}

type SGCDataType = "message" | "delete" | "edit" | "empty"

interface BaseSGCData {
  type?: SGCDataType
}

interface SGCDatav1 extends BaseSGCData {
  version?: string,
  userId: Snowflake,
  userName: string,
  userDiscriminator: string,
  userAvatar?: string,
  isBot?: boolean,
  guildId: Snowflake,
  guildName: string,
  guildIcon?: string
  channelId?: Snowflake,
  channelName?: string,
  messageId?: string,
  content: string,
  reference?: Snowflake,
  attachmentsUrl?: URL[] | string[]
}

interface SGCDatav2 extends BaseSGCData {
  //do stuff
}

interface SGCDatav2Edit extends SGCDatav2 {
  messageId: Snowflake,
  content: string
}

interface SGCDatav2Delete extends SGCDatav2 {
  messageId: Snowflake
}

interface SGCDatav2Empty extends SGCDatav2 {

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
  constructor(client:Client, data:SGCClientOptions) {
    if (!client) throw new SGCError("client is not defined");
    const temp:Channel | undefined = client.channels.cache.get(data.channel_v1);
    if (!temp) throw new SGCError("channel_v1 channel not found");
    if (!temp.isText()) throw new SGCError("channel_v1 channel is not a text channel")
    this.channel_v1 = temp;
    const temp2:Channel | undefined = client.channels.cache.get(data.channel_v2);
    if (!temp) throw new SGCError("channel_v1 channel not found");
    if (!temp.isText()) throw new SGCError("channel_v1 channel is not a text channel")
    this.channel_v2 = temp;
    this.isWebhook = data.isWebhook;
    this.messageData = data.messageData;
  }

  /**
   * 
   * @param {Message} message メッセージ
   * @param {Collection<Snowflake, TextBasedChannels> | TextBasedChannels[]} sendChannel
   */
  async sgcMessagehandler(message:Message, sendChannel:Collection<Snowflake, TextBasedChannels> | TextBasedChannels[], sendingEmoji?:EmojiResolvable, sentEmoji?:EmojiResolvable) {
    if (!message.author.bot) return;
    if (message.channel !== this.channel_v1 && message.channel !== this.channel_v2) return;
    if (message.channel === this.channel_v1) {
      const data:SGCDatav1 = JSON.parse(message.content);
      if (data.type !== "message") return;
      
    }
  }
}

export {
  SGCClient,
  SGCError,
  SGCClientOptions,
  SGCDatav1,
  SGCDatav2,
  SGCDataType,
  SGCDatav2Delete,
  SGCDatav2Edit,
  SGCDatav2Empty,
  BaseSGCData
}