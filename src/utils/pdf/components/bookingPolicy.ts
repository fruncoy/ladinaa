import { jsPDF } from 'jspdf';
import { PDF_CONFIG } from '../config';

export function addBookingPolicy(pdf: jsPDF, yPos: number): number {
  const pageWidth = pdf.internal.pageSize.width;
  const margin = PDF_CONFIG.margins.left;
  const width = pageWidth - (margin * 2);

  // Title
  pdf.setFontSize(PDF_CONFIG.fonts.normal);
  pdf.setTextColor(0, 166, 81);
  pdf.text('Booking Cancellation Policy & Deposits', margin, yPos);

  yPos += PDF_CONFIG.content.spacing.item * 2;

  // Policy items
  pdf.setFontSize(PDF_CONFIG.fonts.small);
  const policies = [
    {
      title: 'Full Refund:',
      text: 'If cancellation occurs 30 days or more before the travel date.'
    },
    {
      title: '50% Refund:',
      text: 'For cancellations made less than 7 days before the travel date.'
    },
    {
      title: 'Deposit:',
      text: 'A 50% deposit of the total safari cost is required upon booking, with the balance due on the day of the trip/safari.'
    }
  ];

  policies.forEach((policy, index) => {
    pdf.setTextColor(255, 107, 0);
    pdf.text(policy.title, margin, yPos);
    
    const titleWidth = pdf.getTextWidth(policy.title);
    pdf.setTextColor(100);
    pdf.text(policy.text, margin + titleWidth + 2, yPos);
    
    yPos += PDF_CONFIG.content.spacing.item * 1.5;
  });

  return yPos + PDF_CONFIG.content.spacing.section;
}