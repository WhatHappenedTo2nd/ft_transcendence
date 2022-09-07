import * as React from "react"
import { Box, Flex, Text, Divider } from "@chakra-ui/react"
import OnlineserList from "./UserListItem";
import FriendList from "./FriendList";

type userProps = {
	children?: React.ReactNode;
}

export default function SideBar({ children }: userProps){
	return (
		<Box
			borderRight= "1px"
			pos="fixed"
			h="770px">
		<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
			<Text fontSize="2xl" fontFamily="Establish">
				2기무슨일이고
			</Text>
		</Flex>
		<Divider borderColor="black" />
			<FriendList />
		<Divider borderColor="black" />
			<OnlineserList />
		</Box>
	)
}
