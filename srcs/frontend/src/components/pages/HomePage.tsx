import { Route, Routes, useLocation } from "react-router-dom";
import UserProfile from "../mypage/UserProfile";
import SideBar from "../sidebar/SideBar";
import ChattingRoomPage from "./ChattingRoomPage";
import ChoicePage from "./ChoicePage";
import GamePage from "./GamePage";
import MyPage from './/MyProfilePage';
import { useQuery } from "react-query";
import IUserProps from "../interface/IUserProps";
import { getLoginUserData, getWhereAreYou, getWhereAreYouByIntraId } from "../../api/api";
import SignUp from "../mypage/Signup";
import NotFound from "./NotFound";
import IChatListProps from "../interface/IChatListProps";
import { socket } from "../../App";
import { getCookie } from "../../api/cookieFunc";

export default function HomePage() {
	const { data: Mydata } = useQuery<IUserProps>('me', getLoginUserData);
	const intra_id = getCookie("intra_id");
	const { data: chat } = useQuery<IChatListProps>(['findroombyintra', intra_id], () => getWhereAreYouByIntraId(intra_id));
	const location = useLocation();
	console.log(chat);
	if (chat) {
		console.log("test");
		const roomId = chat.id;
		const roomName = chat.title;
		if (!location.pathname.includes('room') || !location.pathname.includes('chat')) {
			socket.emit('leave-room', { roomId, roomName, userIntraId: getCookie("intra_id") }, () => {});
		}
	}

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
			<Route path="/*" element={<NotFound />} />
		</Routes>
		</>
	);
}