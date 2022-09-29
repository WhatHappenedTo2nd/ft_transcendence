import { Box, Avatar, AvatarBadge, HStack } from '@chakra-ui/react'
import UserContextMenu from './contextmenu/UserContextmenu';

function UserItem(props: any) {
	const { user } = props;

	return (
		<UserContextMenu
		userId={user.id}
		name={user.nickname}
		mode='chat'>
			<HStack>
			<Box boxSize='10' justifyContent='center'>
				<Avatar size='sm' src={user?.avatar}>
					{user.now_playing 
					? <AvatarBadge boxSize='1em' bg='yellow.500' /> 
					: <AvatarBadge boxSize='1em' bg='green.500' />}
				</Avatar>
			</Box>
			<Box justifyContent='flex-end'>
				<span>{user?.nickname}</span>
			</Box>
		</HStack>
		</UserContextMenu>
	);
}

export default UserItem;