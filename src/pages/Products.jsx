import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Heading,
  HStack,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BsSearch, BsArrowLeftRight, BsPencilSquare, BsTrash } from 'react-icons/bs';
import StockMovement from '../components/StockMovement';
import EditProduct from '../components/EditProduct';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar produtos',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleMovementClick = (product) => {
    setSelectedProduct(product);
    setIsMovementModalOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    onDeleteAlertOpen();
  };

  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);

      if (error) throw error;

      toast({
        title: 'Produto excluído com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchProducts();
      onDeleteAlertClose();
    } catch (error) {
      toast({
        title: 'Erro ao excluir produto',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const tableBg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box p={4}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Produtos</Heading>
        <Button
          as={RouterLink}
          to="/add-product"
          colorScheme="blue"
        >
          Adicionar Produto
        </Button>
      </HStack>

      <Box mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            placeholder='Pesquisar por nome ou marca'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      <Box bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
        <Table variant="simple">
          <Thead bg={headerBg}>
            <Tr>
              <Th color={textColor}>Código</Th>
              <Th color={textColor}>Descrição</Th>
              <Th color={textColor}>Marca</Th>
              <Th color={textColor}>Unidade</Th>
              <Th color={textColor} isNumeric>Valor</Th>
              <Th color={textColor} isNumeric>Estoque</Th>
              <Th color={textColor}>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.map((product) => (
              <Tr 
                key={product.id}
                _hover={{ bg: hoverBg }}
                bg={tableBg}
              >
                <Td color={textColor}>{product.code}</Td>
                <Td color={textColor}>{product.description}</Td>
                <Td color={textColor}>{product.brand}</Td>
                <Td color={textColor}>{product.unit}</Td>
                <Td color={textColor} isNumeric>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.selling_price)}
                </Td>
                <Td 
                  color={product.stock < 10 ? 'red.400' : textColor} 
                  isNumeric
                >
                  {product.stock}
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<BsArrowLeftRight />}
                      colorScheme="purple"
                      aria-label="Movimento"
                      onClick={() => handleMovementClick(product)}
                      size="sm"
                    />
                    <IconButton
                      icon={<BsPencilSquare />}
                      colorScheme="blue"
                      aria-label="Editar"
                      onClick={() => handleEditClick(product)}
                      size="sm"
                    />
                    <IconButton
                      icon={<BsTrash />}
                      colorScheme="red"
                      aria-label="Excluir"
                      onClick={() => handleDeleteClick(product)}
                      size="sm"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <StockMovement
        isOpen={isMovementModalOpen}
        onClose={() => {
          setIsMovementModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onStockUpdate={fetchProducts}
      />

      <EditProduct
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onUpdate={fetchProducts}
      />

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Produto
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir o produto "{selectedProduct?.description}"?
              Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Products;
