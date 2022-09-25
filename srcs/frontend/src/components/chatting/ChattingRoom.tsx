import { useQuery } from 'react-query'
import { getChatList } from '../../api/api';
import ChatListProps from '../interface/ChatListProps'
import ChatListItem from './ChatListItem';

function ChattingRoom(props: { onClick: any; }){
	const { status , data: ChatList, error } = useQuery<ChatListProps[]>('chat', getChatList);
	if (status === "loading") return <h1>Loading</h1>;
	if (status === "error") return <div>Error</div>;

	return (
		<div>
			{ChatList?.map((chat) => {
				return (<ChatListItem key={chat.id} chat={chat} />);
			})}
		</div>
	);
}

export default ChattingRoom;
