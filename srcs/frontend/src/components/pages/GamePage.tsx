import { Container } from "@chakra-ui/react";
import Chatting from "../chatting/Chatting";
import Comment from "../chatting/Comment";
import CommentBox from "../chatting/CommentBox";

/**
 * 유저가 접속한 채팅방. 게임과 채팅을 할 수 있는 방
 * @returns 
 */
function GamePage() {
	return (
		<Container>
			<Chatting />
		</Container>
	)
}

export default GamePage;