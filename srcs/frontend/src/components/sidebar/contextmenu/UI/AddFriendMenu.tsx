import React from "react";
import { MenuItem, Text } from '@chakra-ui/react';
import useAddFriend from "../../../../hooks/useAddFriend";

function AddFriendMenu({label, target}: {label: string; target: string;}) {
	const { onAddFriend, WarningDialogComponent } = useAddFriend(target);

	return (
		<>
		<MenuItem onClick={onAddFriend}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}

export default AddFriendMenu;