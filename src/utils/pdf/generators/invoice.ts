import { jsPDF } from 'jspdf';
import { PDF_CONFIG } from '../config';
import { addHeader } from '../components/header';
import { addDocumentBox } from '../components/documentBox';
import { addServiceTable } from '../components/serviceTable';
import { addPaymentDetails } from '../components/paymentDetails';
import { addBookingPolicy } from '../components/bookingPolicy';
import { addDocumentFooter } from '../components/footer';
import type { Document, VehicleItem } from '../../../types';

export async function generateInvoicePDF({ document, items }: {
  document: Document;
  items: VehicleItem[];
}) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  pdf.setProperties({
    title: `Invoice - ${document.client_name}`,
    subject: `Invoice for ${document.client_name}`,
    creator: 'Ladina Travel Safaris'
  });

  let yPos = await addHeader(pdf);
  
  // Add spacing after header
  yPos += PDF_CONFIG.content.spacing.section;
  
  // Add content sections
  yPos = await addDocumentBox(pdf, document, yPos);
  yPos = await addServiceTable(pdf, document, items, yPos);
  yPos = await addPaymentDetails(pdf, document.currency, yPos);
  yPos = await addBookingPolicy(pdf, yPos);

  // Check if we need a new page for footer
  const availableSpace = pdf.internal.pageSize.height - yPos - PDF_CONFIG.margins.bottom;
  if (availableSpace < 60) {
    pdf.addPage();
    yPos = PDF_CONFIG.margins.top;
  }

  addDocumentFooter(pdf, yPos);

  return pdf;
}