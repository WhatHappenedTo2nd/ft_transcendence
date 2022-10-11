import React from "react";
import { Link } from "react-router-dom";
import useBlocked from "../../../hooks/useBlocked";
import useFriends from "../../../hooks/useFriend";
import { TargetUserProvider } from "../../../hooks/useTargetUser";
import { MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { ContextMenu } from "./ContextMenu";
import styled from "styled-components";
import AddFriendMenu from "./UI/AddFriendMenu";
import BlockMenu from "./UI/BlockMenu";
import RemoveFriendMenu from "./UI/RemoveFriendMenu";
import MuteMenu from "./UI/MuteMenu";
import HostApproveMenu from "./UI/HostApproveMenu";
import GameSpectactorMenu from "./UI/GameSpectactorMenu";
import KickMenu from "./UI/KickMenu";
import GameInviteMenu from "./UI/GameInviteMenu";

export type UserContextMenuType = 'friend' | 'chat' | 'online';

const ChildView = styled.div`
  width: 100%;
`;

function UserContextMenuItem({
	flag,
	children,
  }: {
	flag: UserContextMenuFlag;
	children: JSX.Element;
  }) {
	const currentFlag = React.useContext(flagContext);
	return currentFlag & flag ? children : null;
}

const flagContext = React.createContext<UserContextMenuFlag>(0);

enum UserContextMenuFlag {
	PROFILE = 1 << 0, // 프로필
	FRIEND_ADD = 1 << 1, // 친구 추가
	FRIEND_REMOVE = 1 << 2, // 친구 해제
	BLOCK_ADD = 1 << 3, // 블락
	BLOCK_REMOVE = 1 << 4, // 블락 해제
	GAME_INVITE = 1 << 5, // 게임초대
	GAME_SPECTACTOR = 1 << 6, // 게임 관전
	CHAT_KICK = 1 << 7, // 채팅에서 내쫒기, mode가 host일 때
	CHAT_MUTE = 1 << 8, // 채팅에서 뮤트 시키기
	CHAT_UNMUTE = 1 << 9, // 채팅에서 뮤트 해제
	ADMIN_APPROVE = 1 << 10, // 관리자 이전

	FRIEND = FRIEND_ADD | FRIEND_REMOVE | BLOCK_ADD | BLOCK_REMOVE,
	GAME = GAME_INVITE | GAME_SPECTACTOR,
	CHAT = CHAT_KICK |
	  CHAT_MUTE |
	  CHAT_UNMUTE |
	  ADMIN_APPROVE,
  }

export default function UserContextMenu({
	userId, // target User
	name, // target User name
	mode, // 현재 우클릭하는 창의 상태 (online 유저 띄우는 창, 친구창, 방 접속인원 창)
	game, // target now game
	muted,
	myrole, // my role (host or member)
	children,
}: {
	userId: number; // target user의 id
	name: string; // target의 nickname
	muted?: boolean; // target의 mute 상태
	game?: boolean;
	mode: UserContextMenuType;
	myrole?: boolean;
	children: React.ReactNode;
}) {
	const friends = useFriends();
	const blocks = useBlocked();
	const menuFlag = React.useMemo(() => {
		let flag = UserContextMenuFlag.PROFILE;
		const isFriend = friends?.filter((f) => f.id === userId).length;
		const isBlocked = blocks?.filter((b) => b.id === userId).length;
		if (mode === 'chat') {
			flag |= UserContextMenuFlag.GAME_INVITE;
			if (myrole === true) {
				flag |= UserContextMenuFlag.ADMIN_APPROVE;
				flag |= UserContextMenuFlag.CHAT_KICK;
				if (muted === true) {
					flag |= UserContextMenuFlag.CHAT_UNMUTE;
				} else {
					flag |= UserContextMenuFlag.CHAT_MUTE;
				}
			}
		}
		if (!isFriend) {
			flag |= UserContextMenuFlag.FRIEND_ADD;
		} else {
			flag |= UserContextMenuFlag.FRIEND_REMOVE;
			if (game) {
				flag |= UserContextMenuFlag.GAME_SPECTACTOR;
			}
		}
		if (isBlocked) {
			flag |= UserContextMenuFlag.BLOCK_REMOVE;
		} else {
			flag |= UserContextMenuFlag.BLOCK_ADD;
		}
		return flag;
	}, [friends, blocks, mode, muted, myrole, userId])

	return (
		<flagContext.Provider value={menuFlag}>
			<TargetUserProvider userId={userId} userName={name}>
				<ContextMenu
				renderMenu={() => (
					<MenuList>
						<UserContextMenuItem flag={UserContextMenuFlag.PROFILE}>
							<Link to={`profile/${name}`}>
								<MenuItem>정보 보기</MenuItem>
							</Link>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.FRIEND}>
							<MenuDivider />
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.FRIEND_ADD}>
							<AddFriendMenu
							label="친구추가"
							target={name}/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.FRIEND_REMOVE}>
							<RemoveFriendMenu
							label="친구해제"
							target={name}/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.BLOCK_ADD}>
							<BlockMenu
							label="차단하기"
							target={name}/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.BLOCK_REMOVE}>
							<BlockMenu
							label="차단해제"
							target={name}/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.GAME}>
							<MenuDivider />
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.GAME_INVITE}>
							{/* <MenuItem>게임 초대하기</MenuItem> */}
							<GameInviteMenu
							label="게임 초대하기"
							target={name}
							/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.GAME_SPECTACTOR}>
							<GameSpectactorMenu
							label="게임 관전하기"
							target={name}
							/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT}>
							<MenuDivider />
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT_KICK}>
						<KickMenu
							label="추방 하기"
							target={name}
							/>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT_MUTE}>
							<MuteMenu
							label="음소거"
							target={name} />
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT_UNMUTE}>
							<MuteMenu
							label="음소거 해제"
							target={name} />
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.ADMIN_APPROVE}>
							<HostApproveMenu
							label="운영자 임명"
							target={name} />
						</UserContextMenuItem>
					</MenuList>
				)}
				>
					{(ref: any) => (
						<ChildView style={{cursor: 'pointer'}} ref={ref}>
							{children}
						</ChildView>
					)}
				</ContextMenu>
			</TargetUserProvider>
		</flagContext.Provider>
	);
}

UserContextMenu.defaultProps = {
	muted: false,
	game: false,
}
