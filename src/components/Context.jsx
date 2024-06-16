import React, { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const { user } = useAuth0();
  const [selectedOption, setSelectedOption] = useState(null);

  const [productData, setProductData] = useState(()=>{
    return JSON.parse(localStorage.getItem('product')) || null;
  });

  const [selectedFile, setSelectedFile] = useState(() => {
    // Retrieve selected file name from local storage or default to null
    return localStorage.getItem('selectedFile') || null;
  });

  const [barcode, setBarcode] = useState(() => {
    // Retrieve barcode from local storage or default to null
    return localStorage.getItem('barcode') || null;
  });

  const [previousSearches, setPreviousSearches] = useState(()=>{
    return JSON.parse(localStorage.getItem('previousSearches')) || [];
  });

  const fetchPreviousSearches = async () => {
    try {
      if (!user) return; // Do nothing if user is not logged in

      // Fetch previous searches from the server
      const response = await fetch('http://localhost:5000/api/previous-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }), // Send user's email as body
      });

      const data = await response.json();
  
      setPreviousSearches([...data]);
    } catch (error) {
      console.error('Error fetching previous searches:', error);
    }
  };


  // Clear local storage on page refresh
  useEffect(() => {
    localStorage.clear();
  }, []);

  
  useEffect(()=>{
    if(productData){
      localStorage.setItem('product',JSON.stringify(productData));
    }
  },[productData])

  useEffect(()=>{
    if(previousSearches){
      localStorage.setItem('previousSearches',JSON.stringify(previousSearches))
    }
  },[previousSearches])


  // Update local storage whenever selected file changes
  useEffect(() => {
    if (selectedFile) {
      localStorage.setItem('selectedFile', selectedFile);
    }
  }, [selectedFile]);

  // Update local storage whenever barcode changes
  useEffect(() => {
    if (barcode) {
      localStorage.setItem('barcode', barcode);
    }
  }, [barcode]);

  return (
    <Context.Provider value={{
      selectedOption,
      setSelectedOption,
      selectedFile,
      setSelectedFile,
      barcode,
      setBarcode,
      productData,
      setProductData,
      fetchPreviousSearches,
      previousSearches
    }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
