import { WarningIcon } from '@chakra-ui/icons';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	HStack,
	Text,
	Button,
} from '@chakra-ui/react'
import React from 'react';

function WarningAlert({
	isOpen,
	onClose,
	cancleRef,
	headerMessage,
	bodyMessage,
}: {
	isOpen: boolean;
	onClose: () => void;
	cancleRef: React.MutableRefObject<null>;
	headerMessage: string;
	bodyMessage: string;
}) {
	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancleRef}
			onClose={onClose}
			isCentered
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize="lg" fontWeight="bold">
						<HStack>
							<WarningIcon boxSize="1em" />
							<Text>{headerMessage}</Text>
						</HStack>
					</AlertDialogHeader>
					<AlertDialogBody>{bodyMessage}</AlertDialogBody>
					<AlertDialogFooter>
						<Button colorScheme="green" ref={cancleRef} onClick={onClose}>
							OK
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>		
			</AlertDialogOverlay>
		</AlertDialog>
	);
}

export default WarningAlert;