import { Box, Text } from '@chakra-ui/react';
import { useQuery } from 'react-query'
import { getChatList } from '../../api/api';
import { UnlockIcon, LockIcon } from '@chakra-ui/icons'

interface ChatListProps {
		id: number;
		title: string;
		passward: string;
		is_private: boolean;
		host: number;
		now_playing: boolean;
}

function ChattingRoom(props: { onClick: any; }){
	const { status , data: ChatList, error } = useQuery<ChatListProps[]>('chat', getChatList);
	if (status === "loading") return <h1>Loading</h1>;
	if (status === "error") return <div>Error</div>;

	return (
		<div>
			{ChatList?.map((chat) => {
				return(
					<Box p='4' display='flex' flex-basis={"auto"} alignItems='baseline'
					style={{border: '1px solid black',borderRadius: '5px'}}
					mx='4' my='4' width='100wh' key={chat.id}>
						{chat.is_private ? <LockIcon/> : <UnlockIcon/>}
						<Text text-align="center" paddingX="2">
							{chat.title}
						</Text>
					</Box>
				);
			})}
		</div>
	);
}

export default ChattingRoom;
