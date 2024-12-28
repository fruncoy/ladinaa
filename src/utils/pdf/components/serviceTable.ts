import { jsPDF } from 'jspdf';
import { formatCurrency } from '../../currency';
import { formatDate } from '../../date';
import { PDF_CONFIG } from '../config';
import type { Document, VehicleItem } from '../../../types';

export function addServiceTable(pdf: jsPDF, document: Document, items: VehicleItem[], yPos: number): number {
  const tableData = items.map((item, index) => [
    index + 1,
    {
      content: [
        { text: item.vehicle_type, styles: { textColor: [0, 166, 81], fontStyle: 'bold' } },
        item.additional_info ? { text: item.additional_info, fontSize: PDF_CONFIG.fonts.small } : '',
        { text: `${formatDate(item.from_date)} - ${formatDate(item.to_date)}`, fontSize: PDF_CONFIG.fonts.small }
      ]
    },
    item.quantity,
    formatCurrency(item.price, document.currency),
    formatCurrency(item.quantity * item.price, document.currency)
  ]);

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  (pdf as any).autoTable({
    startY: yPos,
    head: [['#', 'Service Details', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    foot: [[
      '',
      { content: 'Total:', styles: { halign: 'right', fontStyle: 'bold' } },
      '',
      '',
      { content: formatCurrency(totalAmount, document.currency), styles: { fontStyle: 'bold' } }
    ]],
    theme: 'grid',
    styles: {
      fontSize: PDF_CONFIG.fonts.normal,
      cellPadding: 4,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: PDF_CONFIG.margins.left, right: PDF_CONFIG.margins.right }
  });

  return (pdf as any).lastAutoTable.finalY + PDF_CONFIG.content.spacing.section;
}