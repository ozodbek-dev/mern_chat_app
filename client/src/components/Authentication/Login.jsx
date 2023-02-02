import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack} from '@chakra-ui/react'
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useHistory} from 'react-router-dom';

export const Login = () => {
    const history = useHistory()
    const toast = useToast();
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    const [userData, setUserData] = useState({
        email: '',
        password: '',
    })
    const changeDataHandler = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }
    const handleClick = () => setShow((prev) => !prev)

    const submitHandler = async () => {
        setLoading(true);
        const {email, password} = userData;
        if (!email || !password) {
            toast({
                title: "Please Fill all Fields!",
                status: "warning",
                duration: 3000, isClosable: true,
                position: 'top'
            })
            setLoading(false)
            return
        }

        try {
            const config = {
                headers: {
                    "Contnet-Type": "application/json"
                }
            }

            const body = {
                email, password
            }

            const {data} = await axios.post("/api/user/login", body, config);
            toast({
                title: "You are logged in successfully!",
                status: "success",
                duration: 3000, isClosable: true,
                position: 'top'
            })

            localStorage.setItem("userInfo", JSON.stringify(data))
            setLoading(false)
            history.push('/chats')
        } catch (err) {
            toast({
                title: "Error Occured!",
                description: err.response.data.message,
                status: "error",
                duration: 3000, isClosable: true,
                position: 'top'
            })
            setLoading(false)
        }
    }
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
            history.push("/dddd")
        }
    }, []);

    return (
        <VStack spacing="1rem">

            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder="Enter Your Email"
                    type="email"
                    name="email"
                    onChange={changeDataHandler}
                />
            </FormControl>

            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder="Enter Your Password"
                        type={show ? 'text' : 'password'}
                        name="password"
                        onChange={changeDataHandler}
                    />
                    <InputRightElement>
                        <Button hl="1.75rem" size="sm" onClick={handleClick}>
                            {!show ? <ViewIcon/> : <ViewOffIcon/>}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <Button isLoading={loading} colorScheme="blue" width="100%" style={{marginTop: "15px"}}
                    onClick={submitHandler}>
                Login
            </Button>
            <Button colorScheme="red" width="100%" style={{marginTop: "15px"}}>
                Get Guest user Creditionals
            </Button>
        </VStack>
    )
}
