import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

const EditProduct = ({ isOpen, onClose, product, onUpdate }) => {
  const [formData, setFormData] = React.useState({
    code: '',
    description: '',
    brand: '',
    unit: 'UN',
    selling_price: '',
  });
  const [isCustomBrand, setIsCustomBrand] = React.useState(false);
  const [customBrand, setCustomBrand] = React.useState('');
  const [brands, setBrands] = React.useState(() => {
    const savedBrands = localStorage.getItem('medstock_brands');
    return savedBrands ? JSON.parse(savedBrands) : [
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
  });
  const toast = useToast();

  React.useEffect(() => {
    if (product) {
      setFormData({
        code: product.code || '',
        description: product.description || '',
        brand: product.brand || '',
        unit: product.unit || 'UN',
        selling_price: product.selling_price?.toString() || '',
      });
      setIsCustomBrand(!brands.includes(product.brand));
      setCustomBrand(brands.includes(product.brand) ? '' : product.brand);
    }
  }, [product, brands]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!formData.code || !formData.description || !formData.brand || !formData.selling_price) {
        throw new Error('Todos os campos são obrigatórios');
      }

      // Add custom brand to the list if it's new
      if (isCustomBrand && customBrand && !brands.includes(customBrand)) {
        const newBrands = [...brands, customBrand].sort();
        setBrands(newBrands);
        localStorage.setItem('medstock_brands', JSON.stringify(newBrands));
      }

      // Update product in database
      const { error } = await supabase
        .from('products')
        .update({
          code: formData.code,
          description: formData.description,
          brand: isCustomBrand ? customBrand : formData.brand,
          unit: formData.unit,
          selling_price: parseFloat(formData.selling_price),
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Produto atualizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar produto',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Produto</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Código</FormLabel>
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Digite o código"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Digite a descrição"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Marca</FormLabel>
                <Select
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
                <FormLabel>Unidade</FormLabel>
                <Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                >
                  <option value="UN">Unidade</option>
                  <option value="CX">Caixa</option>
                  <option value="PCT">Pacote</option>
                  <option value="KG">Quilograma</option>
                  <option value="L">Litro</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Preço de Venda</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField
                    name="selling_price"
                    value={formData.selling_price}
                    onChange={handleInputChange}
                    placeholder="Digite o preço de venda"
                  />
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Salvar
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditProduct;
