//Avatar.jsx

import React from 'react';
import './styles/Avatar.css';
import { useAuth0 } from "@auth0/auth0-react";

function UserAvatar() {
  const { user } = useAuth0();

  return (
    <div className='avatar'>
      {user && user.picture ? (
        <img
          alt='user profile'
          className='avatar-img'
          src={user && user.picture}
        />
      ) : (
        <div className='avatar-placeholder'>
          { user && user.name[0]}
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
