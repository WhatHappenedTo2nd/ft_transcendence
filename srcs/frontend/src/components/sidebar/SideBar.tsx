import { Box, Flex, Text, Divider } from "@chakra-ui/react"
import OnlineUserList from "./UserList";
import { useLocation, useNavigate } from "react-router-dom";
import RoomUserList from "./RoomUserList";
import FriendList from "./FriendList";

export default function SideBar(){
	const navigate = useNavigate();
	const location = useLocation();
	
	return (
		<Box
			borderRight= "1px"
			pos="fixed"
			w="max(15%, 230px)"
			h="100%"
		>
			<Flex h="20" alignItems="center" mx="8" display="flex" justifyContent="center" onClick={() => {navigate("/home")}}>
				<Text fontSize="2xl" fontFamily="Establish">
					2기무슨일이고
				</Text>
			</Flex>
			<Divider borderColor="black" />
			<FriendList />
			<Divider borderColor="black" />
			{location.pathname.includes(`room`) ? <RoomUserList /> : <OnlineUserList />}
		</Box>
	)
}
