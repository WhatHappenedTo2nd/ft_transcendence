import { MenuItem, Text, useToast } from '@chakra-ui/react';
import axios from "axios";
import { useQueryClient } from "react-query";
import { useLocation } from 'react-router-dom';
import { getCookie } from '../../../../api/cookieFunc';
import useWarningAlert from "../../../../hooks/useWarnigAlert";

export default function AddAdminMenu({label, target}: {label: string; target: string;}) {
	const queryClient = useQueryClient();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const toast = useToast();
	const location = useLocation();
	const roomname = location.pathname.substring(6);
	const onClickHandler = () => {
		axios({
			method: "PATCH",
			headers: {
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
			url: `/chat/addadmin/${roomname}/${target}`
		})
		.then(() => {
			queryClient.invalidateQueries('me');
			queryClient.invalidateQueries('Friend');
			queryClient.invalidateQueries('online');
			queryClient.invalidateQueries('roomuser');
			queryClient.invalidateQueries('usernick');
			queryClient.invalidateQueries('block');
			queryClient.invalidateQueries('chat');
			queryClient.invalidateQueries('findroom');
			toast({
				title: `${label}`,
				description: `${target} 님에게 운영자 권한을 주었습니다.`,
				status: 'success',
				position: 'top-right',
				duration: 1000,
				isClosable: true,
			});
		})
		.catch((err) => {
			if (err.response) {
				setError({
					headerMessage: '권한 주기 실패',
					bodyMessage: err.response.data.message,
				});
			} else {
				setError({
					headerMessage: '권한 주기 실패',
					bodyMessage: err.message,
				});
			}
		})
	}

	return (
		<>
		<MenuItem onClick={onClickHandler}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}