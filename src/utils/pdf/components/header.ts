import { jsPDF } from 'jspdf';
import { PDF_CONFIG } from '../config';

export async function addHeader(pdf: jsPDF): Promise<number> {
  const pageWidth = pdf.internal.pageSize.width;
  const margin = PDF_CONFIG.margins.left;
  let yPos = PDF_CONFIG.margins.top;

  // Company info
  pdf.setFontSize(PDF_CONFIG.fonts.normal);
  pdf.setTextColor(100);

  // Left side - Email and website
  pdf.text('info@ladinatravelsafaris.com', margin, yPos);
  pdf.text('ladinatravelsafaris.com', margin, yPos + 5);

  // Center logo
  try {
    const logoSize = PDF_CONFIG.logo.size;
    const logoX = (pageWidth - logoSize) / 2;
    pdf.addImage('/logo.png', 'PNG', logoX, yPos - 5, logoSize, logoSize);
  } catch (error) {
    console.error('Failed to load logo:', error);
  }

  // Right side - Location and phone
  const rightMargin = pageWidth - margin;
  pdf.text('Kefan Building, Woodavenue Road', rightMargin, yPos, { align: 'right' });
  pdf.text('(254) 728 309 380', rightMargin, yPos + 5, { align: 'right' });

  return yPos + PDF_CONFIG.logo.size + 5;
}