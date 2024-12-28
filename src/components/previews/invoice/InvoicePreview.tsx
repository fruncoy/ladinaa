import { formatDate } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceDetails } from './InvoiceDetails';
import { InvoiceTable } from './InvoiceTable';
import { PaymentDetails } from './PaymentDetails';
import { CancellationPolicy } from './CancellationPolicy';
import { InvoiceFooter } from './InvoiceFooter';
import type { Document, VehicleItem } from '../../../types';

interface InvoicePreviewProps {
  document: Document;
  items: VehicleItem[];
}

export function InvoicePreview({ document, items }: InvoicePreviewProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <InvoiceHeader />
      <InvoiceDetails document={document} />
      <InvoiceTable document={document} items={items} />
      <PaymentDetails />
      <CancellationPolicy />
      <InvoiceFooter />
    </div>
  );
}