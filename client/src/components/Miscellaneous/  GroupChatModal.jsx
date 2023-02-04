import React, {useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {ChatState} from "../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "../User/UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({children}) => {
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {user, chats, setChats} = ChatState();


    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)


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
                title: "Error Occcured!",
                description: e.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }
    const handleGroup = (u) => {
        if (selectedUsers.find(x => x._id === u._id)) {
            toast({
                title: "User Already added",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: 'top'
            })
            return
        }

        setSelectedUsers([...selectedUsers, u])
    }
    const handleDel = (u) => {
        setSelectedUsers([...selectedUsers.filter(i => i._id.toString() !== u._id.toString())])
    }
    console.log(chats)

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
            toast({
                title: "Please Fill All Fields",
                status: "warning",
                isClosable: true,
                duration: 3000,
                position: "top"
            })

        }
        try {
            setSubmitLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.post('/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id))
            }, config)

            setChats([data, ...chats])
            onClose();
            setGroupChatName('')
            setSelectedUsers([])
            setSubmitLoading(false)
            toast({
                title: "Group Has been created!",
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

    console.log(selectedUsers)
    return (<>
        <span onClick={onOpen}>{children}</span>
        <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size={"xl"}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader
                    fontSize={"35px"}
                    fontFamily="Work sans"
                    d="flex"
                    justifyContent="center"
                >Create Group</ModalHeader>
                <ModalCloseButton/>
                <ModalBody d="flex" flexDir="column" alignItems={"center"}>
                    <FormControl>
                        <Input
                            placeholder="Chat Name"
                            mb={3}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Input
                            placeholder="Add Users  eg: Jhon, Piyush,Jane"
                            mb={1}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </FormControl>
                    <Box display={"flex"} flexWrap={"wrap"}>
                        {
                            selectedUsers.map(u => (
                                <UserBadgeItem key={u._id} handleFunc={() => handleDel(u)} user={u}/>
                            ))
                        }
                    </Box>
                    <Box mt={2} d="flex" flexDir="column"
                         style={{maxHeight: "300px", overflowY: "scroll"}}
                    >

                        {
                            loading ? <div>loading...</div> : (
                                searchResults?.map(i => (
                                    <UserListItem user={i} key={i._id} handleFunction={() => handleGroup(i)}/>
                                ))
                            )
                        }
                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSubmit} colorScheme={"blue"} isLoading={submitLoading}>
                        Create Group
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>

    </>);
};

export default GroupChatModal;

//14:44