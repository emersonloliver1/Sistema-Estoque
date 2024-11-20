import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Select,
  useColorModeValue,
  HStack,
  useToast
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';
import StockMovementChart from '../components/charts/StockMovementChart';
import StockValueChart from '../components/charts/StockValueChart';
import ExportButton from '../components/exports/ExportButton';

const Dashboard = () => {
  const [period, setPeriod] = useState('30');
  const [movementData, setMovementData] = useState([]);
  const [stockValueData, setStockValueData] = useState([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    totalProducts: 0,
    totalMovements: 0,
    lowStockCount: 0
  });

  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.700', 'white');
  const statBg = useColorModeValue('blue.50', 'blue.900');
  const statColor = useColorModeValue('blue.600', 'blue.200');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      // Buscar valor total em estoque
      const { data: totalValueData, error: totalValueError } = await supabase
        .rpc('calculate_total_stock_value');
      
      if (totalValueError) throw totalValueError;

      // Buscar total de produtos
      const { count: totalProducts, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (productsError) throw productsError;

      // Buscar total de movimentações no período
      const { data: movementsData, error: movementsError } = await supabase
        .from('stock_movements')
        .select('*')
        .gte('created_at', new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString());

      if (movementsError) throw movementsError;

      // Buscar produtos com estoque baixo
      const { data: lowStockData, error: lowStockError } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 10); // Considerando estoque baixo menor que 10 unidades

      if (lowStockError) throw lowStockError;

      setStats({
        totalValue: totalValueData?.[0]?.total_value || 0,
        totalProducts: totalProducts || 0,
        totalMovements: movementsData?.length || 0,
        lowStockCount: lowStockData?.length || 0
      });

      // Buscar dados para os gráficos
      const { data: stockValueData, error: stockValueError } = await supabase
        .from('products')
        .select('brand, stock, selling_price');

      if (stockValueError) throw stockValueError;

      const brandValues = stockValueData.reduce((acc, product) => {
        const value = product.stock * product.selling_price;
        acc[product.brand] = (acc[product.brand] || 0) + value;
        return acc;
      }, {});

      setStockValueData(
        Object.entries(brandValues).map(([brand, value]) => ({
          brand,
          value
        }))
      );

      // Buscar movimentações
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));

      const { data: movements, error: movementError } = await supabase
        .rpc('get_movements_by_period', {
          start_date: startDate.toISOString(),
          end_date: new Date().toISOString(),
        });

      if (movementError) throw movementError;
      setMovementData(movements);

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível carregar os dados do dashboard.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const columns = [
    { header: 'Data', accessor: 'date' },
    { header: 'Entradas', accessor: 'total_entries' },
    { header: 'Saídas', accessor: 'total_exits' },
    { header: 'Saldo', accessor: 'net_movement' },
  ];

  return (
    <Box p={4}>
      <Grid templateColumns="repeat(4, 1fr)" gap={4} mb={8}>
        <GridItem>
          <Card bg={statBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Valor Total em Estoque</StatLabel>
                <StatNumber color={statColor}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(stats.totalValue)}
                </StatNumber>
                <StatHelpText color={textColor}>+23% desde o último mês</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg={statBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Total de Produtos</StatLabel>
                <StatNumber color={statColor}>{stats.totalProducts}</StatNumber>
                <StatHelpText color={textColor}>12 novos produtos</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg={statBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Movimentações no Período</StatLabel>
                <StatNumber color={statColor}>{stats.totalMovements}</StatNumber>
                <StatHelpText color={textColor}>Últimos 30 dias</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card bg={statBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Produtos com Estoque Baixo</StatLabel>
                <StatNumber color={statColor}>{stats.lowStockCount}</StatNumber>
                <StatHelpText color="red.400">
                  {stats.lowStockCount > 0 ? 'Atenção necessária' : 'Estoque adequado'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="md" color={headingColor}>Movimentação de Estoque</Heading>
                <HStack>
                  <Select maxW="200px" value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option value="7">Últimos 7 dias</option>
                    <option value="30">Últimos 30 dias</option>
                    <option value="90">Últimos 90 dias</option>
                  </Select>
                  <ExportButton
                    data={movementData}
                    filename="movimentacoes"
                    columns={columns}
                  />
                </HStack>
              </Box>
            </CardHeader>
            <CardBody>
              <StockMovementChart data={movementData} />
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Heading size="md" color={headingColor}>Valor em Estoque por Marca</Heading>
                <Select maxW="200px" defaultValue="value">
                  <option value="value">Por Valor</option>
                  <option value="quantity">Por Quantidade</option>
                </Select>
              </Box>
            </CardHeader>
            <CardBody>
              <StockValueChart data={stockValueData} />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;
