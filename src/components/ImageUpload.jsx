import React, { useState, useRef, useContext, useEffect } from 'react';
import './styles/ImageUpload.css';
import Context from './Context';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../components/utils/loading/LoadingContext';
import Loading from '../components/utils/loading/Loding';
import { useAuth0 } from '@auth0/auth0-react';



function ImageUpload() {
  
  const { isLoading, setIsLoading } = useLoading();
  const { selectedFile, setSelectedFile,barcode,setPreviousSearches,previousSearches ,setBarcode,productData, setProductData } = useContext(Context);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect , user } = useAuth0();
  var userData = {
    name: user ? user.name : null,
    email: user? user.email : null
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        localStorage.setItem('selectedFile', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      const uploadImage = document.getElementById("uploadImage")
      formData.append('file', uploadImage.files[0]);

      setSelectedFile(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        localStorage.setItem('selectedFile', reader.result);
      };
      // reader.readAsDataURL(null);

      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          setIsLoading(false)
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setBarcode(data.bar);
        // console.log("barcode",barcode);
        setIsLoading(false)

        try {
          setIsLoading(true);

          const analysisResponse = await fetch('http://localhost:5000/analysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ barcode: data.bar, user: userData })
          });

          if (!analysisResponse.ok) {
            setIsLoading(false);
            throw new Error('Network response was not ok');
          }
          const analysisData = await analysisResponse.json();
          // console.log("analysis data",analysisData)
          setProductData(analysisData);
          localStorage.setItem('product', JSON.stringify(analysisData));
          navigate(`/analysis/${data.bar}`)

          const newData = {
            product_name : analysisData && productData.product_data.product_name,
            barcode : analysisData && productData.product_data.barcode
          }
          setPreviousSearches(previousSearches => [...previousSearches,newData])
          console.log("hiiiii")
          
          setIsLoading(false);


        } catch (error) {
          setIsLoading(false);
          console.error('Error fetching analysis data:', error);
        }


      } catch (error) {
        setIsLoading(false);
        console.error('Error uploading file:', error);
      }
    }
  };

  useEffect(()=>{
    console.log();

  },[setBarcode,barcode,productData,setProductData])


  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    localStorage.removeItem('selectedFile');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const storedImage = localStorage.getItem('selectedFile');
    if (storedImage) {
      setPreview(storedImage);
    }
  }, []);



if(isLoading) return ( <Loading/>)
else{
  return (
    <div className='image-upload'>
      <h1>Upload Image</h1>
      <input
        id='uploadImage'
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button className='file-input-button' onClick={triggerFileInput}>Choose File</button>
      {selectedFile ? (
        <div className='image-preview'>
          {preview && <img src={preview} alt="Preview" className='image-preview-img' />}
        </div>
      ) : (
        <p>No files selected</p>
      )}

      {selectedFile ? (
        <div className='upload-cancel-buttons'>
          <button className='form-btn' onClick={isAuthenticated ? handleUpload : loginWithRedirect} disabled={!selectedFile}>Upload</button>
          <button className='form-btn' onClick={handleCancel}>Cancel</button>
        </div>
      ) : null}
      
    </div>
  );
}
}

export default ImageUpload;
