import React from 'react';
import {Box} from "@chakra-ui/react";
import {ChatState} from "../../Context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({fetchAgain, setFetchAgain}) => {
    const {selectedChat} = ChatState()
    return (
        <Box
            display={{base: selectedChat ? "flex" : "none", md: "flex"}}
            alignItems={'center'}
            flexDir="column"
            bg={'white'}
            w={{base: "100%", md: "70%"}}
            borderRadius={"lg"}
            borderWidth={"1px"}
            mx={3}
            p={3}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Box>
    );
};

export default ChatBox;