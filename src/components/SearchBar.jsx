import React, { useContext, useEffect, useState } from 'react';
import './styles/SearchBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import Context from './Context';

const SearchBar = () => {

    const [searchTerm , setSearchterm] = useState("");
    const { setProductData,productData } = useContext(Context);
    const { user } = useAuth0();
    const navigate = useNavigate();

    var userData = {
        name: user ? user.name : null,
        email: user? user.email : null
      }

    const handleSearch = (event) => {
        setSearchterm(event.target.value);
    };

    const fetchProduct = async () =>{
            const analysisResponse = await fetch('http://localhost:5000/analysis-name', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_name:searchTerm , user: userData })
          });

          if (!analysisResponse.ok) {
            throw new Error('Network response was not ok');
          }
          const analysisData = await analysisResponse.json();
          setProductData(analysisData);
          navigate(`/analysis/${analysisData.barcode}`)
    }

    useEffect(()=>{

    },[setSearchterm,searchTerm])

    useEffect(()=>{
      if(productData){
        localStorage.setItem('product',JSON.stringify(productData))
      }
    },[setProductData])

    return (
        <form className="search-bar" onSubmit={(e) => { e.preventDefault(); fetchProduct();} }>
            <input
                type="text"
                placeholder="Enter product name..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <Button type='submit' className="search-button">
                Search
            </Button>
        </form>
    );
};

export default SearchBar;
