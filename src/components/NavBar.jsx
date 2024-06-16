import React from 'react';
import './styles/NavBar.css';
import HomePage from './HomePage';
import About from './About';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Analysis from './Analysis';
import { useAuth0 } from "@auth0/auth0-react";
import RightDrawer from './RightDrawer';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Tabs, Tab, TabList } from '@chakra-ui/react';
import UserAvatar from './Avatar';
import ImageUpload from './ImageUpload';

function NavBar() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        <Router>
            <Tabs align='end' variant='solid-rounded' colorScheme='blue'>

                <div className='nav-container'>
                    <div className='nav-title'>
                        <Link to={'/'}>
                            FactoFood
                        </Link>
                    </div>
                    <div className='nav-item-group'>
                        <TabList>

                            <Tab>
                                <Link to="/" className='nav-items'>Home</Link>
                            </Tab>
                            <Tab>
                                <Link to="/about" className='nav-items'>About</Link>
                            </Tab>
                            <Tab>
                                {isAuthenticated ? (
                                    <div className="avatar-container">
                                        <RightDrawer>
                                            <UserAvatar />
                                        </RightDrawer>
                                    </div>
                                ) : (
                                    <Link onClick={() => loginWithRedirect()} className='nav-items'>Login</Link>
                                )}
                            </Tab>
                        </TabList>
                    </div>
                    <div className='menu-icon'>
                        <RightDrawer>
                            <div>
                            <HamburgerIcon fontSize={'x-large'}/>
                            </div>
                        </RightDrawer>
                    </div>
                </div>
                <Routes>
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/analysis/*" element={<Analysis />} />
                </Routes>
            </Tabs>
        </Router>
    )
}

export default NavBar;
