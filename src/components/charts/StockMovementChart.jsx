import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, useColorModeValue } from '@chakra-ui/react';

const StockMovementChart = ({ data }) => {
  const lineColor = useColorModeValue('brand.500', 'brand.200');
  const gridColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box h="400px" w="100%">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="date" stroke={useColorModeValue('gray.600', 'gray.400')} />
          <YAxis stroke={useColorModeValue('gray.600', 'gray.400')} />
          <Tooltip
            contentStyle={{
              backgroundColor: useColorModeValue('white', 'gray.800'),
              border: '1px solid #ccc',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_entries"
            name="Entradas"
            stroke="green"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="total_exits"
            name="Saídas"
            stroke="red"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="net_movement"
            name="Saldo"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StockMovementChart;
