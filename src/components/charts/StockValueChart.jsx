import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

const StockValueChart = ({ data }) => {
  const barColor = useColorModeValue('brand.500', 'brand.200');
  const gridColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box h="400px" w="100%">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="brand"
            stroke={useColorModeValue('gray.600', 'gray.400')}
          />
          <YAxis
            stroke={useColorModeValue('gray.600', 'gray.400')}
            tickFormatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            }
            contentStyle={{
              backgroundColor: useColorModeValue('white', 'gray.800'),
              border: '1px solid #ccc',
            }}
          />
          <Legend />
          <Bar
            dataKey="total_value"
            name="Valor em Estoque"
            fill={barColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockValueChart;
