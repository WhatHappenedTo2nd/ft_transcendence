import { Box, Avatar, AvatarBadge, HStack } from '@chakra-ui/react'
import UserContextMenu from './contextmenu/UserContextmenu';


export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

function FriendItem(props: any) {
	const { user } = props;

	return (
		<UserContextMenu
		userId={user.id}
		name={user.nickname}
		mode='friend'>
		<HStack>
			<Box boxSize='10' justifyContent='center' marginStart="2" marginTop="0.5" padding="1" >
				<Avatar size='sm' src={user?.avatar}>
					{user.status === Status.PLAYING ? <AvatarBadge boxSize='1em' bg='yellow.500' /> : null}
					{user.status === Status.ONLINE ? <AvatarBadge boxSize='1em' bg='green.500' /> : null}
					{user.status === Status.OFFLINE ? <AvatarBadge boxSize='1em' bg='grey' /> : null }
				</Avatar>
			</Box>
			<Box justifyContent='flex-end'>
				<span>{user.nickname}</span>
			</Box>
		</HStack>
		</UserContextMenu>
	)
};

export default FriendItem;