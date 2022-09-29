import { AxiosError } from "axios";
import React from "react";
import WarningAlert from "../components/WarnigAlert/WarningAlert";
import IWarningProps from "../components/interface/IWarningProps";

export default function useWarningAlert(onClose?: () => void | undefined) {
	const [error, setError] = React.useState<IWarningProps>({
		headerMessage:'',
		bodyMessage:'',
	});
	const clearError = React.useCallback(() => {
		setError({ headerMessage: '', bodyMessage: '' });
		if (onClose) onClose();
	}, [setError, onClose]);
	const cancleRef = React.useRef(null);
	const onError = React.useCallback((err: IWarningProps | AxiosError<any, any>) => {
		if ('headerMessage' in err) {
			setError(err as IWarningProps);
		} else {
			const aerr = err as AxiosError<any, any>;
			if (aerr.response) {
				setError({
					headerMessage: '오류 발생',
					bodyMessage: aerr.response.data.message,
				});
			} else {
				setError({
					headerMessage: '오류 발생',
					bodyMessage: aerr.message,
				});
			}
		}
	}, [setError]);

	return {
		setError: onError,
		WarningDialogComponent: (
			<WarningAlert 
			isOpen={error.bodyMessage.length > 0}
			onClose={()=> clearError()}
			cancleRef={cancleRef}
			headerMessage={error.bodyMessage}
			bodyMessage={error.bodyMessage}
			/>
		),
	};
}