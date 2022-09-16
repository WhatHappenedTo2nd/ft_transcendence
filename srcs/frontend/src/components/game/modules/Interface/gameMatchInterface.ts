/**
 * 레퍼런스 코드에서 match history에서 사용
 */
import IUser, { IUserList } from './userInterface';

export interface IMatch
{
    id: number;
    winner: IUser;
    loser: IUser;
}
