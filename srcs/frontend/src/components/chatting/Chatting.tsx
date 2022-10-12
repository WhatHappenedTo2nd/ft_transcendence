import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
	ChatRoomName,
	ChatName,
	ChatContainer,
	LeaveButton,
	Message,
	MessageBox,
	MessageForm,
  } from '../../styles/chat.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { getLoginUserData, getWhereAreYou } from '../../api/api';
import { useQuery, useQueryClient } from 'react-query';
import { socket } from '../../App';
import IUserProps from '../interface/IUserProps';
import IChat from '../interface/IChatProps';
import UserContextMenu from '../sidebar/contextmenu/UserContextmenu';
import { getCookie } from '../../api/cookieFunc';
import IChatListProps from '../interface/IChatListProps';
import { history } from "../../hooks/useHistory";
import ICreateRoomResponse from '../interface/IChatProps';

/**
 * io의 첫 번째 인자는 서버로 연결할 주소
 * 두 번째 인자에 쿠키를 보낼 때 설정해야 하는 credentials와 같은 옵션들을 설정할 수 있다.
 * /api/chat은 namespace로, 일종의 통신 채널이다. 서로 다른 namespace에 있는 소켓들은 서로 다른 통신 채널에 있게 된다.
**/

function Chatting(props: any) {
	const queryClient = useQueryClient();
	const [chats, setChats] = useState<IChat[]>([]);
	const { data: Mydata } = useQuery<IUserProps>('me', getLoginUserData);
	const { isLoading: titleLoading, data: chat } = useQuery<IChatListProps>(['findroom', Mydata?.nickname], () => getWhereAreYou(Mydata?.nickname));
	const [message, setMessage] = useState<string>('');
	const [roomName, setRoomName] = useState<string>((chat ? chat.title : ''));
	const [name, setNickname] = useState<string>('');
	const chatContainerEl = useRef<HTMLDivElement>(null);

	const roomId = Number(useParams<'roomName'>().roomName);
	const navigate = useNavigate();

	useEffect(() => {
		const unlistenHistoryEvent = history.listen(({ action }) => {
			if (action === "POP") {
				onLeaveRoom();
			}
		});

		return unlistenHistoryEvent;
	}, []);


	useEffect(() => {
		socket.emit('save-socket', { userIntraId: getCookie("intra_id") });
	}, [socket]);

	// useEffect(() => {
	// 	socket.on('edit-room', (response: ICreateRoomResponse) => {
	// 		if (response.success)
	// 			setRoomName(response.payload);
	// 	});
	// }, [setRoomName, socket])

	// 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
	useEffect(() => {
		if (!chatContainerEl.current) return;

		const chatContainer = chatContainerEl.current;
		const { scrollHeight, clientHeight } = chatContainer;

		if (scrollHeight > clientHeight) {
			chatContainer.scrollTop = scrollHeight - clientHeight;
		}
	}, [chats.length]);

	// message event listener
	useEffect(() => {
		const messageHandler = (chat: IChat) => setChats((prevChats) => [...prevChats, chat]);

		socket.on('message', messageHandler);

		return () => {
			socket.off('message', messageHandler);
		};
	}, []);

	useEffect(() => {
		socket.on('kick-room', () => {
			navigate('/chatting');
		});
	})

	useEffect(() => {
		socket.on('invite-room-end', (response: ICreateRoomResponse) => {
			navigate(`/room/${response.payload}`);
		});
	})

	useEffect(() => {
		const roomNameHandler = (name: string) => setRoomName(name);
		socket.on('edit-room', roomNameHandler);

		return () => {
			socket.off('edit-room', roomNameHandler);
		}
	}, [])

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (Mydata?.nickname) setNickname(Mydata.nickname);
		setMessage(e.target.value);
	}, []);

	/**
	 * socket.io는 이벤트 기반으로 동작한다.
	 * 채팅방에서 누군가가 메시지를 보내면 서버에서는 받은 메시지를 채팅방으로 보내줄 것이다.
	 * 서버에서 메시지를 받으면 message 이벤트를 발생시켜 그 메시지를 채팅방으로 보내준다.
	 */
	/**
	 * `useCallback()`은 두 번째 인자로 들어오는 의존성 배열에 있는 특정 값이 변경될 때
	 * 새로 작성할 함수를 첫 번째 인자로 넣어서 렌더링이 될 때마다 함수가 새로 정의됨.
	 */
	const onSendMessage = useCallback(
		(e: FormEvent<HTMLFormElement>) => {
			// preventDefault()로 가지고 있는 기본 동작을 방지함.
			e.preventDefault();
			if (!message) return alert('메시지를 입력해 주세요.');

			if (Mydata?.nickname) setNickname(Mydata.nickname);

			// socket.emit()에서 첫 번째 인자에는 이벤트 이름을, 두 번째 인자에는 전송할 데이터를,
			// 세 번째 인자에는 콜백 함수로 서버에서 응답이 오면 실행할 함수를 넣어준다. 콜백 함수의 인자로는 서버에서 보내준 데이터가 들어온다.
			socket.emit('message', { roomId, roomName, message, name, userIntraId: getCookie("intra_id") }, (chat: IChat) => {
				setChats((prevChats) => [...prevChats, chat]);
				setMessage('');
			});
		}, [message, roomId, roomName]
	);

	const onLeaveRoom = useCallback(() => {
		socket.emit('leave-room', { roomId, roomName, userIntraId: getCookie("intra_id") }, () => {
			navigate('/chatting');
		});
		queryClient.invalidateQueries('roomuser');
	}, [navigate, roomId, roomName]);

	if ( titleLoading ) return <h1>Loading...</h1>;
	return (
		<div>
			<ChatRoomName>
				<ChatName>{chat?.title}</ChatName>
				<LeaveButton onClick={onLeaveRoom}>방 나가기</LeaveButton>
			</ChatRoomName>
			<ChatContainer ref={chatContainerEl}>
				{chats.map((chat, index) => (
					<MessageBox
						key={index}
						className={classNames({
							my_message: socket.id === chat.socket_id,
							alarm: !chat.name,
						})}
					>
					<UserContextMenu
					userId={chat.id}
					name={chat.name}
					mode='chat'
					>
						{chat.name
						? socket.id === chat.socket_id
							? ''
							: chat.name
						: ''}
					</UserContextMenu>
					<Message className="message">{chat.message}</Message>
					</MessageBox>
				))}
			</ChatContainer>
			<MessageForm onSubmit={onSendMessage}>
				<input type="text" onChange={onChange} value={message} />
				<button>보내기</button>
			</MessageForm>
		</div>
	);

}

export default Chatting;

/**
 * 2022/10/10
 * 채방방 css 수정
 */
