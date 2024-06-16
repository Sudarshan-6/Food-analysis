import React, { useContext, useEffect } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Heading,
} from '@chakra-ui/react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import NutritionalInfo from './NutritionalInfo'
import Ingredients from './Ingredients'
import NutrientLevels from './NutrientLevels'
import Context from './Context'
import Discription from './Discription';

function AchordianItems({data,type}) {
    console.log("data",data);
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
                        <div className="accordian-item">

                        <Box p={4}>
                            {type === "Nutritional Information" ? 
                            <NutritionalInfo nutriments={data && data.nutriments}/> : 
                            type === "Ingredients used" ? 
                            <Ingredients ingredients_hierarchy={data && data.ingredients_hierarchy}/>:
                            type === "Discription" ?
                            <Discription data ={data && data.discription}/> :
                            <NutrientLevels nutrientLevels={data && data.nutrient_levels }/>}
                        </Box>
                        </div>
                    </AccordionPanel>
                </>
            )}
        </AccordionItem>
    )
}

function Analysis() {
    const { productData,fetchPreviousSearches} = useContext(Context);


    useEffect(() => {
        fetchPreviousSearches();
      }, []);
    console.log(productData);

    return (
            < >
                <Accordion allowMultiple>
                    <AchordianItems data={productData} type={"Nutritional Information"}/>
                    <AchordianItems data={productData} type={"Ingredients used"}/>
                    <AchordianItems data={productData} type={"Nutrition Levels"}/> 
                    <AchordianItems data={productData} type={"Discription"} />
                </Accordion>
            </>
    )
}

export default Analysis