import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const NutrientLevel = ({ nutrient, level }) => {
  // Function to determine color based on nutrient level
  const getColor = (level) => {
    switch (level) {
      case 'low':
        return 'green.400';
      case 'moderate':
        return 'yellow.400';
      case 'high':
        return 'red.400';
      default:
        return 'gray.400';
    }
  };

  return (
    <Box
      padding="2"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      backgroundColor={getColor(level)}
      margin="2"
      width={{ base: '100%', md: '200px' }} // Set a fixed width for each box
      textAlign="center"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontWeight="bold" color="white" fontSize={{ base: 'sm', md: 'md' }}>{nutrient.toUpperCase()}</Text>
      <Text color="white" fontSize={{ base: 'sm', md: 'md' }}>{level.toUpperCase()}</Text>
    </Box>
  );
};

const NutrientLevels = ({ nutrientLevels }) => {
  return (
    <Box padding="4" maxW="6xl" borderWidth="1px" borderRadius="lg" overflow="hidden" boxShadow="lg">
      <Flex flexWrap="wrap" justifyContent="center">
        {nutrientLevels && Object.entries(nutrientLevels).map(([nutrient, level], index) => (
          <NutrientLevel key={index} nutrient={nutrient} level={level} />
        ))}
      </Flex>
    </Box>
  );
};

export default NutrientLevels;
