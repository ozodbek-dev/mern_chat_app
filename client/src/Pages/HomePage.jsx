import React, {useEffect} from 'react'
import {Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react'
import {Login} from '../components/Authentication/Login';
import {SignUp} from '../components/Authentication/SignUp';
import {useHistory} from "react-router-dom";

export const HomePage = () => {
    const history = useHistory();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) history.push("/chats")
    }, [history])
    return (
        <Container maxW="xl" centerContent>
            <Box
                d="flex"
                justifyContent="center"
                p={3}
                bg="white"
                borderRadius="lg"
                w="100%"
                m="40px 0 15px 0"
                borderWidth="1px"
            >
                <Text
                    textAlign="center"
                    fontSize="4xl"
                    fontFamily="Work sans"
                    color="black"
                >
                    Chat App
                </Text>
            </Box>
            <Box p={4} bg="white" w="100%" borderRadius="lg" borderWidth="1px" color="black">
                <Tabs variant="soft-rounded">
                    <TabList mb='1em' d="flex">
                        <Tab flex="1">Login</Tab>
                        <Tab flex="1">Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login/>
                        </TabPanel>
                        <TabPanel>
                            <SignUp/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}
