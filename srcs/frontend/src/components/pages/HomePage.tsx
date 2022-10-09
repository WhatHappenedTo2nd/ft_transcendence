import { Route, Routes } from "react-router-dom";
import WaitingRoom from "../chatting/WaitingRoom";
import UserProfile from "../mypage/UserProfile";
import SideBar from "../sidebar/SideBar";
import ChattingRoomPage from "./ChattingRoomPage";
import ChoicePage from "./ChoicePage";
import GamePage from "./GamePage";
import MyPage from './/MyProfilePage';
import { useQuery } from "react-query";
import IUserProps from "../interface/IUserProps";
import { getLoginUserData } from "../../api/api";
import SignUp from "../mypage/Signup";

export default function HomePage() {
	const {data: Mydata} = useQuery<IUserProps>('me', getLoginUserData);
	return (
		<>
		<SideBar />
		<Routes>
		<Route path="/home" element={Mydata?.is_first ? <SignUp /> : <ChoicePage />} />
			<Route path="/profile" element={<MyPage />} />
			<Route path="/profile/:nickname" element={<UserProfile />} />
			<Route path="/chatting" element={<ChattingRoomPage />} />
			<Route path="/room/:roomName" element={<GamePage />} />
			<Route path="/game" element={<GamePage />} />
			<Route path="/waiting" element={<WaitingRoom />} />
		</Routes>
		</>
	);
}