import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from '@chakra-ui/react'
import {useHistory} from 'react-router-dom'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import axios from 'axios'

export const SignUp = () => {
  const history = useHistory()
  const toast = useToast();

  const [show, setShow] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [pic, setPic] = useState(undefined)
  const [loading, setLoading] = useState(false)

  console.log(userData)
  const changeDataHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }
  const handleClick = () => setShow((prev) => !prev)

  const postDetails = (img) => {
    setLoading(true);
    if(img === undefined){
      toast({
        title:"Please Select an Image!",
        status:"warning",
        duration:3000,isClosable:true,
        position:'top'
      })
      setLoading(false)
      return
    }
    if(img.type ==='image/jpeg' || img.type ==='image/png' ||img.type ==='image/jpg'){
      const data = new FormData();
      data.append("file",img);
      data.append("upload_preset","chat_users_pics")
      data.append("cloud_name","dhogeizoc")
      fetch('https://api.cloudinary.com/v1_1/dhogeizoc/image/upload', {
        method:"post",body:data
      }).then(res=>res.json()).then(data=>{
        setPic(data.url.toString())
        setLoading(false)
      }).catch((err)=>{
        setLoading(false)
      })
    }
    else{
      toast({
        title:"Please Select an Image!",
        status:"warning",
        duration:3000,isClosable:true,
        position:'top'
      })
      setLoading(false)
      return
    }
  }

  const submitHandler = async ()=>{
    setLoading(true);
    const {name,email,password,confirmPassword} = userData;
    if(!name || !email || !password || !confirmPassword){
      toast({
        title:"Please Fill all Fields!",
        status:"warning",
        duration:3000,isClosable:true,
        position:'top'
      })
      setLoading(false)
      return
    }
    if(password !== confirmPassword){
      toast({
        title:"Passwords Do Not Match",
        status:"warning",
        duration:3000,isClosable:true,
        position:'top'
      })
      setLoading(false)
      return
    }
    try {
      const config = {
        headers:{
          "Contnet-Type":"application/json"
        }
      }

      const body = {
        name,email,password,pic
      }
      
      const {data} = await axios.post("/api/user/register",body,config);
      toast({
        title:"Registration Successfull!",
        status:"success",
        duration:3000,isClosable:true,
        position:'top'
      })
      console.log(data)
      localStorage.setItem("userInfo", JSON.stringify(data))
      history.push('/chats')
      setLoading(false)

    } catch (err) {
      toast({
        title:"Error Occured!",
        description:err.response.data.message,
        status:"error",
        duration:3000,isClosable:true,
        position:'top'
      })
      setLoading(false)
    }
  }

  return (
    <VStack spacing="1rem">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          name="name"
          type="text"
          onChange={changeDataHandler}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          type="email"
          name="email"
          onChange={changeDataHandler}
        />
      </FormControl>

      <FormControl id="password" isRequired>
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
              {!show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Confirm  Password"
            type={show ? 'text' : 'password'}
            name="confirmPassword"
            onChange={changeDataHandler}
          />
          <InputRightElement>
            <Button hl="1.75rem" size="sm" onClick={handleClick}>
              {!show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="picture">
        <FormLabel>Upload Your picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          p={1.5}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button isLoading={loading} colorScheme="blue" width="100%" style={{marginTop:"15px"}} onClick={submitHandler}>
        Sign Up
      </Button>
    </VStack>
  )
}
