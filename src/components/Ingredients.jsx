import React from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

const Ingredients = ({ ingredients_hierarchy }) => {
  const filteredIngredients = ingredients_hierarchy
    ? ingredients_hierarchy.filter(ingredient => /^en:/.test(ingredient))
    : [];

  return (
    <Box padding="4" maxW="6xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg" mt="4">
      <SimpleGrid columns={[2, null, 4]} spacing="4">
        {filteredIngredients.map((ingredient, index) => {
          const formattedIngredient = ingredient.replace('en:', '').replace(/-/g, ' ').toUpperCase();
          return (
            <Box
              key={index}
              textAlign="center"
              padding="2"
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
              backgroundColor="teal.50"
            >
              <Text fontWeight="bold" color="teal.700">{formattedIngredient}</Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Ingredients;
