"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SGCError = exports.SGCClient = void 0;
var SGCError = /** @class */ (function (_super) {
    __extends(SGCError, _super);
    function SGCError(message) {
        var _this = _super.call(this, message) || this;
        _this.name === "SGCError";
        return _this;
    }
    return SGCError;
}(Error));
exports.SGCError = SGCError;
var SGCClient = /** @class */ (function () {
    /**
     *
     * @param {Snowflake} channel_v1 Super Global Chat v1でしようするチャンネル。
     * @param {Snowflake} channel_v2S uper Global Chat v2でしようするチャンネル。
     * @param {boolean} isWebhook 送信にウェブフックを使用するかどうか。
     */
    function SGCClient(client, data) {
        if (!client)
            throw new SGCError("client is not defined");
        var temp = client.channels.cache.get(data.channel_v1);
        if (!temp)
            throw new SGCError("channel_v1 channel not found");
        if (!temp.isText())
            throw new SGCError("channel_v1 channel is not a text channel");
        this.channel_v1 = temp;
        var temp2 = client.channels.cache.get(data.channel_v2);
        if (!temp)
            throw new SGCError("channel_v1 channel not found");
        if (!temp.isText())
            throw new SGCError("channel_v1 channel is not a text channel");
        this.channel_v2 = temp;
        this.isWebhook = data.isWebhook;
        this.messageData = data.messageData;
    }
    /**
     *
     * @param {Message} message メッセージ
     * @param {Collection<Snowflake, TextBasedChannels> | TextBasedChannels[]} sendChannel
     */
    SGCClient.prototype.sgcMessagehandler = function (message, sendChannel, sendingEmoji, sentEmoji) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                if (!message.author.bot)
                    return [2 /*return*/];
                if (message.channel !== this.channel_v1 && message.channel !== this.channel_v2)
                    return [2 /*return*/];
                if (message.channel === this.channel_v1) {
                    data = JSON.parse(message.content);
                    if (data.type !== "message")
                        return [2 /*return*/];
                }
                return [2 /*return*/];
            });
        });
    };
    return SGCClient;
}());
exports.SGCClient = SGCClient;
