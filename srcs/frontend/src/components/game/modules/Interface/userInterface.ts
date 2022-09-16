import React from 'react';
import { Socket } from 'socket.io-client';

export default interface IUserData {
    id: number;
    username: string;
    email: string;
    nickname: string;
    photo: string;
    tfa: boolean;
    tfaCode: boolean;
    wins: number;
    losses: number;
    ratio: number;
    isBlocked: boolean;
    isFriend: boolean;
    isOnline: boolean;
    isRequset: boolean;
    isPlaying: boolean;
    roomId: string;
    achievment: number;
    createdAt: string;
    upadateAt: string;
}

export interface IUserList {
    id: number;
    nickname: string;
    photo: string;
    isOnline: boolean;
}

export interface IListSytle {
    user: IUserData;
    children: React.ReactNode;
}

export interface IUserInfo {
    user: IUserData;
}
