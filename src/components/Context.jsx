import React, { createContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const { user } = useAuth0();

  const [selectedOption, setSelectedOption] = useState(() => {
    console.log('Initializing selectedOption');
    const saved = localStorage.getItem('selectedOption');
    return saved ? JSON.parse(saved) : null;
  });

  const [productData, setProductData] = useState(() => {
    console.log('Initializing productData');
    const saved = localStorage.getItem('product');
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedFile, setSelectedFile] = useState(() => {
    console.log('Initializing selectedFile');
    return localStorage.getItem('selectedFile') || null;
  });

  const [barcode, setBarcode] = useState(() => {
    console.log('Initializing barcode');
    return localStorage.getItem('barcode') || null;
  });

  const [previousSearches, setPreviousSearches] = useState(() => {
    console.log('Initializing previousSearches');
    const saved = localStorage.getItem('previousSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchPreviousSearches = async () => {
    try {
      if (!user) return;

      const response = await fetch('http://localhost:5000/api/previous-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();
      setPreviousSearches([...data]);
    } catch (error) {
      console.error('Error fetching previous searches:', error);
    }
  };

  useEffect(() => {
    console.log('Updating selectedOption in localStorage');
    localStorage.setItem('selectedOption', JSON.stringify(selectedOption));
  }, [selectedOption]);

  useEffect(() => {
    console.log('Updating productData in localStorage');
    localStorage.setItem('product', JSON.stringify(productData));
  }, [productData]);

  useEffect(() => {
    console.log('Updating previousSearches in localStorage');
    localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
  }, [previousSearches]);

  useEffect(() => {
    console.log('Updating selectedFile in localStorage');
    localStorage.setItem('selectedFile', selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    console.log('Updating barcode in localStorage');
    localStorage.setItem('barcode', barcode);
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
