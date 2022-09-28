import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
	ChatContainer,
	LeaveButton,
	Message,
	MessageBox,
	MessageForm,
  } from '../../styles/chat.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { getLoginUserData } from '../../api/api';
import { useQuery } from 'react-query';
import { socket } from '../../App';
import IUserProps from '../interface/IUserProps';
import IChat from '../interface/IChatProps';

/**
 * io의 첫 번째 인자는 서버로 연결할 주소
 * 두 번째 인자에 쿠키를 보낼 때 설정해야 하는 credentials와 같은 옵션들을 설정할 수 있다.
 * /api/chat은 namespace로, 일종의 통신 채널이다. 서로 다른 namespace에 있는 소켓들은 서로 다른 통신 채널에 있게 된다.
**/

function Chatting(props: any) {
	const [chats, setChats] = useState<IChat[]>([]);
	const { isLoading: amILoading, data: Mydata, error: amIError } = useQuery<IUserProps>('me', getLoginUserData);
	const [message, setMessage] = useState<string>('');
	const [name, setNickname] = useState<string>('');
	const chatContainerEl = useRef<HTMLDivElement>(null);
	
	const { roomName } = useParams<'roomName'>();
	const navigate = useNavigate();
	
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
			socket.emit('message', { roomName, message, name }, (chat: IChat) => {
				setChats((prevChats) => [...prevChats, chat]);
				setMessage('');
			});
		}, [message, roomName]
	);
		
	const onLeaveRoom = useCallback(() => {
		socket.emit('leave-room', { roomName, name }, () => {
			navigate('/waiting');
		});
	}, [navigate, roomName]);

	return (
		<>
		<h1>Chat Room: {roomName}</h1>
		<LeaveButton onClick={onLeaveRoom}>방 나가기</LeaveButton>
		<ChatContainer ref={chatContainerEl}>
			{chats.map((chat, index) => (
				<MessageBox
					key={index}
					className={classNames({
						my_message: socket.id === chat.socket_id,
						alarm: !chat.name,
					})}
				>
				<span>
					{chat.name
					? socket.id === chat.socket_id
						? ''
						: chat.name
					: ''}
				</span>
				<Message className="message">{chat.message}</Message>
				</MessageBox>
			))}
		</ChatContainer>
		<MessageForm onSubmit={onSendMessage}>
			<input type="text" onChange={onChange} value={message} />
			<button>보내기</button>
		</MessageForm>
		</>
	);

}

export default Chatting;
