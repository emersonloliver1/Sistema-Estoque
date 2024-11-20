import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  VStack,
  HStack,
  Input,
  Select,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
} from '@chakra-ui/react';

const AdvancedFilters = ({
  filters,
  setFilters,
  brands,
  maxPrice,
  minPrice,
}) => {
  const handlePriceRangeChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: range[0],
      maxPrice: range[1],
    }));
  };

  const handleStockRangeChange = (range) => {
    setFilters((prev) => ({
      ...prev,
      minStock: range[0],
      maxStock: range[1],
    }));
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Filtros Avançados
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={2}>Marca</Text>
              <Select
                value={filters.brand}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, brand: e.target.value }))
                }
                placeholder="Todas as marcas"
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Select>
            </Box>

            <Box>
              <Text mb={2}>Faixa de Preço</Text>
              <HStack spacing={4}>
                <NumberInput
                  value={filters.minPrice}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, minPrice: Number(value) }))
                  }
                  min={minPrice}
                  max={maxPrice}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text>até</Text>
                <NumberInput
                  value={filters.maxPrice}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, maxPrice: Number(value) }))
                  }
                  min={minPrice}
                  max={maxPrice}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              <RangeSlider
                aria-label={['min', 'max']}
                min={minPrice}
                max={maxPrice}
                value={[filters.minPrice, filters.maxPrice]}
                onChange={handlePriceRangeChange}
                mt={2}
              >
                <RangeSliderTrack>
                  <RangeSliderFilledTrack />
                </RangeSliderTrack>
                <RangeSliderThumb index={0} />
                <RangeSliderThumb index={1} />
              </RangeSlider>
            </Box>

            <Box>
              <Text mb={2}>Estoque</Text>
              <HStack spacing={4}>
                <NumberInput
                  value={filters.minStock}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, minStock: Number(value) }))
                  }
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text>até</Text>
                <NumberInput
                  value={filters.maxStock}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, maxStock: Number(value) }))
                  }
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
            </Box>

            <Box>
              <Text mb={2}>Opções</Text>
              <VStack align="start">
                <Checkbox
                  isChecked={filters.showOutOfStock}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      showOutOfStock: e.target.checked,
                    }))
                  }
                >
                  Mostrar produtos sem estoque
                </Checkbox>
                <Checkbox
                  isChecked={filters.showLowStock}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      showLowStock: e.target.checked,
                    }))
                  }
                >
                  Mostrar produtos com estoque baixo
                </Checkbox>
              </VStack>
            </Box>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedFilters;
