import { jsPDF } from 'jspdf';
import { formatCurrency } from '../../currency';
import { formatDate } from '../../date';
import { loadImage } from '../../images';
import { BANK_DETAILS } from '../../constants/bankDetails';
import type { Document, VehicleItem } from '../../../types';

export async function generateReceiptPDF(document: Document, items: VehicleItem[]) {
  // Initialize PDF in landscape A5 with larger margins
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a5',
    compress: false
  });

  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 15;
  let yPos = margin;

  // Add Logo as Watermark
  try {
    const logo = await loadImage('/Logo.png');
    const logoSize = 50;
    const logoX = (pageWidth - logoSize) / 2;
    const logoY = (pageHeight - logoSize) / 2;
    pdf.saveGraphicsState();
    pdf.setGState(new pdf.GState({ opacity: 0.15 }));
    pdf.addImage(logo, 'PNG', logoX, logoY, logoSize, logoSize);
    pdf.restoreGraphicsState();
  } catch (error) {
    console.error('Failed to load logo:', error);
  }

  // Header
  pdf.setFontSize(24);
  pdf.setTextColor(0);
  pdf.text('RECEIPT', pageWidth/2, yPos, { align: 'center' });

  yPos += 20;

  // Two Column Layout
  const colWidth = (pageWidth - (margin * 3)) / 2;
  const leftX = margin;
  const rightX = margin * 2 + colWidth;

  // Left Column
  pdf.setFontSize(11);
  
  // Date
  pdf.text('Date:', leftX, yPos);
  pdf.setLineWidth(0.1);
  pdf.setDrawColor(200);
  pdf.line(leftX + 25, yPos, leftX + colWidth, yPos);
  pdf.text(formatDate(document.created_at), leftX + 30, yPos);
  
  yPos += 15;

  // Received From
  pdf.text('Received From:', leftX, yPos);
  pdf.line(leftX + 25, yPos, leftX + colWidth, yPos);
  pdf.text(document.client_name, leftX + 30, yPos);
  
  yPos += 15;

  // Amount
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  pdf.text('Amount:', leftX, yPos);
  pdf.line(leftX + 25, yPos, leftX + colWidth, yPos);
  pdf.text(formatCurrency(totalAmount, document.currency), leftX + 30, yPos);
  
  yPos += 15;

  // For
  pdf.text('For:', leftX, yPos);
  pdf.line(leftX + 25, yPos, leftX + colWidth, yPos);
  let serviceYPos = yPos;
  items.forEach((item, index) => {
    const text = item.from_date && item.to_date
      ? `${item.vehicle_type} (${formatDate(item.from_date)} - ${formatDate(item.to_date)})`
      : item.vehicle_type;
    pdf.text(text, leftX + 30, serviceYPos + (index * 6));
  });

  // Right Column
  yPos = margin + 20;

  // Payment Method
  pdf.text('Paid By:', rightX, yPos);
  yPos += 10;

  ['Cash', 'Cheque', 'M-PESA', 'Bank'].forEach((method, index) => {
    pdf.rect(rightX, yPos + (index * 8) - 4, 4, 4);
    if (document.payment_mode?.toLowerCase() === method.toLowerCase()) {
      pdf.text('✓', rightX + 1, yPos + (index * 8));
    }
    pdf.text(method, rightX + 10, yPos + (index * 8));
    
    if (document.payment_mode?.toLowerCase() === method.toLowerCase() && document.payment_reference) {
      pdf.text(`(${document.payment_reference})`, rightX + 50, yPos + (index * 8));
    }
  });

  yPos += 40;

  // Balance Section
  const balanceX = rightX + colWidth - 40;
  pdf.line(rightX, yPos, balanceX, yPos);
  
  pdf.text('Current Balance:', rightX, yPos + 10);
  pdf.text(formatCurrency(document.balance || 0, document.currency), balanceX, yPos + 10, { align: 'right' });
  
  pdf.text('Payment Amount:', rightX, yPos + 20);
  pdf.text(formatCurrency(totalAmount, document.currency), balanceX, yPos + 20, { align: 'right' });
  
  pdf.text('Balance Due:', rightX, yPos + 30);
  pdf.text(formatCurrency(document.balance || 0, document.currency), balanceX, yPos + 30, { align: 'right' });

  // Footer
  pdf.setFontSize(9);
  pdf.setTextColor(100);
  pdf.text(
    'This is a computer-generated receipt.',
    pageWidth/2,
    pageHeight - margin,
    { align: 'center' }
  );

  return pdf;
}