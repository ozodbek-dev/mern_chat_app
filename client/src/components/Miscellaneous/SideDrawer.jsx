import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import {BellIcon, ChevronDownIcon, SearchIcon,} from "@chakra-ui/icons";
import {ChatState} from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import {useHistory} from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../User/UserListItem";

const SideDrawer = () => {
    const history = useHistory()
    const toast = useToast()
    const {isOpen, onOpen, onClose} = useDisclosure()

    const {user, setUser, setSelectedChat, chats, setChats,} = ChatState();

    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        setChats([])
        setSelectedChat(undefined)
        setUser(undefined)
        history.push("/")
    }
    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in Search input",
                status: "warning",
                duration: 5000,
                isClosable: "true",
                position: "top-left"
            })
            return
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false);
            setSearchResult(data);

        } catch (e) {
            toast({
                title: "Error Occured!",
                description: `Failed to load the Search Results \n Error: ${e.response.data.message}`,
                status: "error",
                duration: 3000,
                isClosable: "true",
                position: "bottom-left"
            })
        }
    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${user.token}`
                }
            }

            const {data} = await axios.post("/api/chat", {userId}, config)
            if (!chats.find(c => c._id === data._id)) {
                setChats([data, ...chats])
            }
            setSelectedChat(data);
            setLoadingChat(false)
            onClose()
        } catch (e) {
            toast({
                title: "Error Occured!",
                description: `Failed to access chat \n Error: ${e.message}`,
                status: "error",
                duration: 3000,
                isClosable: "true",
                position: "bottom-left"
            })

        }
    }

    return (<>
            <Box
                display="flex"
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                w='100%'
                p='5px 10px 5px 10px'
                borderWidth="5px"
                color={"black"}
            >
                <Tooltip label="Search Users To Chat" hashArrow placement={"bottom-end"}>
                    <Button variant={"ghost"} color="black" onClick={onOpen}>
                        <SearchIcon/>
                        <Text display={{base: "none", md: "flex"}} px={4} color={"inherit "}>
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans">Chat App</Text>
                <div>
                    <Menu>
                        <MenuButton as={Button} p={1}>
                            <BellIcon fontSize="2xl" m={1}/>
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                            <Avatar size="sm" cursor={"pointer"} name={user.name} src={user.pic}/>
                        </MenuButton>

                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile </MenuItem>
                            </ProfileModal>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>

                        </MenuList>
                    </Menu>
                </div>

            </Box>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader
                        borderBottomWidth="1px"
                    >
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display={"flex"} pb={2}>
                            <Input
                                placeholder="Search By name Or Email"
                                mr={2}
                                value={search}
                                onChange={e => setSearch(e.target.value)}/>
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {
                            loading ? (<ChatLoading/>) : (

                                searchResult?.map(u => (
                                    <UserListItem
                                        key={u._id}
                                        user={u}
                                        handleFunction={() => accessChat(u._id)}
                                    />
                                ))
                            )
                        }
                        {
                            loadingChat && <Spinner ml="auto" display="flex"/>
                        }
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>

    );
};

export default SideDrawer;

// 13:57
