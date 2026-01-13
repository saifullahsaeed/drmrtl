import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatCurrency, calculateSectionTotals } from '../utils/reportUtils'
import './ReportPage.css'

function ReportPage() {
  const [reportData, setReportData] = useState({})
  const [dateStr, setDateStr] = useState('')
  const [dayStr, setDayStr] = useState('')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const navigate = useNavigate()
  const reportContainerRef = useRef(null)
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)

  useEffect(() => {
    const data = sessionStorage.getItem('reportData')
    const date = sessionStorage.getItem('reportDate')
    const day = sessionStorage.getItem('reportDay')

    if (!data || !date || !day) {
      navigate('/')
      return
    }

    setReportData(JSON.parse(data))
    setDateStr(date)
    setDayStr(day)
  }, [navigate])

  const formatNumber = (num) => {
    if (isNaN(num) || num === null) return '0'
    return Math.abs(num).toString()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const pdf = new jsPDF('portrait', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 8
      const contentWidth = pageWidth - 2 * margin

      // Generate Page 1 (First two sections)
      if (page1Ref.current) {
        const canvas1 = await html2canvas(page1Ref.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })
        const imgData1 = canvas1.toDataURL('image/png')
        const imgWidth1 = contentWidth
        const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width

        pdf.addImage(imgData1, 'PNG', margin, margin, imgWidth1, imgHeight1)
      }

      // Generate Page 2 (Remaining sections)
      if (page2Ref.current) {
        pdf.addPage()
        const canvas2 = await html2canvas(page2Ref.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })
        const imgData2 = canvas2.toDataURL('image/png')
        const imgWidth2 = contentWidth
        const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width

        pdf.addImage(imgData2, 'PNG', margin, margin, imgWidth2, imgHeight2)
      }

      pdf.save(`daily-report-${dateStr.replace(/\//g, '-')}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try the print option instead.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const sections = ['OEM', 'SHOP', 'WORK', 'TYRE', 'OLD', 'MISC']
  const sectionNames = {
    OEM: 'قطع وكال ORIGNAL',
    SHOP: 'مشكل SHOP',
    WORK: 'ورشة WORKSHOP',
    TYRE: 'كفرات TYRE',
    OLD: 'بيع قطع مستعمل OLD',
    MISC: 'MISC',
  }

  let grandTotalQty = 0
  let grandTotalTax = 0
  let grandTotalSales = 0
  let grandTotalPostPaid = 0

  sections.forEach((sectionKey) => {
    const items = reportData[sectionKey] || []
    items.forEach((item) => {
      grandTotalQty += item.data[5]
      grandTotalTax += item.data[6]
      grandTotalSales += item.data[7]
      grandTotalPostPaid += item.data[8]
    })
  })

  // Split sections for page breaks
  const page1Sections = sections.filter((key) => {
    const items = reportData[key] || []
    return items.length > 0 && (key === 'OEM' || key === 'SHOP')
  })

  const page2Sections = sections.filter((key) => {
    const items = reportData[key] || []
    return items.length > 0 && !(key === 'OEM' || key === 'SHOP')
  })

  const renderSection = (sectionKey) => {
    const items = reportData[sectionKey] || []

    if (items.length === 0 && (sectionKey === 'OLD' || sectionKey === 'MISC')) {
      return (
        <div key={sectionKey} className="section">
          <div className="section-title">{sectionNames[sectionKey]}</div>
          <div className="empty-section">No items in this section</div>
        </div>
      )
    }

    if (items.length === 0) return null

    const totals = calculateSectionTotals(items)

    return (
      <div key={sectionKey} className="section">
        <div className="section-title">{sectionNames[sectionKey]}</div>
        <table className="excel-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>PRICE</th>
              <th>QUANTITY</th>
              <th>TAX</th>
              <th>TOTAL</th>
              <th>POST PAID</th>
              <th>REMARKS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const [
                date,
                productName,
                sku,
                cat,
                location,
                quantity,
                tax,
                sales,
                postPaid,
              ] = item.data
              const unitPrice = quantity !== 0 ? sales / quantity : sales

              return (
                <tr key={idx}>
                  <td className="name">
                    <div
                      className="editable-cell name"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {productName || ''}
                    </div>
                  </td>
                  <td className="number">
                    <div
                      className="editable-cell number"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(unitPrice)}
                    </div>
                  </td>
                  <td className="quantity">
                    <div
                      className="editable-cell quantity"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatNumber(quantity)}
                    </div>
                  </td>
                  <td className="tax">
                    <div
                      className="editable-cell tax"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(tax)}
                    </div>
                  </td>
                  <td className="total">
                    <div
                      className="editable-cell total"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(sales)}
                    </div>
                  </td>
                  <td className="postpaid">
                    <div
                      className="editable-cell postpaid"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(postPaid)}
                    </div>
                  </td>
                  <td className="remarks">
                    <div
                      className="editable-cell remarks"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      
                    </div>
                  </td>
                </tr>
              )
            })}
            <tr className="total-row">
              <td className="name">
                <div className="editable-cell name">TOTAL</div>
              </td>
              <td className="number">
                <div className="editable-cell number"></div>
              </td>
              <td className="quantity">
                <div className="editable-cell quantity">
                  {formatNumber(totals.totalQuantity)}
                </div>
              </td>
              <td className="tax">
                <div
                  className="editable-cell tax"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {formatCurrency(totals.totalTax)}
                </div>
              </td>
              <td className="total">
                <div
                  className="editable-cell total"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {formatCurrency(totals.totalSales)}
                </div>
              </td>
              <td className="postpaid">
                <div
                  className="editable-cell postpaid"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {formatCurrency(totals.totalPostPaid)}
                </div>
              </td>
              <td className="remarks">
                <div
                  className="editable-cell remarks"
                  contentEditable
                  suppressContentEditableWarning
                >
                  0
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="print-controls">
        <h2>📄 Daily Report - Excel Style Editor</h2>
        <div className="btn-group">
          <button
            className="print-btn"
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? '⏳ Generating...' : '📄 Generate PDF'}
          </button>
          <button className="print-btn" onClick={handlePrint}>
            🖨️ Print / Save as PDF
          </button>
          <button className="print-btn secondary" onClick={() => navigate('/')}>
            ✕ Close
          </button>
        </div>
        <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
          💡 Click any cell to edit. Generate PDF for professional output or use
          Print for browser PDF
        </p>
      </div>

      <div className="report-container" ref={reportContainerRef}>
        {/* Page 1: First two sections */}
        <div ref={page1Ref} className="pdf-page">
          <div className="header">
            <h1>DAILY REPORT</h1>
            <div
              className="date"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setDateStr(e.target.textContent)}
            >
              {dateStr}
            </div>
            <div
              className="day"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setDayStr(e.target.textContent)}
            >
              {dayStr}
            </div>
          </div>

          {page1Sections.map((sectionKey) => renderSection(sectionKey))}
        </div>

        {/* Page 2: Remaining sections */}
        <div ref={page2Ref} className="pdf-page page-break">
          {page2Sections.map((sectionKey) => renderSection(sectionKey))}

          <div className="overall-totals">
            <table className="excel-table">
              <tbody>
                <tr className="overall-totals-row">
                  <td className="name">
                    <div className="editable-cell name">TOTAL</div>
                  </td>
                  <td className="number">
                    <div className="editable-cell number"></div>
                  </td>
                  <td className="quantity">
                    <div className="editable-cell quantity">
                      {formatNumber(grandTotalQty)}
                    </div>
                  </td>
                  <td className="tax">
                    <div
                      className="editable-cell tax"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(grandTotalTax)}
                    </div>
                  </td>
                  <td className="total">
                    <div
                      className="editable-cell total"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(grandTotalSales)}
                    </div>
                  </td>
                  <td className="postpaid">
                    <div
                      className="editable-cell postpaid"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(grandTotalPostPaid)}
                    </div>
                  </td>
                  <td className="remarks">
                    <div
                      className="editable-cell remarks"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      0
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grand-total">
            <table className="excel-table">
              <tbody>
                <tr className="grand-total-row">
                  <td className="name" colSpan="4">
                    GRAND TOTAL
                  </td>
                  <td className="total">
                    <div
                      className="editable-cell total"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      {formatCurrency(grandTotalSales)}
                    </div>
                  </td>
                  <td className="postpaid">
                    <div className="editable-cell postpaid"></div>
                  </td>
                  <td className="remarks">
                    <div className="editable-cell remarks"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportPage
