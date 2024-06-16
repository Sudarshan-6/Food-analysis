import React from 'react';
import { Box, Text, SimpleGrid } from '@chakra-ui/react';

const NutritionalInfo = ({ nutriments }) => {

  const relevantNutrients = nutriments && Object.entries(nutriments).filter(
    ([key, value]) => key.endsWith('_value') && !key.endsWith('_serving') && !key.endsWith('_100g')
  );

  const formattedNutrients = relevantNutrients && relevantNutrients.map(([key, value]) => {
    const unitKey = key.replace('_value', '_unit');
    return {
      name: key.replace('_value', '').replace(/-/g, ' ').toUpperCase(),
      value,
      unit: nutriments[unitKey],
    };
  });

  return (
    <Box padding="4" maxW="6xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
      <SimpleGrid columns={[2, null, 4]} spacing="4">
        {formattedNutrients && formattedNutrients.map((nutrient, index) => (
          <Box
            key={index}
            textAlign="center"
            padding="2"
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
            backgroundColor="blue.50"
          >
            <Text fontWeight="bold" color="blue.700">{nutrient.name}</Text>
            <Text>{nutrient.value} {nutrient.unit}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NutritionalInfo;
