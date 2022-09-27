import { Box, Avatar, AvatarBadge, Container } from '@chakra-ui/react'

function UserItem(props: any) {
	const { user } = props;

	return (
		<Container key={user?.id} display='flex'>
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
		</Container>
	);
}

export default UserItem;