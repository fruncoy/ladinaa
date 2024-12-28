import { jsPDF } from 'jspdf';
import { PDF_CONFIG } from '../config';

export function addDocumentFooter(pdf: jsPDF, yPos: number): void {
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = PDF_CONFIG.margins.left;
  const footerHeight = 40;
  const footerY = pageHeight - footerHeight - PDF_CONFIG.margins.bottom;

  // Add spacer before footer
  pdf.setDrawColor(229, 231, 235);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(
    margin,
    footerY,
    pageWidth - (margin * 2),
    footerHeight,
    3,
    3,
    'FD'
  );

  // Thank you message
  pdf.setTextColor(0);
  pdf.setFontSize(14);
  pdf.text(
    'Thank You for Your Business!',
    pageWidth / 2,
    footerY + 15,
    { align: 'center' }
  );

  // Contact info
  pdf.setTextColor(100);
  pdf.setFontSize(10);
  pdf.text(
    'If you have any questions, please contact us at info@ladinatravelsafaris.com',
    pageWidth / 2,
    footerY + 25,
    { align: 'center' }
  );
}