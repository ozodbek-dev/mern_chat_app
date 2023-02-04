import React, {useEffect, useState} from 'react';
import {ChatState} from "../../Context/ChatProvider";
import {Box, Button, Stack, Text, useToast} from "@chakra-ui/react";
import axios from "axios";
import {AddIcon} from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import {getSender} from "../../config/ChatLogics";
import GroupChatModal from "./  GroupChatModal";
import {MdGroup} from "react-icons/md";

const MyChats = ({fetchAgain}) => {
    const toast = useToast()
    const [loggedUser, setLoggedUser] = useState(undefined)
    const {user, selectedChat, setSelectedChat, chats, setChats} = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/chat`, config);
            setChats(data)
        } catch (e) {
            toast({
                title: "Error During fetching Chats!",
                description: `message: \n ${e.message}`,
                status: "error",
                duration: 3000,
                isClosable: "true",
                position: "bottom-left"
            })
        }
    }
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
        fetchChats()
    }, [fetchAgain])
    return (<Box
        display={{base: selectedChat ? "none" : "flex", md: "flex"}}
        flexDir='column'
        p={3}
        bg='white'
        width={{base: "100%", md: "31%"}}
        borderRadius={"lg"}
        borderWidth="1px"
        color="black"
    >
        <Box
            pb={3}
            px={3}
            fontSize={{base: "28px", md: "30px"}}
            fontFamily='Work sans'
            display="flex"
            width="100%"
            justifyContent="space-between"
            alignItems='center'
        >
            My Chats
            <GroupChatModal>
                <Button
                    display="flex"
                    fontSize={{base: "17px", md: "10px", lg: "17px"}}
                    rightIcon={<AddIcon/>}
                >
                    New Group Chat
                </Button>
            </GroupChatModal>
        </Box>
        <Box
            d="flex"
            p={3}
            bg={"#f8f8f8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY="hidden"
        >
            {chats ? (<Stack overflowY="scroll">
                {chats.map(chat => (<Box
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    bg={selectedChat === chat ? "#38b2ac" : "#e8e8e8"}
                    color={selectedChat === chat ? "#fff" : "#000"}
                >
                    <Text>
                        {!chat.isGroupChat && loggedUser ? getSender(loggedUser, chat.users) : (
                            <span>{chat.chatName}<MdGroup/>  </span>)}
                    </Text>
                </Box>))}
            </Stack>) : (<ChatLoading/>)}
        </Box>
    </Box>);
};

export default MyChats;