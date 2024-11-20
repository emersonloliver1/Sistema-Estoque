import { Box, Container, Text, Link, IconButton, useColorMode, HStack, Tooltip } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { QuestionIcon, MoonIcon, SunIcon, ViewIcon } from '@chakra-ui/icons';

const Layout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.900'}>
      <Box 
        as="header" 
        bg={colorMode === 'light' ? 'white' : 'gray.800'} 
        py={4} 
        px={8} 
        boxShadow="sm"
        borderBottom="1px"
        borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
      >
        <Container maxW="container.xl" display="flex" justifyContent="space-between" alignItems="center">
          <Link
            as={RouterLink}
            to="/"
            fontSize="xl"
            fontWeight="bold"
            color={colorMode === 'light' ? 'blue.500' : 'blue.300'}
            _hover={{ textDecoration: 'none', color: colorMode === 'light' ? 'blue.600' : 'blue.400' }}
          >
            MedStock Pro
          </Link>
          
          <HStack spacing={4}>
            <Tooltip label="Dashboard" placement="bottom">
              <Link as={RouterLink} to="/dashboard">
                <IconButton
                  aria-label="Dashboard"
                  icon={<><ViewIcon /><Text ml={2} display={{ base: 'none', md: 'inline' }}>Dashboard</Text></>}
                  variant="ghost"
                  color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                  _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
                  size="md"
                />
              </Link>
            </Tooltip>

            <Tooltip label="Manual do Usuário" placement="bottom">
              <Link as={RouterLink} to="/manual">
                <IconButton
                  aria-label="Manual do Usuário"
                  icon={<><QuestionIcon /><Text ml={2} display={{ base: 'none', md: 'inline' }}>Manual</Text></>}
                  variant="ghost"
                  color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                  _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
                  size="md"
                />
              </Link>
            </Tooltip>

            <Tooltip label={`Mudar para Tema ${colorMode === 'light' ? 'Escuro' : 'Claro'}`} placement="bottom">
              <IconButton
                aria-label="Alternar Tema"
                icon={<>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}<Text ml={2} display={{ base: 'none', md: 'inline' }}>{colorMode === 'light' ? 'Escuro' : 'Claro'}</Text></>}
                onClick={toggleColorMode}
                variant="ghost"
                color={colorMode === 'light' ? 'gray.600' : 'gray.200'}
                _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
                size="md"
              />
            </Tooltip>
          </HStack>
        </Container>
      </Box>

      <Box as="main" py={8}>
        <Container maxW="container.xl">
          {children}
        </Container>
      </Box>

      <Box as="footer" py={4} textAlign="center" borderTop="1px" borderColor="gray.200">
        <Text color="gray.500">
          Criado por Emerson Oliveira
        </Text>
      </Box>
    </Box>
  );
};

export default Layout;
