import { Route, Routes } from "react-router-dom";
import WaitingRoom from "../chatting/WaitingRoom";
import UserProfile from "../mypage/UserProfile";
import SideBar from "../sidebar/SideBar";
import ChattingRoomPage from "./ChattingRoomPage";
import ChoicePage from "./ChoicePage";
import GamePage from "./GamePage";
import MyPage from './/MyProfilePage';

export default function HomePage() {
	return (
		<>
		<SideBar />
		<Routes>
		<Route path="/home" element={<ChoicePage />} />
			<Route path="profile" element={<MyPage />} />
				<Route path=":nickname" element={<UserProfile />} />
			<Route path="chattingroom" element={<ChattingRoomPage />} />
			<Route path="room/:roomName" element={<GamePage />} />
			<Route path="game" element={<GamePage />} />
			<Route path="waiting" element={<WaitingRoom />} />
		</Routes>
		</>
	);
}