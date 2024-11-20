import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ExportButton = ({ data, filename = 'export', columns }) => {
  const toast = useToast();

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.autoTable({
        head: [columns.map((col) => col.header)],
        body: data.map((row) =>
          columns.map((col) => {
            const value = row[col.accessor];
            if (typeof col.format === 'function') {
              return col.format(value);
            }
            return value;
          })
        ),
      });
      doc.save(`${filename}.pdf`);

      toast({
        title: 'PDF exportado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar PDF',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(
        data.map((row) =>
          columns.reduce((acc, col) => {
            const value = row[col.accessor];
            acc[col.header] = typeof col.format === 'function' ? col.format(value) : value;
            return acc;
          }, {})
        )
      );

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${filename}.xlsx`);

      toast({
        title: 'Excel exportado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar Excel',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="blue">
        Exportar
      </MenuButton>
      <MenuList>
        <MenuItem onClick={exportToPDF}>Exportar como PDF</MenuItem>
        <MenuItem onClick={exportToExcel}>Exportar como Excel</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ExportButton;
