import React from 'react';
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import {ViewIcon} from "@chakra-ui/icons";

const ProfileModal = ({user, children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (<>
        {children ? <span onClick={onOpen}>{children}</span> : (
            <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen}/>)}
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered={true}>
            <ModalOverlay/>
            <ModalContent
                // height="410px"

            >
                <ModalHeader
                    fotnSize="40px"
                    fontFamily="Work sans"
                    display={"flex"}
                    justifyContent={"center"}
                >{user.name}</ModalHeader>
                <ModalCloseButton/>
                <ModalBody
                    display={"flex"}
                    fontSize={"40px"}
                    fontFamily={"Work sans"}
                    flexDir={"column"}
                    justifyContent={"center"}
                    alignItems={'center'}
                >
                    <Image
                        borderRadius="full"
                        boxSize="250px"
                        objectFit={"cover"}
                        display={"flex"}
                        justifyContent={"center"}
                        src={user.pic}
                        alt={user.name}
                    />
                    <Text
                        fontSize={{base: "28px", md: "30px"}}
                        fontFamily="Work sans"
                        display={"flex"}
                        justifyContent={"center"}
                        my="1rem"
                    >
                        Email: {user.email}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>);
};

export default ProfileModal;