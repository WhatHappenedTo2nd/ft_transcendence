import { useQuery } from 'react-query'
import { getChatList } from '../../api/api';
import ChatListProps from '../interface/IChatListProps'
import ChatListItem from './ChatListItem';

function ChattingRoom(){
	const { isLoading: amILoading , data: ChatList, error: amIError } = useQuery<ChatListProps[]>('chat', getChatList, {refetchInterval: 1000});
	if (amILoading) return <h1>Loading</h1>;
	if (amIError) return <div>Error</div>;

	return (
		<div>
			{ChatList?.map((chat) => {
				return (<ChatListItem key={chat.id} chat={chat} />);
			})}
		</div>
	);
}

export default ChattingRoom;
