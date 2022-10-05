import { MenuItem, Text, useToast } from '@chakra-ui/react';
import useWarningAlert from "../../../../hooks/useWarnigAlert";
import { useQueryClient } from "react-query";
import axios from "axios";
import { getCookie } from '../../../../api/cookieFunc';


function BlockMenu({label, target}: {label: string; target: string;}) {
	const queryClient = useQueryClient();
	const { setError, WarningDialogComponent } = useWarningAlert();
	const toast = useToast();
	const onClickHandler = () => {
		const url = 
		label === '차단하기'
		? `/friend/block/${target}` // 차단하기
		: `/friend/unblock/${target}`; // 차단 해제하기
		axios({
			method: "PATCH",
			headers: {
				Authorization: 'Bearer ' + getCookie("accessToken")
			},
			url: url
		})
		.then(() => {
			queryClient.invalidateQueries('Friend');
			queryClient.invalidateQueries('block');
			toast({
				title: `${label}`,
				description: `${target}님을 ${label}에 성공했습니다.`,
				status: 'success',
				duration: 1000,
				isClosable: true,
			});
		})
		.catch((err) => {
			if (err.response) {
				setError({
					headerMessage: '차단 실패',
					bodyMessage: err.response.data.message,
				});
			} else {
				setError({
					headerMessage: '차단 실패',
					bodyMessage: err.message,
				});
			}
		});
	};

	return (
		<>
		<MenuItem onClick={onClickHandler}>
			<Text>{label}</Text>
		</MenuItem>
		{WarningDialogComponent}
		</>
	);
}

export default BlockMenu;