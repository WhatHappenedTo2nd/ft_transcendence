import { Box, Avatar, AvatarBadge, HStack } from '@chakra-ui/react'
import UserContextMenu from './contextmenu/UserContextmenu';

function UserItem(props: any) {
	const { user, mode } = props;
	return (
		<UserContextMenu
		userId={user.id}
		name={user.nickname}
		mode={mode}
		>
			<HStack>
			<Box boxSize='10' justifyContent='center' alignItems="center" marginStart="2" marginTop="0.5" padding="1" >
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