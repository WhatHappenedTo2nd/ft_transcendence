import { Container } from "@chakra-ui/react";
import Chatting from "../chatting/Chatting";
import Game from "../game/Game";

/**
 * 유저가 접속한 채팅방. 게임과 채팅을 할 수 있는 방
 * @returns
 */
function GamePage() {
	return (
		<Container>
			<div>
				<Game />
				<Chatting />
			</div>
		</Container>
	)
}

export default GamePage;
