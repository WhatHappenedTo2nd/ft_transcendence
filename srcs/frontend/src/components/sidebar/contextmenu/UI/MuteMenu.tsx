import { MenuItem, Text, useToast } from '@chakra-ui/react';
import axios from "axios";
import { useQueryClient } from "react-query";
import { useLocation, useParams } from 'react-router-dom';
import { getCookie } from '../../../../api/cookieFunc';
import useWarningAlert from "../../../../hooks/useWarnigAlert";

export default function MuteMenu({label, target}: {label: string; target: string;}) {
	const queryClient = useQueryClient();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const toast = useToast();
	const location = useLocation();
	const roomid = location.pathname.substring(6);
	const onClickHandler = () => {
		const url =
		label === '음소거'
		? `/chat/mute/${roomid}/${target}`
		: `/chat/unmute/${roomid}/${target}`
		axios({
			method: "PATCH",
			headers: {
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
			url: url
		})
		.then(() => {
			queryClient.invalidateQueries('roomuser');
			toast({
				title: `${label}`,
				description: `${target} 님을 ${label}하였습니다.`,
				status: 'success',
				duration: 1000,
				isClosable: true,
			});
		})
		.catch((err) => {
			if (err.response) {
				setError({
					headerMessage: '음소거 실패',
					bodyMessage: err.response.data.message,
				});
			} else {
				setError({
					headerMessage: '음소거 실패',
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