# 📊 Daily Sales Report Generator

A modern, fully client-side React application for generating professional daily sales reports from CSV invoice files. No backend required - everything runs in your browser!

## ✨ Features

- 📊 **Excel Report Generation** - Export data to Excel format with one click
- 🖨️ **Print-Ready Reports** - Generate PDF-ready reports with fully editable cells
- 📁 **Drag & Drop Upload** - Intuitive file upload with drag and drop support
- 🎯 **Auto Categorization** - Intelligent product categorization (OEM, SHOP, WORK, TYRE)
- 📈 **Smart Data Processing** - Groups products by SKU, calculates totals, sorts by price
- ✏️ **Fully Editable** - Edit any cell in the report before printing
- 🔒 **100% Client-Side** - All processing happens locally in your browser - your data never leaves your computer
- 🎨 **Modern UI** - Beautiful, responsive design with step-by-step progress indicators
- ⚡ **Fast & Lightweight** - Built with Vite for instant hot reload and fast builds

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory. You can deploy this to any static hosting service (Netlify, Vercel, GitHub Pages, etc.).

## 📖 How to Use

1. **Upload CSV File**
   - Click the upload area or drag and drop your CSV invoice file
   - The file will be validated and displayed

2. **Generate Report**
   - Choose **Excel Report** to download an Excel file
   - Choose **Print Report** to view an editable report page

3. **Edit Report** (Print Report only)
   - Click any cell to edit its content
   - Edit date, day, product names, prices, quantities, etc.
   - All changes are saved in real-time

4. **Print/Export**
   - Click the Print button (or Ctrl+P / Cmd+P)
   - Use your browser's print dialog to save as PDF

## 📁 Project Structure

```
daily-report-maker/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx      # Main upload and processing page
│   │   ├── HomePage.css      # Styles for HomePage
│   │   ├── ReportPage.jsx    # Report display and editing page
│   │   └── ReportPage.css    # Styles for ReportPage
│   ├── utils/
│   │   └── reportUtils.js    # Utility functions (CSV processing, Excel generation)
│   ├── App.jsx               # Main app component with routing
│   ├── App.css               # App-wide styles
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── index.html                # HTML entry point
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🛠️ Technologies

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and dev server
- **PapaParse** - CSV parsing library
- **XLSX** - Excel file generation

## 📝 CSV Format Requirements

Your CSV file should contain the following columns:
- `Line type` - Should contain "Sale Line" or "Payment"
- `Date` - Transaction date
- `Sku` - Product SKU
- `Details` - Product name
- `Location` - Location information
- `Quantity` - Product quantity
- `Total tax` - Tax amount
- `Total (Tax inclusive)` - Total sales amount
- `Invoice Number` - Invoice identifier
- `Payment method` - Payment method (for Payment lines)

## 🔒 Privacy & Security

- **100% Client-Side Processing** - All data processing happens in your browser
- **No Data Transmission** - Your CSV files never leave your computer
- **No Backend Required** - No server, no database, no API calls
- **Session Storage** - Report data is temporarily stored in browser session storage

## 🐛 Troubleshooting

**Issue: File not uploading**
- Make sure the file is a `.csv` file
- Check that the file is not corrupted

**Issue: No data found**
- Ensure your CSV contains "Sale Line" records
- Check that column names match the expected format

**Issue: Report page not opening**
- Check browser console for errors
- Ensure popups are not blocked

## 📄 License

MIT License - Feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Made with ❤️ using React
