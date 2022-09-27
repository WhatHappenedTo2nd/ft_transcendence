import { Box, Avatar, AvatarBadge, Container } from '@chakra-ui/react'

export enum Status {
	PLAYING = 'PLAYING',
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE',
}

function FriendItem(props: any) {
	const { user } = props;

	return (
		<Container key={user?.id} display='flex'>
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
		</Container>
	)
};

export default FriendItem;