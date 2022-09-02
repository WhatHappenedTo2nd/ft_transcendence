import * as React from "react"
import { Box, Flex, Text, Link, FlexProps } from "@chakra-ui/react"

interface LinkItemProps {
	name: string;
  }

const LinkItems: Array<LinkItemProps> = [
	{name: 'test1'},
	{name: 'test2'},
	{name: 'test3'},
	{name: 'test4'},
	{name: 'test5'},
]

interface NavItemProps extends FlexProps {
	children: string;
  }

const NavItem = ({ children, ...rest }: NavItemProps) => {
	return (
	  <Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
		<Flex
		  align="center"
		  p="4"
		  mx="4"
		  borderRadius="lg"
		  role="group"
		  cursor="pointer"
		  _hover={{
			bg: 'cyan.400',
			color: 'white',
		  }}
		  {...rest}>
		  {children}
		</Flex>
	  </Link>
	);
  };

const SideBarContent = () => {
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
		{LinkItems.map((link) => (
			<NavItem key={link.name}>
				{link.name}
			</NavItem>
		))}
		</Box>
	);
};


const SideBar: React.FunctionComponent = () => {
	return (
		<Box>
			<SideBarContent />
		</Box>
	)
}

export default SideBar;