import React, { useContext, useEffect, useState } from 'react';
import './styles/RightDrawer.css';
import { useAuth0 } from '@auth0/auth0-react';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    useDisclosure,
    useBreakpointValue,
    DrawerFooter,
    Avatar,
    Box,
    Text
} from '@chakra-ui/react';
import Context from './Context';
import Loading from './utils/loading/Loding';
import { useNavigate } from 'react-router';


const RightDrawer = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = React.useRef();
    const { loginWithRedirect , isAuthenticated ,logout, user } = useAuth0();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const isMobileView = useBreakpointValue({ base: true, md: false });
    const { previousSearches, productData, setProductData } = useContext(Context);

    const fetchProduct = async (email, barcode) => {
        try {
            setIsLoading(true);
            // console.log(barcode);
            const response = await fetch(`http://localhost:5000/get-product?email=${email}&barcode=${barcode}`);

            if (!response.ok) {
                setIsLoading(false);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setIsLoading(false)
            await setProductData(data);
            navigate(`./analysis/${barcode}`)

        } catch (error) {
            setIsLoading(false)
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    useEffect(() => {
    }, [isLoading,previousSearches])

    useEffect(()=>{
      },[productData,setProductData])

    if (isLoading) {
        return (
            <Loading />
        )
    }
    else {
        return (
            <>
                <Button ref={btnRef} colorScheme="teal" onClick={onOpen} style={{ background: 'none' }}>
                    {children}
                </Button>
                <Drawer
                    isOpen={isOpen}
                    placement="right"
                    onClose={onClose}
                    finalFocusRef={btnRef}
                    className="drawer"
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton color={'rgb(255,0,0,0.6)'} fontSize={'25px'} paddingTop={'25px'} />
                        <DrawerHeader
                            color={'lightgreen'}
                            textAlign={'center'}
                            fontSize={'x-large'}
                            textShadow={'5px 5px 2px #000000'}
                            backgroundImage={'https://img1.wsimg.com/isteam/stock/3782/:/rs=w:388,h:194,cg:true,m/cr=w:355,h:194'}
                            backgroundPosition={'center'}
                            backgroundPositionX={'50%'}
                            backgroundPositionY={'85%'}><div style={{ paddingLeft: '80px' }}>FACTOFOOD </div></DrawerHeader>
                        <DrawerBody>
                            {user && (
                                <Box textAlign="center" mb="4">
                                    <Avatar name={user && user.name} src={user && user.picture} size="xl" mb="4" />
                                    <Text fontWeight="bold">{user && user.name}</Text>
                                    <Text>{user && user.email}</Text>
                                </Box>
                            )}
                            {isMobileView && (
                                <div className='drawer-items'>
                                    <div className="drawer-item">
                                        <Button
                                            variant="ghost"
                                            colorScheme="teal"
                                            onClick={() => window.location.href = '/'}
                                            style={{ backgroundColor: '#329D9C', width: '100%', color: 'white' }}>Home</Button>
                                    </div>
                                    <div className="drawer-item">
                                        <Button
                                            variant="ghost"
                                            colorScheme="teal"
                                            onClick={() => window.location.href = '/about'}
                                            style={{ backgroundColor: '#329D9C', width: '100%', color: 'white' }}>About</Button>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            {/* {console.log(previousSearches)} */}
                                {previousSearches.map((productDetail, index) => {
                                    const { product_name, barcode } = productDetail;
                                    return (
                                        <Button onClick={() => fetchProduct(user.email, barcode)} key={barcode}>
                                            {product_name}
                                        </Button>
                                    );
                                })}
                            </div>

                        </DrawerBody>
                        <DrawerFooter>
                            <Button colorScheme='teal' onClick={isAuthenticated? logout : loginWithRedirect} w='100%'>
                                {isAuthenticated ? "Logout" : "Login"}
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        );
    }

};

export default RightDrawer;
