import { Container } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Chatting from "../chatting/Chatting";
import Game from "../game/Game";

/**
 * 유저가 접속한 채팅방. 게임과 채팅을 할 수 있는 방
 * @returns
 */

const MainWrapper = styled.div`
  margin-left: max(230px, 15vw);
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
`
const GameBox = styled.div`
	height: 400px;
	box-sizing: border-box;
	width: 50%;
	padding: 5px;
	background: black;
	margin: 0 auto;
`
function GamePage() {
	return (
		<MainWrapper>
			<GameBox>
				<Game />
			</GameBox>
			<Chatting />
		</MainWrapper>
	)
}
export default GamePage;
