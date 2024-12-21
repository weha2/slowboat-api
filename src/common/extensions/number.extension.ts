declare global {
  interface Number {
    formatCurrency(currency?: string): string;
  }
}

Number.prototype.formatCurrency = function (currency: string = 'THB'): string {
  const locale = currency === 'THB' ? 'th-TH' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(this);
};

export {};
