import { Box, Avatar, AvatarBadge, Container } from '@chakra-ui/react'
import React, { useState } from 'react';

export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

function FriendItem(props: any) {
	const { user } = props;

	const [isShown, setIsShown] = useState(false);
	const [position, setPosition] = useState({x: 0, y: 0});

	const showContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();

		setIsShown(false);
		const newPosition = {
		  x: event.pageX,
		  y: event.pageY,
		};

		setPosition(newPosition);
		setIsShown(true);
	};

	const hideContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
		setIsShown(false);
	};

	return(
		<Container key={user?.id} display='flex'
			onContextMenu={showContextMenu}
			onClick={hideContextMenu}>
				<Box boxSize='10' justifyContent='center'>
					<Avatar size='sm' src={user?.avatar}>
						{user.status === Status.PLAYING ? <AvatarBadge boxSize='1em' bg='yellow.500' /> : null}
						{user.status === Status.ONLINE ? <AvatarBadge boxSize='1em' bg='green.500' /> : null}
						{user.status === Status.OFFLINE ? <AvatarBadge boxSize='1em' bg='grey' /> : null }
					</Avatar>
				</Box>
				<Box justifyContent='flex-end'>
					<span>{user.nickname}</span>
				</Box>
				{isShown && (
					<div
					style={{ top: position.y, left: position.x }}
					className="custom-context-menu"
					>
					<div className="option">
						친구 삭제
					</div>
					<div className="option">
						차단 하기
					</div>
					<div className="option">
						게임 신청
					</div>
					</div>
				)}
			</Container>
	)
};

export default FriendItem;
