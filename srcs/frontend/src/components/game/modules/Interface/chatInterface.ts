/**
 * 참고한 레퍼런스의 데이터 인터페이스 구조입니다.
 * 그대로 사용하지않고
 */
import { StringLiteral } from 'typescript';
<<<<<<< HEAD
import { IUser } from '../..//GameInterface';
=======
import { IUser } from '../../GameInterface';
>>>>>>> c1b15d29be89ebf77d86a10996c3783411bbf8c4
import IUserData from './userInterface'

export interface IChatUser
{
    func: string;
    code: number;
    message: string;
    data: IUserData[];
}

export interface IRoomStatus
{
    func: string;
    code: number;
    message: string;
    data: IDMRoom;
}

export interface IDM
{
    func: string;
    code: number;
    message: string;
    data: {
        content: string;
        DM: {
            id: number;
        };
        author: IUserData;
        id: number;
        createdAt: string;
    };
}

export interface IChannleDeletedResponse
{
    func: string;
    code: number;
    message: string;
    data: {
        deleteChannelId: number;
    };
}

export interface IMessages
{
    id: number;
    content: string;
    createdAt: string;
    author: IUserData;
    type: string;
    roomId: string;
}

export interface IChannelMessage
{
    id: number;
    content: string;
    createAt: string;
    author: IUserData;
    channelId: number;
}

export interface IChannelMessageResponse
{
    func: string;
    code: number;
    message: string;
    data: IChannelMessage;
}

export interface IMessageResponse
{
    func: string;
    code: number;
    message: string;
    data: IMessages;
}

export interface IDMRoomInfo
{
    func: string;
    code: number;
    message: string;
    data: {
        id: number;
        createdAt: string;
        users: IUserData[];
        message: IMessages[];
    };
}

export interface IFriendsList
{
    func: string;
    code: number;
    message: string;
    data: {
        friendRequest: IUserData[];
        friends: IUserData[];
    };
}

export interface IMyData
{
    id: number;
    username: string;
    email: string;
    nickname: string;
    photo: string;
    tfa: boolean;
    tfaCode: boolean;
    isFriend: boolean;
    isOnline: boolean;
    wins: number;
    losses: number;
    ratio: number;
    achievement: number;
    createdAt: string;
    updatedAt: string;
    friendsRequest: IUserData[];
    friends: IUserData[];
    blockedUsers: IUserData[];
}

export interface IMyDataResponse
{
    func: string;
    code: number;
    message: string;
    data: IMyData;
}

export interface IErr
{
    code: number;
    data?: any;
    message: string;
}

export interface IChannel
{
    id: number;
    name: string;
    privacy: string;
    restrictionDuration: number;
    createdAt: string;
    owner: IUserData;
    users: IUserData[];
    admins: IUserData[];
    messages: IMessages[]
}

export interface IChannelResponse
{
    func: string;
    code: number;
    message: string;
    data: IChannel;
    author: IUserData;
}

export interface IDMRoom
{
    id: number;
    createAt: string;
    me: IUserData;
    another: IUserData;
    message: IMessages[];
}

export interface IDMRoomList
{
    func: string;
    code: number;
    message: string;
    data: IDMRoom[];
}

export interface IUserBanned
{
    func: string;
    code: number;
    message: string;
    data: IUserData;
}
