import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Code,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';

const UserManual = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box p={4} maxW="1200px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Heading size="xl">Manual do Usuário - MedStock Pro</Heading>

        <Box bg={bgColor} p={6} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size="md">Introdução</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text>
                  O MedStock Pro é um sistema de gestão de estoque desenvolvido especialmente
                  para produtos médicos. Com ele, você pode:
                </Text>
                <List spacing={3} mt={4}>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    Gerenciar produtos e seu estoque
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    Registrar entradas e saídas
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    Visualizar relatórios e gráficos
                  </ListItem>
                  <ListItem>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    Exportar dados para PDF e Excel
                  </ListItem>
                </List>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size="md">Produtos</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Heading size="sm" mb={2}>
                      Cadastro de Produtos
                    </Heading>
                    <Text>
                      Para cadastrar um novo produto, clique no botão "Adicionar Produto" e
                      preencha os campos:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• Código: identificador único do produto</ListItem>
                      <ListItem>• Descrição: nome ou descrição do produto</ListItem>
                      <ListItem>• Marca: fabricante do produto</ListItem>
                      <ListItem>• Unidade: unidade de medida</ListItem>
                      <ListItem>• Valor de Venda: preço unitário</ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Filtros Avançados
                    </Heading>
                    <Text>
                      Use os filtros avançados para encontrar produtos específicos:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• Filtro por marca</ListItem>
                      <ListItem>• Faixa de preço</ListItem>
                      <ListItem>• Nível de estoque</ListItem>
                      <ListItem>• Produtos sem estoque ou com estoque baixo</ListItem>
                    </List>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size="md">Movimentações</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Heading size="sm" mb={2}>
                      Registrar Movimentação
                    </Heading>
                    <Text>
                      Para registrar uma movimentação de estoque:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>1. Localize o produto na lista</ListItem>
                      <ListItem>2. Clique no ícone de movimentação</ListItem>
                      <ListItem>3. Selecione o tipo (Entrada ou Saída)</ListItem>
                      <ListItem>4. Digite a quantidade</ListItem>
                      <ListItem>5. Adicione uma descrição</ListItem>
                      <ListItem>6. Confirme a operação</ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Histórico
                    </Heading>
                    <Text>
                      O histórico de movimentações pode ser visualizado:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• Na aba "Histórico" do modal de movimentação</ListItem>
                      <ListItem>• No Dashboard, com gráficos e estatísticas</ListItem>
                      <ListItem>• Nos relatórios exportados</ListItem>
                    </List>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size="md">Dashboard</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Heading size="sm" mb={2}>
                      Visão Geral
                    </Heading>
                    <Text>
                      O Dashboard apresenta informações importantes:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• Valor total em estoque</ListItem>
                      <ListItem>• Total de produtos cadastrados</ListItem>
                      <ListItem>• Número de movimentações no período</ListItem>
                      <ListItem>• Variação do estoque</ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Gráficos
                    </Heading>
                    <Text>
                      Analise os dados através dos gráficos:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• Movimentação de Estoque: entradas, saídas e saldo</ListItem>
                      <ListItem>• Valor em Estoque por Marca: distribuição do capital</ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Exportação
                    </Heading>
                    <Text>
                      Exporte os dados em diferentes formatos:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• PDF: relatórios formatados para impressão</ListItem>
                      <ListItem>• Excel: planilhas para análise detalhada</ListItem>
                    </List>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Heading size="md">Dicas e Atalhos</Heading>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Heading size="sm" mb={2}>
                      Pesquisa Rápida
                    </Heading>
                    <Text>
                      Use a barra de pesquisa para encontrar produtos por:
                    </Text>
                    <List spacing={2} mt={2}>
                      <ListItem>• Código</ListItem>
                      <ListItem>• Descrição</ListItem>
                      <ListItem>• Marca</ListItem>
                    </List>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Tema Escuro
                    </Heading>
                    <Text>
                      Alterne entre os temas claro e escuro através do ícone no canto superior
                      direito da tela.
                    </Text>
                  </Box>

                  <Box>
                    <Heading size="sm" mb={2}>
                      Responsividade
                    </Heading>
                    <Text>
                      O sistema é totalmente responsivo e pode ser acessado em diferentes
                      dispositivos, como smartphones e tablets.
                    </Text>
                  </Box>
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      </VStack>
    </Box>
  );
};

export default UserManual;
