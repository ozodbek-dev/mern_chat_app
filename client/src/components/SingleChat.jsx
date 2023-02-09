import React, {useEffect, useRef, useState} from 'react';
import {ChatState} from "../Context/ChatProvider";
import {Box, FormControl, IconButton, Input, Spinner, Text, useToast} from "@chakra-ui/react";
import {ArrowBackIcon} from "@chakra-ui/icons";
import {getSender, getSenderFull} from "../config/ChatLogics";
import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/updateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from 'react-lottie'
import animationData from '../img/typing.json'

const ENDPOINT = "http://localhost:4000";
var selectedChatCompare;


const defaultOptions = {
    loop: true, autoplay: true, animationData, rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}
const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const socket = useRef(undefined)
    const toast = useToast()
    const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false)


    useEffect(() => {
        socket.current = io(ENDPOINT);
        socket.current.emit("setup", user);
        socket.current.on('connected', () => setSocketConnected(true))
        socket.current.on('typing', () => setIsTyping(true))
        socket.current.on('stop typing', () => setIsTyping(false))
    }, [])

    const fetchMessages = async () => {
        if (!selectedChat) return
        try {
            setLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data)
            setLoading(false)
            socket.current.emit("join chat", selectedChat._id)
        } catch (e) {
            toast({
                title: "Error Occured!",
                status: "error",
                description: e.response.data.message,
                isClosable: true,
                duration: 3000,
                position: "top"
            })
        }
    }


    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    const sendMessage = async (e) => {

        if (e.key === 'Enter' && newMessage) {
            socket.current.emit('sendmsg', newMessage)
            socket.current.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json", authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const {data} = await axios.post('/api/message', {
                    content: newMessage, chatId: selectedChat._id
                }, config)

                setMessages([...messages, data])
                socket.current.emit("new message", data)


            } catch (e) {
                toast({
                    title: "Error Occured!",
                    status: "error",
                    description: e.response.data.message,
                    isClosable: true,
                    duration: 3000,
                    position: "top"
                })
            }
        }
    }

    useEffect(() => {

        if (!socket.current) return;

        socket.current.on('received msg', msgReceived => {
            console.log(msgReceived)
            if (!selectedChatCompare || selectedChatCompare._id !== msgReceived.chat._id) {
                // notification
            } else {
                setMessages([...messages, msgReceived])
            }
        })

    })


    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return;
        if (!typing) {
            setTyping(true)
            socket.current.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();

        var timerLength = 5000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime

            if (timeDiff >= timerLength && typing) {
                socket.current.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }


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

                {!selectedChat.isGroupChat ? (<>
                    {getSender(user, selectedChat.users)}
                    <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
                </>) : (<>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                    />
                </>)}
            </Text>
            <Box
                display="flex"
                flexDir="column"
                justifyContent={"flex-end"}
                p={3}
                bg="#e8e8e8"
                w="100%"
                h='100%'
                borderStartRadius="lg"
                overflowY="hidden"
                color="black"
            >
                {loading ? (
                    <Spinner size={"xl"} w={20} h={20} alignSelf={"center"} margin={"auto"} color={"black"}/>) : (
                    <div className="messages">
                        <ScrollableChat messages={messages}/>
                    </div>)}
                <FormControl onKeyDown={sendMessage}>
                    {isTyping ? <div>
                        <Lottie
                            options={defaultOptions}
                            width={70}
                            style={{marginBottom: 15, marginLeft: 0}}
                        />
                    </div> : null}
                    <Input
                        type="text"
                        variant="filled"
                        bg="#e0e0e0"
                        value={newMessage}
                        placeholder="Enter a message..."
                        onChange={typingHandler}/>
                </FormControl>
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