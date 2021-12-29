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
  EmojiIdentifierResolvable,
  Webhook,
  BaseGuildTextChannel,
} from "discord.js";
import WebSocket from "ws";

class SGCError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SGCError"
  }
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
  attachmentsUrl?: string[]
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

type MessageDataOptions = (data: SGCDatav1 | Message) => MessageOptions | MessagePayload | WebhookMessageOptions;

interface SGCClientOptions {
  channel_v1: Snowflake,
  channel_v2: Snowflake,
  isWebhook: boolean,
  messageData: MessageDataOptions,
  identifier: string,
  noWarn: boolean
}

interface ThisOptions {
  channel_v1: BaseGuildTextChannel,
  channel_v2: BaseGuildTextChannel,
  client: Client,
  isWebhook: boolean,
  messageData: Function,
  identifier: string
}




function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
class SGCClient {
  public readonly channel_v1: BaseGuildTextChannel;
  public readonly channel_v2: BaseGuildTextChannel
  public readonly isWebhook: boolean;
  public readonly messageData: Function
  public readonly client: Client;
  public readonly identifier: string
  private readonly _noWarn: boolean
  /**
   * 
   * @param {Snowflake} channel_v1 Super Global Chat v1でしようするチャンネル。
   * @param {Snowflake} channel_v2S uper Global Chat v2でしようするチャンネル。
   * @param {boolean} isWebhook 送信にウェブフックを使用するかどうか。
   */
  constructor(client: Client, data: SGCClientOptions) {
    if (!client) throw new SGCError("client is not defined");
    if (!client.user) throw new SGCError("clientuser is does not exist");
    const temp: Channel | undefined = client.channels.cache.get(data.channel_v1);
    if (!temp) throw new SGCError("channel_v1 channel not found");
    if (!(temp instanceof BaseGuildTextChannel)) throw new SGCError("channel_v1 is not a text channel");
    this.channel_v1 = temp;
    const temp2: Channel | undefined = client.channels.cache.get(data.channel_v2);
    if (!temp2) throw new SGCError("channel_v2 channel not found");
    if (!(temp2 instanceof BaseGuildTextChannel)) throw new SGCError("channel_v1 is not a text channel");
    this.channel_v2 = temp2;
    this.isWebhook = data.isWebhook;
    this.messageData = data.messageData;
    this.client = client;
    if (!data.identifier) throw new SGCError("identifier is missing");
    this.identifier = data.identifier;
    this._noWarn = data.noWarn
  }

  /**
   * 
   * @param {Message} message メッセージ
   * @param {Collection<Snowflake, TextBasedChannels> | TextBasedChannels[]} sendChannel
   */
  async messageHandler(message: Message, sendChannel: Collection<Snowflake, TextBasedChannels> | TextBasedChannels[], sendingEmoji?: EmojiIdentifierResolvable, sentEmoji?: EmojiIdentifierResolvable) {
    const SGCWarn = (name: string, message: string): void => {
      if (this._noWarn) throw new SGCError(`SGCWarning: [${name.toUpperCase()}] ${message}`);
      console.warn(`SGCWarning: [${name.toUpperCase()}] ${message}`);
    }

    if (!this.client.user) throw new SGCError("clientuser is does not exist");
    if (!message.author.bot || message.author.id === this.client.user.id) return;
    if (message.channel !== this.channel_v1 && message.channel !== this.channel_v2) return;
    if (message.channel === this.channel_v1) {
      const data: SGCDatav1 = JSON.parse(message.content);
      if (data.type !== "message") return;
      if (sendingEmoji) await message.react(sendingEmoji);
      async function awaitPromise(chs: Collection<Snowflake, TextBasedChannels> | TextBasedChannels[], th: ThisOptions): Promise<void> {
        if (!th.client.user) throw new SGCError("clientuser is does not exist")
        return new Promise((resolve, reject) => {
          let promiseArray: any[] = [];
          chs.forEach(async (ch: TextBasedChannels) => {
            promiseArray.push(((): Promise<void> => {
              return new Promise(async (resol, rejec) => {
                if (th.isWebhook) {
                  if (ch.type !== "GUILD_TEXT") throw new SGCError("sendChannel type is not a TextChannel")
                  const temp = ch.guild.members.cache.get(th.client.user!.id ?? "ahaha");
                  if (!temp) throw new SGCError("bot is not a guild member");
                  if (!ch.permissionsFor(temp).has("MANAGE_WEBHOOKS")) return SGCWarn("MISSING_WEBHOOK_PERMISSIONS", "channel webhook permission is missing.");
                  const hooks: Collection<Snowflake, Webhook> = await ch.fetchWebhooks();
                  let hook: Webhook | undefined = hooks.find((h: Webhook) => h.name === `${th.identifier}-sgc`);
                  if (!hook) {
                    hook = await ch.createWebhook(`${th.identifier}-sgc`);
                    hook.send(th.messageData(data));
                  } else {
                    hook.send(th.messageData(data));
                  }
                } else {
                  await ch.send(th.messageData(data));
                }
                resol();
              });
            })());
          });
          Promise.all(promiseArray).then(() => {
            if (sendingEmoji) message.reactions.cache.find
              (e => e.emoji === sendingEmoji)?.users.remove();
            if (sentEmoji) message.react(sentEmoji);
            resolve();
          })
        })
      };
      const kko: ThisOptions = this;
      awaitPromise(sendChannel, kko);
    }
  }
  async sendMessage(message: Message, sendChannel: Collection<Snowflake, TextBasedChannels> | TextBasedChannels[], sendingEmoji?: EmojiIdentifierResolvable, sentEmoji?: EmojiIdentifierResolvable) {
    if (message.author.bot) return;
    const SGCWarn = (name: string, message: string): void => {
      if (this._noWarn) throw new SGCError(`SGCWarning: [${name.toUpperCase()}] ${message}`);
      console.warn(`SGCWarning: [${name.toUpperCase()}] ${message}`);
    }

    async function awaitPromise(chs: Collection<Snowflake, TextBasedChannels> | TextBasedChannels[], th: ThisOptions): Promise<void> {
      if (sendingEmoji) await message.react(sendingEmoji);
      return new Promise((resolve, reject) => {
        let promiseArray: Promise<unknown>[] = [];
        chs.forEach(async (ch: TextBasedChannels) => {
          promiseArray.push((() => {
            return new Promise(async (resol, rejec) => {
              if (th.isWebhook) {
                if (ch.type !== "GUILD_TEXT") throw new SGCError("sendChannel type is not a TextChannel")
                const temp = ch.guild.members.cache.get(th.client.user!.id ?? "ahaha");
                if (!temp) throw new SGCError("bot is not a guild member");
                if (!ch.permissionsFor(temp).has("MANAGE_WEBHOOKS")) return SGCWarn("MISSING_WEBHOOK_PERMISSIONS", "channel webhook permission is missing.");
                const hooks: Collection<Snowflake, Webhook> = await ch.fetchWebhooks();
                let hook: Webhook | undefined = hooks.find((h: Webhook) => h.name === `${th.identifier}-sgc`);
                if (!hook) {
                  hook = await ch.createWebhook(`${th.identifier}-sgc`);
                  hook.send(th.messageData(message));
                } else {
                  hook.send(th.messageData(message));
                }
              } else {
                await ch.send(th.messageData(message));
              }
              resol(null);
            })
          })());
        });
        Promise.all(promiseArray).then(async () => {
          //owatt asyori
          if (sendingEmoji) message.reactions.cache.find(x => x.emoji === sendingEmoji)?.users.remove();
          if (sentEmoji) {
            message.react(sentEmoji);
            await sleep(3000);
            message.reactions.cache.find(x => x.emoji === sentEmoji)?.users.remove();
          }
          resolve();
        })
      })
    }
    awaitPromise(sendChannel, this);
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
  BaseSGCData,
  MessageDataOptions
}