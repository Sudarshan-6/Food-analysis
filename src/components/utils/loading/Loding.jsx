import React from 'react';
import { useLoading } from './LoadingContext';
import './Loading.css';

function Loading() {
    const { isLoading } = useLoading();

    return (
        <div className={`loading-container ${isLoading ? 'show' : 'hide'}`}>
            <div className='spinner'></div>
            <h1>  Loading...</h1>
        </div>
    );
}

export default Loading;
