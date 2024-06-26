import React, { useContext, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import NutritionalInfo from './NutritionalInfo';
import Ingredients from './Ingredients';
import NutrientLevels from './NutrientLevels';
import Context from './Context';
import Discription from './Discription';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation, useParams } from 'react-router';

function AchordianItems({ data, type }) {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <h2>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='center'>
                <Heading mb="4" textAlign="center" fontSize="xl" color="teal.600">{type}</Heading>
              </Box>
              {isExpanded ? (
                <MinusIcon fontSize='15px' />
              ) : (
                <AddIcon fontSize='15px' />
              )}
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <div className="accordian-item" style={{ justifyContent: "center", display: "flex" }}>
              <Box p={4}>
                {type === "Nutritional Information" ?
                  <NutritionalInfo nutriments={data && data.nutriments} /> :
                  type === "Ingredients used" ?
                    <Ingredients ingredients_hierarchy={data && data.ingredients_hierarchy} /> :
                    type === "Discription" ?
                      <Discription data={data && data.discription} /> :
                      <NutrientLevels nutrientLevels={data && data.nutrient_levels} />}
              </Box>
            </div>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
}

function Analysis() {
    const {user} = useAuth0();
    const email = user?.email;
    const location = useLocation();
    const barcode = location.pathname.split('/')[2];
    const { productData, fetchPreviousSearches,setProductData } = useContext(Context);
    
    
    
    const fetchProduct = async (email, barcode, setProductData) => {
        try {
            const response = await fetch(`http://localhost:5000/get-product?email=${email}&barcode=${barcode}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            console.log("reload",data);
            
            await setProductData(data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    if(!productData) fetchProduct(email,barcode,setProductData);
    
    
    
    
    // console.log(productData);
    


  return (
    < >
      <Accordion allowMultiple>
        <div style={{ display: "flex", justifyContent: 'center', flexDirection: "column" }}>
          <AchordianItems data={productData} type={"Nutritional Information"} />
          <AchordianItems data={productData} type={"Ingredients used"} />
          <AchordianItems data={productData} type={"Nutrition Levels"} />
          <AchordianItems data={productData} type={"Discription"} />
        </div>
      </Accordion>
    </>
  );
}

export default Analysis;
