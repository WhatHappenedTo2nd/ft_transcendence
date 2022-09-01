import styled from "styled-components"
import * as React from "react"
import { Container } from "@chakra-ui/react"

const List = styled.div`
	width: 150px;
	height: 500px;
	border-radius: 8px;
`

const Side = styled.div`
	display: flex;
	border-right: 1px solid #000000;
	width: 20%;
`

const Profile = styled.div`
	width: 150px;
	height: 150px;
	border-radius: 100%;
	fontFamile: "Establish"
`

const SideBar: React.FunctionComponent = () => {
	return (
		<Side>
			<Container display="flex" flexDirection="row">
				1번,
				2번,
				3번
			</Container>
		</Side>
	)
}

export default SideBar;