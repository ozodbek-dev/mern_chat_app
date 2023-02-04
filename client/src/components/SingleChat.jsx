import React from 'react';
import {ChatState} from "../Context/ChatProvider";
import {Box, IconButton, Text} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {getSender, getSenderFull} from "../config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/updateGroupChatModal";

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat} = ChatState();
    return (<>
        {selectedChat ? (<>
            <Text
                fontSize={{base: "28px", md: "30px"}}
                py={3}
                px={5}
                m={1}
                w="100%"
                fontFamily="Work sans"
                display="flex"
                justifyContent={{base: "space-between"}}
                alignItems={"center"}
                color="black"
            >
                <IconButton display={{base: "flex", md: "none"}} icon={<ArrowBackIcon/>}
                            onClick={() => setSelectedChat('')}> </IconButton>

                {
                    !selectedChat.isGroupChat ? (
                        <>{getSender(user, selectedChat.users)}
                            <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                        </>) : (
                        <>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        </>
                    )
                }
            </Text>
            <Box
                display={"flex"}
                flexDir="flex-end"
                p={3}
                bg="#e8e8e8"
                w="100%"
                h={'100%'}
                borderStartRadius={"lg"}
                overflowY={"hidden"}
            >

            </Box>
        </>) : (<Box
            display={"grid"}
            color="black"
            placeContent="center"
            h={"100%"}
            m={'1rem'}
        >
            <Text d="inline-block" fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
                Click on a user to start chatting
            </Text>
        </Box>)}

    </>);
};

export default SingleChat;