import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Layout from './components/Layout';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import UserManual from './pages/UserManual';
import Dashboard from './pages/Dashboard';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/manual" element={<UserManual />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

export default App;
