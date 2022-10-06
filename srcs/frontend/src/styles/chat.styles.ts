import styled from '@emotion/styled';

const LeaveButton = styled.button`
	margin-bottom: 0.5rem;
	display: block;
	margin-left: auto;
	color: #53B7BA;
	styld: bold;
`;

const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid #bec3c9;
	padding: 1rem;

	min-height: 360px;
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

export { LeaveButton, ChatContainer, MessageBox, Message, MessageForm };