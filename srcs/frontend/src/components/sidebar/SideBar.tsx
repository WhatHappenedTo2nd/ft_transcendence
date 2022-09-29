import * as React from "react"
import { Box, Flex, Text, Divider } from "@chakra-ui/react"
import OnlineUserList from "./UserList";
import FriendList from "./FriendList";

type userProps = {
	children?: React.ReactNode;
}

export default function SideBar({ children }: userProps){
	return (
		<Box
			borderRight= "1px"
			pos="fixed"
			w="15% || 700px"
			h="100%">
		<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
			<Text fontSize="2xl" fontFamily="Establish">
				2기무슨일이고
			</Text>
		</Flex>
		<Divider borderColor="black" />
		<div>friend</div>
			<FriendList />
		<Divider borderColor="black" />
		<div>online</div>
			<OnlineUserList />
		</Box>
	)
}
