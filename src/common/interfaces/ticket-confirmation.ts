export interface TicketConfirmationData {
  invoiceNumber: string;
  product: {
    name: string;
    price: number;
    departureDate: string;
    participant: number;
  };
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  };
  pickupLocation: string;
  additionalRequest: string;
  payment: {
    subtotal: number;
    discount: number;
    total: number;
  };
}
