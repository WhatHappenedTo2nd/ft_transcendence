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

export type UserContextMenuType = 'friend' | 'chat';

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
	GAME_INVITE = 1 << 5, // 게임초대(채팅초대)
	CHAT_KICK = 1 << 6, // 채팅에서 내쫒기, mode가 host일 때
	CHAT_MUTE = 1 << 7, // 채팅에서 뮤트 시키기
	CHAT_UNMUTE = 1 << 8, // 채팅에서 뮤트 해제
	ADMIN_APPROVE = 1 << 9, // 관리자 추가
	ADMIN_UNAPPROVE = 1 << 10, // 관리자 해제
  
	FRIEND = FRIEND_ADD | BLOCK_ADD | BLOCK_REMOVE,
	GAME = GAME_INVITE,
	CHAT = CHAT_KICK |
	  CHAT_MUTE |
	  CHAT_UNMUTE |
	  ADMIN_APPROVE |
	  ADMIN_UNAPPROVE,
  }

export default function UserContextMenu({
	userId, // target User
	name,
	// role,
	muted,
	mode,
	children,
	// me,
}: {
	userId: number; // target user의 id
	name: string; // target의 nickname
	// role?: ChatMemberRole // 채팅방 들어갔을 때 유저의 모드
	muted?: boolean;
	mode: UserContextMenuType;
	children: React.ReactNode;
	// me?: ChatMemberProps | undefined;
}) {
	const friends = useFriends();
	const blocks = useBlocked();
	const menuFlag = React.useMemo(() => {
		let flag = UserContextMenuFlag.PROFILE;
		const isFriend = friends?.filter((f) => f.id === userId).length;
		const isBlocked = blocks?.filter((b) => b.id === userId).length;
		if (mode === 'friend') {
			flag |= UserContextMenuFlag.FRIEND_REMOVE;
			return flag;
		}
		// if (mode === 'chat') {
		// 	if (me?)
		// }
		if (!isFriend) {
			flag |= UserContextMenuFlag.FRIEND_ADD;
		} else {
			flag |= UserContextMenuFlag.FRIEND_REMOVE;
		}
		if (isBlocked) {
			flag |= UserContextMenuFlag.BLOCK_REMOVE;
		} else {
			flag |= UserContextMenuFlag.BLOCK_ADD;
		}
		//친구 상태에 따라 게임 초대와 관전 코드 넣어줘야함
		return flag;
	}, [friends, blocks, mode, userId])

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
							<MenuItem>게임 초대하기</MenuItem>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT}>
							<MenuDivider />
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT_KICK}>
							<MenuItem>추방하기</MenuItem>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT_MUTE}>
							<MenuItem>음소거하기</MenuItem>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.CHAT_UNMUTE}>
							<MenuItem>음소거 해제하기</MenuItem>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.ADMIN_APPROVE}>
							<MenuItem>관리자 임명하기</MenuItem>
						</UserContextMenuItem>
						<UserContextMenuItem flag={UserContextMenuFlag.ADMIN_UNAPPROVE}>
							<MenuItem>관리자 해제하기</MenuItem>
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
	// me: undefined,
}