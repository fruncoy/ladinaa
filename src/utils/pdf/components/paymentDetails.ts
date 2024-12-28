import { jsPDF } from 'jspdf';
import { BANK_DETAILS } from '../../constants/bankDetails';

export function addPaymentDetails(pdf: jsPDF, yPos: number, currency: 'KSH' | 'USD'): number {
  const pageWidth = pdf.internal.pageSize.width;
  const details = BANK_DETAILS[currency];

  pdf.setDrawColor(229, 231, 235);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(20, yPos, pageWidth - 40, 70, 3, 3, 'FD');

  pdf.setTextColor(0, 166, 81);
  pdf.setFontSize(12);
  pdf.text('Payment Details', 30, yPos + 15);

  const leftX = 30;
  const rightX = pageWidth / 2 + 10;

  // Bank Transfer
  pdf.setTextColor(255, 107, 0);
  pdf.setFontSize(11);
  pdf.text('Bank Transfer', leftX, yPos + 30);
  
  pdf.setTextColor(100);
  pdf.setFontSize(10);
  details.bank.forEach((line, index) => {
    pdf.text(line, leftX, yPos + 40 + (index * 6));
  });

  // M-PESA
  pdf.setTextColor(255, 107, 0);
  pdf.setFontSize(11);
  pdf.text('M-PESA', rightX, yPos + 30);
  
  pdf.setTextColor(100);
  pdf.setFontSize(10);
  details.mpesa.forEach((line, index) => {
    pdf.text(line, rightX, yPos + 40 + (index * 6));
  });

  return yPos + 80; // Return next Y position
}