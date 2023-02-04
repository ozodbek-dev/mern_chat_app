import React, {useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {ViewIcon} from "@chakra-ui/icons";
import UserBadgeItem from "./UserBadgeItem";
import {ChatState} from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {selectedChat, setSelectedChat, user} = ChatState()

    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const [usersLoading, setUsersLoading] = useState(false)


    const handleDel = (u) => {

    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            setSearchResults([]);
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.get(`/api/user?search=${search}`, config);

            setSearchResults(data)
            setLoading(false);

        } catch (e) {
            toast({
                title: "Error!",
                description: e.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }
    const handleSubmit = () => {

    }
    const handleRemove = async (usr) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins Can add someone",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        try {
            setUsersLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.put('api/chat/group/remove', {
                chatId: selectedChat._id,
                userId: usr._id
            }, config)

            usr._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setUsersLoading(false)
        } catch (e) {
            toast({
                title: "Error Occured!",
                status: "error",
                description: e.response.data.message,
                isClosable: true,
                duration: 3000,
                position: "top"
            })
            setUsersLoading(false)
        }
    }
    const renameHandle = async () => {
        if (!groupChatName) {
            return
        }
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.put('/api/chat/group/rename', {
                chatId: selectedChat._id, chatName: groupChatName,
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
            toast({
                title: "Group Name Updated Successfully!",
                status: "success",
                isClosable: true,
                duration: 3000,
                position: "top"
            })
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
    const handleAddUser = async (usr) => {
        if (selectedChat.users.find(x => x._id === usr._id)) {
            toast({
                title: "User Already added",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only Admins Can add someone",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: 'top'
            });
            return;
        }
        try {
            setUsersLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.put('api/chat/group/add', {
                chatId: selectedChat._id,
                userId: usr._id
            }, config)
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setUsersLoading(false)
        } catch (e) {
            toast({
                title: "Error Occured!",
                status: "error",
                description: e.response.data.message,
                isClosable: true,
                duration: 3000,
                position: "top"
            })
            setUsersLoading(false)
        }


    }
    return (<>
        <IconButton d={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}></IconButton>
        <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={"xl"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader
                    fontSize={"20px"}
                    fontFamily="Work sans"
                    d="flex"
                    justifyContent="center"
                >Create Group</ModalHeader>
                <ModalCloseButton/>
                <ModalBody d="flex" flexDir="column" alignItems={"center"}>
                    <Box display={"flex"} flexWrap={"wrap"}>
                        {usersLoading ? <Spinner size={"lg"}/> : selectedChat.users.map(u => (
                            <UserBadgeItem key={u._id} handleFunc={() => handleRemove(u)} user={u}/>))}
                    </Box>

                    <FormControl display="flex">
                        <Input
                            placeholder="Chat Name"
                            mb={3}
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button mx={1} onClick={renameHandle} colorScheme={"gray"} isLoading={renameLoading}>
                            Update
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add Users  eg: Jhon, Piyush,Jane"
                            mb={1}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>

                    <Box mt={2} d="flex" flexDir="column"
                         style={{maxHeight: "300px", overflowY: "scroll"}}
                    >

                        {
                            loading ? <Spinner size="lg"/> : (
                                searchResults?.map(i => (
                                    <UserListItem user={i} key={i._id} handleFunction={() => handleAddUser(i)}/>
                                ))
                            )
                        }
                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => handleRemove(user)} colorScheme={"red"}>
                        Leave Group
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    </>);
};

export default UpdateGroupChatModal;