import React, { useContext, useEffect, useState } from 'react';
import './styles/HomePage.css';
import Selector from './Selector';
import Context from './Context';
import ImageUpload from './ImageUpload';
import SearchBar from './SearchBar';
import Loading from './utils/loading/Loding';
import { useAuth0 } from '@auth0/auth0-react';

function HomePage() {
    const { selectedOption,fetchPreviousSearches } = useContext(Context);
    const{user} = useAuth0();
    const options = ['Image or Barcode', 'Name of Product'];
    const [loading , setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        fetchPreviousSearches();
        setLoading(false);
      }, [user]);

    return (
        <>
        {loading && <Loading/>}
        <div className="home-container">
            <h1 className="home-title">Find Your Food</h1>
            <Selector options={options} />
            <div className="content-container">
                {selectedOption &&  (
                    selectedOption === "Image or Barcode" ? <ImageUpload /> : <SearchBar />
                    )}
            </div>
        </div>
                    </>
    );
}

export default HomePage;
