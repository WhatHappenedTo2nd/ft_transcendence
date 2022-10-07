import { Box, Avatar, AvatarBadge, HStack } from '@chakra-ui/react'
import UserContextMenu from './contextmenu/UserContextmenu';

function UserItem(props: any) {
	const { user, mode, myrole, muted } = props;
	return (
		<UserContextMenu
		userId={user.id}
		name={user.nickname}
		mode={mode}
		myrole={myrole}
		muted={muted}>
			<HStack>
			<Box boxSize='10' justifyContent='center' marginStart="2" marginTop="0.5" padding="1" >
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