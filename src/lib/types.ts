import React from 'react';
import type SendbirdChat from '@sendbird/chat';
import type { User, SendbirdChatParams, SendbirdError } from '@sendbird/chat';

import type {
  GroupChannel,
  GroupChannelCreateParams, GroupChannelModule,
} from '@sendbird/chat/groupChannel';
import type {
  OpenChannel,
  OpenChannelCreateParams, OpenChannelModule,
} from '@sendbird/chat/openChannel';
import type {
  FileMessage,
  FileMessageCreateParams,
  UserMessage,
  UserMessageCreateParams,
  UserMessageUpdateParams,
} from '@sendbird/chat/message';
import { SBUConfig } from '@sendbird/uikit-tools';
import { Module, ModuleNamespaces } from '@sendbird/chat/lib/__definition';

import type {
  RenderUserProfileProps,
  ReplyType,
  UserListQuery,
} from '../types';
import { UikitMessageHandler } from './selectors';
import { Logger } from './SendbirdState';
import { MarkAsReadSchedulerType } from './hooks/useMarkAsReadScheduler';
import { MarkAsDeliveredSchedulerType } from './hooks/useMarkAsDeliveredScheduler';
import { PartialDeep } from '../utils/typeHelpers/partialDeep';
import { CoreMessageType } from '../utils';
import { UserActionTypes } from './dux/user/actionTypes';
import { SdkActionTypes } from './dux/sdk/actionTypes';
import { ReconnectType } from './hooks/useConnect/types';
import { SBUGlobalPubSub } from './pubSub/topics';
import { EmojiManager } from './emojiManager';
import { MessageTemplatesInfo, ProcessedMessageTemplate, WaitingTemplateKeyData } from './dux/appInfo/initialState';
import { AppInfoActionTypes } from './dux/appInfo/actionTypes';

// note to SDK team:
// using enum inside .d.ts won’t work for jest, but const enum will work.
export const Role = {
  OPERATOR: 'operator',
  NONE: 'none',
} as const;

export interface SBUEventHandlers {
  reaction?: {
    onPressUserProfile?(member: User): void;
  },
  connection?: {
    onFailed?(error: SendbirdError): void;
  }
}

export interface SendBirdStateConfig {
  disableUserProfile: boolean;
  disableMarkAsDelivered: boolean;
  renderUserProfile?: (props: RenderUserProfileProps) => React.ReactElement;
  onUserProfileMessage?: (props: GroupChannel) => void;
  allowProfileEdit: boolean;
  isOnline: boolean;
  userId: string;
  appId: string;
  accessToken: string;
  theme: string;
  pubSub: SBUGlobalPubSub;
  logger: Logger;
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  /** @deprecated Please use setCurrentTheme instead * */
  setCurrenttheme: (theme: 'light' | 'dark') => void;
  userListQuery?(): UserListQuery;
  isReactionEnabled: boolean;
  isMentionEnabled: boolean;
  isMultipleFilesMessageEnabled: boolean;
  isVoiceMessageEnabled?: boolean;
  uikitUploadSizeLimit: number;
  uikitMultipleFilesMessageLimit: number;
  voiceRecord?: {
    maxRecordingTime: number;
    minRecordingTime: number;
  };
  userMention: {
    maxMentionCount: number,
    maxSuggestionCount: number,
  };
  imageCompression?: {
    compressionRate?: number,
    resizingWidth?: number | string,
    resizingHeight?: number | string,
  };
  markAsReadScheduler: MarkAsReadSchedulerType;
  markAsDeliveredScheduler: MarkAsDeliveredSchedulerType;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  replyType: ReplyType;
  showSearchIcon?: boolean;
  // Remote configs set from dashboard by UIKit feature configuration
  groupChannel: {
    enableOgtag: SBUConfig['groupChannel']['channel']['enableOgtag'];
    enableTypingIndicator: SBUConfig['groupChannel']['channel']['enableTypingIndicator'];
    enableDocument: SBUConfig['groupChannel']['channel']['input']['enableDocument'];
    enableReactions: SBUConfig['groupChannel']['channel']['enableReactions'];
    replyType: SBUConfig['groupChannel']['channel']['replyType'];
    threadReplySelectType: SBUConfig['groupChannel']['channel']['threadReplySelectType'];
    typingIndicatorTypes: SBUConfig['groupChannel']['channel']['typingIndicatorTypes'];
    enableFeedback: SBUConfig['groupChannel']['channel']['enableFeedback'];
    enableSuggestedReplies: SBUConfig['groupChannel']['channel']['enableSuggestedReplies'];
    showSuggestedRepliesFor: SBUConfig['groupChannel']['channel']['showSuggestedRepliesFor'];
  },
  openChannel: {
    enableOgtag: SBUConfig['openChannel']['channel']['enableOgtag'];
    enableDocument: SBUConfig['openChannel']['channel']['input']['enableDocument'];
  },
}

export type SendbirdChatType = SendbirdChat & ModuleNamespaces<[GroupChannelModule, OpenChannelModule]>;
export interface SdkStore {
  error: boolean;
  initialized: boolean;
  loading: boolean;
  sdk: SendbirdChatType;
}

export interface UserStore {
  initialized: boolean;
  loading: boolean;
  user: User;
}

export interface AppInfoStore {
  messageTemplatesInfo?: MessageTemplatesInfo;
  waitingTemplateKeysMap: Record<string, WaitingTemplateKeyData>;
}

export interface SendBirdStateStore {
  sdkStore: SdkStore;
  userStore: UserStore;
  appInfoStore: AppInfoStore;
}

export type SendBirdState = {
  config: SendBirdStateConfig;
  stores: SendBirdStateStore;
  dispatchers: {
    sdkDispatcher: React.Dispatch<SdkActionTypes>,
    userDispatcher: React.Dispatch<UserActionTypes>,
    appInfoDispatcher: React.Dispatch<AppInfoActionTypes>,
    reconnect: ReconnectType,
  },
  // Customer provided callbacks
  eventHandlers?: SBUEventHandlers;
  emojiManager?: EmojiManager;
  utils: SendbirdProviderUtils;
};

type GetSdk = SendbirdChat | undefined;
type GetConnect = (
  userId: string,
  accessToken?: string
) => Promise<User>;
type GetDisconnect = () => Promise<void>;
type GetUpdateUserInfo = (
  nickName: string,
  profileUrl?: string
) => Promise<User>;
type GetCreateGroupChannel = (channelParams: GroupChannelCreateParams) => Promise<GroupChannel>;
type GetCreateOpenChannel = (channelParams: OpenChannelCreateParams) => Promise<OpenChannel>;
type GetGetGroupChannel = (
  channelUrl: string,
  isSelected?: boolean,
) => Promise<GroupChannel>;
type GetGetOpenChannel = (
  channelUrl: string,
) => Promise<OpenChannel>;
type GetLeaveGroupChannel = (channel: GroupChannel) => Promise<void>;
type GetEnterOpenChannel = (channel: OpenChannel) => Promise<OpenChannel>;
type GetExitOpenChannel = (channel: OpenChannel) => Promise<void>;
type GetFreezeChannel = (channel: GroupChannel | OpenChannel) => Promise<void>;
type GetUnFreezeChannel = (channel: GroupChannel | OpenChannel) => Promise<void>;
type GetSendUserMessage = (
  channel: GroupChannel | OpenChannel,
  userMessageParams: UserMessageCreateParams,
) => UikitMessageHandler;
type GetSendFileMessage = (
  channel: GroupChannel | OpenChannel,
  fileMessageParams: FileMessageCreateParams
) => UikitMessageHandler;
type GetUpdateUserMessage = (
  channel: GroupChannel | OpenChannel,
  messageId: string | number,
  params: UserMessageUpdateParams
) => Promise<UserMessage>;
// type getUpdateFileMessage = (
//   channel: GroupChannel | OpenChannel,
//   messageId: string | number,
//   params: FileMessageUpdateParams,
// ) => Promise<FileMessage>;
type GetDeleteMessage = (
  channel: GroupChannel | OpenChannel,
  message: CoreMessageType
) => Promise<void>;
type GetResendUserMessage = (
  channel: GroupChannel | OpenChannel,
  failedMessage: UserMessage
) => Promise<UserMessage>;
type GetResendFileMessage = (
  channel: GroupChannel | OpenChannel,
  failedMessage: FileMessage
) => Promise<FileMessage>;

export interface sendbirdSelectorsInterface {
  getSdk: (store: SendBirdState) => GetSdk;
  getConnect: (store: SendBirdState) => GetConnect
  getDisconnect: (store: SendBirdState) => GetDisconnect;
  getUpdateUserInfo: (store: SendBirdState) => GetUpdateUserInfo;
  getCreateGroupChannel: (store: SendBirdState) => GetCreateGroupChannel;
  getCreateOpenChannel: (store: SendBirdState) => GetCreateOpenChannel;
  getGetGroupChannel: (store: SendBirdState) => GetGetGroupChannel;
  getGetOpenChannel: (store: SendBirdState) => GetGetOpenChannel;
  getLeaveGroupChannel: (store: SendBirdState) => GetLeaveGroupChannel;
  getEnterOpenChannel: (store: SendBirdState) => GetEnterOpenChannel;
  getExitOpenChannel: (store: SendBirdState) => GetExitOpenChannel;
  getFreezeChannel: (store: SendBirdState) => GetFreezeChannel;
  getUnFreezeChannel: (store: SendBirdState) => GetUnFreezeChannel;
  getSendUserMessage: (store: SendBirdState) => GetSendUserMessage;
  getSendFileMessage: (store: SendBirdState) => GetSendFileMessage;
  getUpdateUserMessage: (store: SendBirdState) => GetUpdateUserMessage;
  // getUpdateFileMessage: (store: SendBirdState) => GetUpdateFileMessage;
  getDeleteMessage: (store: SendBirdState) => GetDeleteMessage;
  getResendUserMessage: (store: SendBirdState) => GetResendUserMessage;
  getResendFileMessage: (store: SendBirdState) => GetResendFileMessage;
}

export interface CommonUIKitConfigProps {
  replyType?: 'NONE' | 'QUOTE_REPLY' | 'THREAD';
  isMentionEnabled?: boolean;
  isReactionEnabled?: boolean;
  disableUserProfile?: boolean;
  isVoiceMessageEnabled?: boolean;
  isTypingIndicatorEnabledOnChannelList?: boolean;
  isMessageReceiptStatusEnabledOnChannelList?: boolean;
  showSearchIcon?: boolean;
}

export type UIKitOptions = PartialDeep<{
  common: SBUConfig['common'];
  groupChannel: SBUConfig['groupChannel']['channel'];
  groupChannelList: SBUConfig['groupChannel']['channelList'];
  groupChannelSettings: SBUConfig['groupChannel']['setting'];
  openChannel: SBUConfig['openChannel']['channel'];
}>;

export type SendbirdChatInitParams = Omit<SendbirdChatParams<Module[]>, 'appId'>;
export type CustomExtensionParams = Record<string, string>;

export type SendbirdProviderUtils = {
  updateMessageTemplatesInfo: (templateKey: string, createdAt: number) => Promise<void>;
  getCachedTemplate: (key: string) => ProcessedMessageTemplate | null;
};
