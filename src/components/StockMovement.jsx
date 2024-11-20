import React, { useState, useEffect } from 'react';
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
  VStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Box,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';

const StockMovement = ({ isOpen, onClose, product, onStockUpdate }) => {
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('entrada');
  const [description, setDescription] = useState('');
  const [movements, setMovements] = useState([]);
  const toast = useToast();

  useEffect(() => {
    if (product?.id) {
      fetchMovements();
    }
  }, [product]);

  const fetchMovements = async () => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMovements(data || []);
    } catch (error) {
      toast({
        title: 'Erro ao carregar movimentos',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const numQuantity = parseFloat(quantity);
      if (!numQuantity || numQuantity <= 0) {
        throw new Error('Quantidade deve ser maior que zero');
      }

      // Calculate new stock based on movement type
      const stockChange = type === 'entrada' ? numQuantity : -numQuantity;
      const newStock = product.stock + stockChange;

      if (newStock < 0) {
        throw new Error('Estoque não pode ficar negativo');
      }

      // Update product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Record movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert([
          {
            product_id: product.id,
            type,
            quantity: numQuantity,
            description,
            previous_stock: product.stock,
            new_stock: newStock,
          },
        ]);

      if (movementError) throw movementError;

      toast({
        title: 'Movimento registrado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onStockUpdate();
      fetchMovements();
      setQuantity('');
      setDescription('');
      setType('entrada');
    } catch (error) {
      toast({
        title: 'Erro ao registrar movimento',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Movimento de Estoque - {product?.description}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>Novo Movimento</Tab>
              <Tab>Histórico</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Tipo de Movimento</FormLabel>
                      <Box display="flex" gap={4}>
                        <Button
                          colorScheme="green"
                          width="100%"
                          onClick={() => setType('entrada')}
                          isActive={type === 'entrada'}
                        >
                          Entrada
                        </Button>
                        <Button
                          colorScheme="red"
                          width="100%"
                          onClick={() => setType('saida')}
                          isActive={type === 'saida'}
                        >
                          Saída
                        </Button>
                      </Box>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Quantidade</FormLabel>
                      <NumberInput min={0}>
                        <NumberInputField
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="Digite a quantidade"
                        />
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Descrição</FormLabel>
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Digite o motivo do movimento"
                      />
                    </FormControl>

                    <Button colorScheme="blue" type="submit" width="100%">
                      Confirmar
                    </Button>
                  </VStack>
                </form>
              </TabPanel>

              <TabPanel>
                {movements.length > 0 ? (
                  <Box overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Data</Th>
                          <Th>Tipo</Th>
                          <Th isNumeric>Quantidade</Th>
                          <Th>Descrição</Th>
                          <Th isNumeric>Estoque Anterior</Th>
                          <Th isNumeric>Novo Estoque</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {movements.map((movement) => (
                          <Tr key={movement.id}>
                            <Td>{formatDate(movement.created_at)}</Td>
                            <Td>
                              <Text
                                color={movement.type === 'entrada' ? 'green.500' : 'red.500'}
                                fontWeight="bold"
                              >
                                {movement.type === 'entrada' ? 'Entrada' : 'Saída'}
                              </Text>
                            </Td>
                            <Td isNumeric>{movement.quantity}</Td>
                            <Td>{movement.description}</Td>
                            <Td isNumeric>{movement.previous_stock}</Td>
                            <Td isNumeric>{movement.new_stock}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                ) : (
                  <Text>Nenhum movimento registrado</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StockMovement;
