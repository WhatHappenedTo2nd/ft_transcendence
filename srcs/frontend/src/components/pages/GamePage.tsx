import { Container } from "@chakra-ui/react";
import Comment from "../chatting/Comment";
import CommentBox from "../chatting/CommentBox";

/**
 * 유저가 접속한 채팅방. 게임과 채팅을 할 수 있는 방
 * @returns 
 */
function GamePage() {
	return (
		<Container>
			<Comment avatar="../../img/jkeum.png" name="jkeum" text="스겜스겜" />
			<Comment avatar="../../img/inyang.jpeg" name="inyang" text="아무나 이겨라" />
			<CommentBox avatar="../../img/jkeum.png" name="jkeum" />
		</Container>
	)
}

export default GamePage;