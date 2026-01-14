// Utility functions for report processing
import * as XLSX from 'xlsx'

export function parseFloatValue(value) {
  if (!value || value === '') return 0.0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0.0 : parsed;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function parseDate(dateStr) {
  try {
    dateStr = dateStr.trim().replace(/^"|"$/g, '');
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch (e) {
    return null;
  }
}

export function determineCategory(sku, productName) {
  sku = String(sku || '').trim();
  productName = String(productName || '').trim();

  if (sku === '1001') {
    return 'WORK';
  }

  const tyrePattern = /\d+\/\d+\/\d+/;
  if (tyrePattern.test(productName)) {
    return 'TYRE';
  }

  if (sku && (/[a-zA-Z]/.test(sku) || sku.includes('-'))) {
    return 'OEM';
  }

  if (sku && sku.length >= 2 && sku.endsWith('00')) {
    return 'OEM';
  }

  return 'SHOP';
}

export function normalizeColumnName(name) {
  if (!name) return '';
  return name.replace(/^\uFEFF/, '').trim();
}

export function getRowValue(row, columnName) {
  if (row[columnName] !== undefined) {
    return row[columnName];
  }

  const normalized = normalizeColumnName(columnName);
  if (row[normalized] !== undefined) {
    return row[normalized];
  }

  const lowerColumnName = columnName.toLowerCase();
  for (const key in row) {
    if (normalizeColumnName(key).toLowerCase() === lowerColumnName) {
      return row[key];
    }
  }

  return '';
}

export function processData(csvData) {
  const rows = csvData.data;
  const saleLines = [];
  const payments = [];
  const invoicePaymentMap = {};

  const normalizedRows = rows.map((row) => {
    const normalizedRow = {};
    for (const key in row) {
      const normalizedKey = normalizeColumnName(key);
      normalizedRow[normalizedKey] = row[key];
    }
    return normalizedRow;
  });

  normalizedRows.forEach((row) => {
    const lineType = (getRowValue(row, 'Line type') || '').trim();
    if (lineType === 'Sale Line') {
      saleLines.push(row);
    } else if (lineType === 'Payment') {
      payments.push(row);
    }
  });

  payments.forEach((payment) => {
    const invoiceNum = (getRowValue(payment, 'Invoice Number') || '').trim();
    const paymentMethod = (getRowValue(payment, 'Payment method') || '').trim();
    if (invoiceNum) {
      invoicePaymentMap[invoiceNum] = paymentMethod;
    }
  });

  const skuGroups = {};

  saleLines.forEach((saleLine) => {
    let sku = (getRowValue(saleLine, 'Sku') || '').trim();
    if (!sku) {
      sku = (getRowValue(saleLine, 'Details') || '').trim().substring(0, 50);
    }

    const dateStr = getRowValue(saleLine, 'Date') || '';
    const dateObj = parseDate(dateStr);
    const formattedDate = dateObj
      ? dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : dateStr;

    const productName = (getRowValue(saleLine, 'Details') || '').trim();
    const category = determineCategory(sku, productName);
    const location = (getRowValue(saleLine, 'Location') || '').trim();
    const quantity = parseFloatValue(getRowValue(saleLine, 'Quantity') || '0');
    const taxAmount = parseFloatValue(getRowValue(saleLine, 'Total tax') || '0');
    const salesAmount = parseFloatValue(
      getRowValue(saleLine, 'Total (Tax inclusive)') || '0'
    );

    const invoiceNum = (getRowValue(saleLine, 'Invoice Number') || '').trim();
    let postPaidAmount = 0.0;
    if (invoiceNum in invoicePaymentMap) {
      const paymentMethod = invoicePaymentMap[invoiceNum];
      if (paymentMethod === 'Post Pay') {
        postPaidAmount = salesAmount;
      }
    }

    if (!skuGroups[sku]) {
      skuGroups[sku] = {
        date: formattedDate,
        productName: productName,
        sku: sku,
        category: category,
        location: location,
        quantity: 0.0,
        tax: 0.0,
        sales: 0.0,
        postPaid: 0.0,
      };
    }

    skuGroups[sku].quantity += quantity;
    skuGroups[sku].tax += taxAmount;
    skuGroups[sku].sales += salesAmount;
    skuGroups[sku].postPaid += postPaidAmount;
  });

  const transactionData = Object.values(skuGroups).map((data) => ({
    salesAmount: data.sales,
    data: [
      data.date,
      data.productName,
      data.sku,
      data.category,
      data.location,
      data.quantity,
      data.tax,
      data.sales,
      data.postPaid,
    ],
  }));

  transactionData.sort((a, b) => b.salesAmount - a.salesAmount);

  return transactionData;
}

export function organizeByCategory(transactionData) {
  const categories = {
    OEM: [],
    WORK: [],
    TYRE: [],
    SHOP: [],
    OLD: [],
    MISC: [],
  };

  transactionData.forEach((transaction) => {
    const category = transaction.data[3];
    if (categories[category]) {
      categories[category].push(transaction);
    } else {
      categories['MISC'].push(transaction);
    }
  });

  return categories;
}

export function calculateSectionTotals(items) {
  let totalQuantity = 0;
  let totalTax = 0;
  let totalSales = 0;
  let totalPostPaid = 0;

  items.forEach((item) => {
    totalQuantity += item.data[5];
    totalTax += item.data[6];
    totalSales += item.data[7];
    totalPostPaid += item.data[8];
  });

  return { totalQuantity, totalTax, totalSales, totalPostPaid };
}

export function generateExcel(transactionData) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([]);

  const headers = [
    'Transaction Date',
    'Product Name/SKU',
    'Product SKU',
    'Category',
    'Location',
    'Quantity',
    'Tax',
    'Sales (Tax Inclusive)',
    'POST PAID',
  ];

  XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });

  const dataRows = transactionData.map((t) => t.data);
  XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A2' });

  const colWidths = [
    { wch: 15 },
    { wch: 50 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 18 },
    { wch: 15 },
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Sales Report');
  XLSX.writeFile(wb, 'sales_report.xlsx');
}
