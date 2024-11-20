import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Container,
  NumberInput,
  NumberInputField,
  useToast,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

// Lista inicial de marcas
const initialBrands = [
  'Personalizado',
  'Abbott',
  'Pfizer',
  'Johnson & Johnson',
  'Roche',
  'Novartis',
  'Medtronic',
  'BD (Becton Dickinson)',
  'Baxter',
  'Boston Scientific',
  'GE Healthcare',
];

const units = ['UN', 'CX', 'PCT', 'KG', 'L'];

const BRANDS_KEY = 'medstock_brands';

const AddProduct = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [customBrand, setCustomBrand] = useState('');
  const [brands, setBrands] = useState(() => {
    const savedBrands = localStorage.getItem(BRANDS_KEY);
    return savedBrands ? JSON.parse(savedBrands) : initialBrands;
  });
  
  const [formData, setFormData] = useState({
    description: '',
    brand: '',
    stock: '',
    unit: 'UN',
    selling_price: '',
  });

  useEffect(() => {
    localStorage.setItem(BRANDS_KEY, JSON.stringify(brands));
  }, [brands]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (e) => {
    const selectedBrand = e.target.value;
    setIsCustomBrand(selectedBrand === 'Personalizado');
    if (selectedBrand === 'Personalizado') {
      setFormData(prev => ({ ...prev, brand: customBrand }));
    } else {
      setFormData(prev => ({ ...prev, brand: selectedBrand }));
      setCustomBrand('');
    }
  };

  const handleCustomBrandChange = (e) => {
    const value = e.target.value;
    setCustomBrand(value);
    setFormData(prev => ({ ...prev, brand: value }));
  };

  const addCustomBrand = (brandName) => {
    if (!brands.includes(brandName) && brandName !== 'Personalizado') {
      setBrands(prev => [...prev, brandName].sort());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Se for uma marca personalizada, adiciona à lista
      if (isCustomBrand && formData.brand) {
        addCustomBrand(formData.brand);
      }

      const { error } = await supabase.from('products').insert([
        {
          ...formData,
          selling_price: parseFloat(formData.selling_price),
          stock: parseInt(formData.stock),
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Produto adicionado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
    } catch (error) {
      toast({
        title: 'Erro ao adicionar produto',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Container maxW="container.md">
        <Heading size="lg" mb={6}>Adicionar Novo Produto</Heading>
        
        <Box as="form" onSubmit={handleSubmit} bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Descrição</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Digite a descrição do produto"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Marca</FormLabel>
              <Select
                name="brand"
                value={isCustomBrand ? 'Personalizado' : formData.brand}
                onChange={handleBrandChange}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Select>
              {isCustomBrand && (
                <Input
                  mt={2}
                  placeholder="Digite a marca personalizada"
                  value={customBrand}
                  onChange={handleCustomBrandChange}
                />
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  name="stock"
                  value={formData.stock}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Digite a quantidade"
                />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Unidade</FormLabel>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Valor de Venda (R$)</FormLabel>
              <NumberInput min={0} precision={2}>
                <NumberInputField
                  name="selling_price"
                  value={formData.selling_price}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="0,00"
                />
              </NumberInput>
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg" mt={4}>
              Adicionar Produto
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default AddProduct;
