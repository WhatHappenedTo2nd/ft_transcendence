import { MenuItem, Text } from '@chakra-ui/react';
import useRemoveFriend from '../../../../hooks/useRemoveFriend';

function RemoveFriendMenu({label, target}: {label: string; target: string;}) {
	const { onRemoveFriend, WarningDialogComponent } = useRemoveFriend(target);

	return (
		<>
		<MenuItem onClick={onRemoveFriend}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}

export default RemoveFriendMenu;