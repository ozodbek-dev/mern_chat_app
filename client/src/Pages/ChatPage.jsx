import React, {useEffect} from 'react'
import {ChatState} from "../Context/ChatProvider";
import {Box} from '@chakra-ui/react'
import SideDrawer from "../components/Miscellaneous/SideDrawer";
import MyChats from "../components/Miscellaneous/MyChats";
import ChatBox from "../components/Miscellaneous/ChatBox";

export const ChatPage = () => {
    const {user, setUser} = ChatState()
    useEffect(() => {
        if (!user) {
            setUser(JSON.parse(localStorage.getItem("userInfo")))
        }
    }, [])

    return (<div width="100%" style={{border: "1px solid white", width: "100%"}}>
        {user && <SideDrawer/>}
        <Box display="flex" justifyContent="space-between" width={"100%"} height={"91.5vh"} p="10px">
            {user && <MyChats/>}
            {user && <ChatBox/>}
        </Box>
    </div>)
}  