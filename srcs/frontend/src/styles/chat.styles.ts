import styled from '@emotion/styled';

const ChatName = styled.div`
	display: inline-block;
	color: black;
	font-size: 1em;
	margin: 0 30px;
	padding: 0.25em 1em;
	border: 2px solid #53B7BA;
	border-radius: 3px;
	display: block;
	width:400px;
	text-align: center;
`;

const LeaveButton = styled.button`
	display: block;
	margin: 0 2em;
	color: #53B7BA;
	styld: bold;
`;

const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid #bec3c9;
	padding: 1rem;
	margin: 0 30px;
	width: 400px;
	min-height: 600px;
	max-height: 600px;
	overflow: auto;

	background: #ebedf0;
`;

const MessageBox = styled.div`
	display: flex;
	flex-direction: column;

	&.my_message {
		align-self: flex-end;

		.message {
			background: #53B7BA;
			align-self: flex-end;
		}
	}

	&.alarm {
		align-self: center;
	}
`;

const Message = styled.span`
	margin-bottom: 0.5rem;
	border: solid 2px #53B7BA;
	background: #fff;
	width: fit-content;
	padding: 12px;
	border-radius: 0.5rem;
`;

const MessageForm = styled.form`
	display: flex;
	margin-top: 24px;
	color: #53B7BA;

	input {
		flex-grow: 1;
		margin-right: 1rem;
		border: solid 1px #bec3c9;
	}
`;

export { ChatName, LeaveButton, ChatContainer, MessageBox, Message, MessageForm };
