import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { processData, organizeByCategory, generateExcel } from '../utils/reportUtils'
import './HomePage.css'

function HomePage() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState({ percent: 0, text: '' })
  const [status, setStatus] = useState({ message: '', type: '', show: false })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const showProgress = (percent, text) => {
    setProgress({ percent, text })
  }

  const hideProgress = () => {
    setProgress({ percent: 0, text: '' })
  }

  const showStatus = (message, type) => {
    setStatus({ message, type, show: true })
    if (type === 'success') {
      setTimeout(() => {
        setStatus({ message: '', type: '', show: false })
      }, 5000)
    }
  }

  const handleFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      showStatus('Please select a CSV file', 'error')
      return
    }

    setSelectedFile(file)
    setFileName(file.name)
    setFileSize(formatFileSize(file.size))
    setCurrentStep(1)
    setStatus({ message: '', type: '', show: false })
  }

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFileName('')
    setFileSize('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setCurrentStep(0)
    setStatus({ message: '', type: '', show: false })
  }

  const handleUploadAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      handleFile(files[0])
    } else {
      showStatus('Please select a CSV file', 'error')
    }
  }

  const handleGenerateExcel = () => {
    if (!selectedFile) {
      showStatus('Please select a CSV file first!', 'error')
      return
    }

    setCurrentStep(2)
    showProgress(10, 'Reading CSV file...')
    setStatus({ message: '', type: '', show: false })

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (header) => {
        return header.replace(/^\uFEFF/, '').trim()
      },
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('CSV file appears to be empty or invalid')
          }

          showProgress(40, 'Processing data...')
          const transactionData = processData(results)

          if (!transactionData || transactionData.length === 0) {
            throw new Error(
              'No transaction data found. Please check that your CSV contains "Sale Line" records.'
            )
          }

          showProgress(80, 'Generating Excel report...')
          generateExcel(transactionData)

          showProgress(100, 'Complete!')
          setCurrentStep(3)
          setTimeout(() => {
            hideProgress()
            showStatus(
              `✓ Excel report downloaded! (${transactionData.length} unique SKUs)`,
              'success'
            )
          }, 1000)
        } catch (error) {
          hideProgress()
          showStatus(`✗ Error: ${error.message}`, 'error')
          setCurrentStep(1)
          console.error('Full error:', error)
        }
      },
      error: (error) => {
        hideProgress()
        showStatus(`✗ Error parsing CSV: ${error.message}`, 'error')
        setCurrentStep(1)
      },
    })
  }

  const handleGenerateReport = () => {
    if (!selectedFile) {
      showStatus('Please select a CSV file first!', 'error')
      return
    }

    setCurrentStep(2)
    showProgress(10, 'Reading CSV file...')
    setStatus({ message: '', type: '', show: false })

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      transformHeader: (header) => {
        return header.replace(/^\uFEFF/, '').trim()
      },
      complete: (results) => {
        try {
          if (!results.data || results.data.length === 0) {
            throw new Error('CSV file appears to be empty or invalid')
          }

          showProgress(40, 'Processing data...')
          const transactionData = processData(results)

          if (!transactionData || transactionData.length === 0) {
            throw new Error(
              'No transaction data found. Please check that your CSV contains "Sale Line" records.'
            )
          }

          showProgress(80, 'Generating report...')

          const today = new Date()
          const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${String(
            today.getFullYear()
          ).slice(-2)}`
          const days = [
            'SUNDAY',
            'MONDAY',
            'TUESDAY',
            'WEDNESDAY',
            'THURSDAY',
            'FRIDAY',
            'SATURDAY',
          ]
          const dayStr = days[today.getDay()]

          const categories = organizeByCategory(transactionData)

          sessionStorage.setItem('reportData', JSON.stringify(categories))
          sessionStorage.setItem('reportDate', dateStr)
          sessionStorage.setItem('reportDay', dayStr)

          showProgress(100, 'Opening report...')
          setCurrentStep(3)
          setTimeout(() => {
            hideProgress()
            navigate('/report')
          }, 500)
        } catch (error) {
          hideProgress()
          showStatus(`✗ Error: ${error.message}`, 'error')
          setCurrentStep(1)
          console.error('Full error:', error)
        }
      },
      error: (error) => {
        hideProgress()
        showStatus(`✗ Error parsing CSV: ${error.message}`, 'error')
        setCurrentStep(1)
      },
    })
  }

  return (
    <div className="main-container">
      <div className="header-section">
        <h1>📊 Daily Sales Report Generator</h1>
        <p>Transform your CSV invoices into professional reports</p>
      </div>

      <div className="content-section">
        <div className="step-indicator">
          <div className={`step ${currentStep >= 0 ? 'active' : ''} ${currentStep > 0 ? 'completed' : ''}`}>
            <div className="step-circle">1</div>
            <div className="step-label">Upload CSV</div>
          </div>
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-circle">2</div>
            <div className="step-label">Generate</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-circle">3</div>
            <div className="step-label">Download</div>
          </div>
        </div>

        <div className="upload-section">
          <div
            className={`upload-area ${isDragging ? 'dragover' : ''}`}
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="upload-icon">📁</div>
            <div className="upload-text">Drop your CSV file here</div>
            <div className="upload-hint">or click to browse</div>
            <input
              ref={fileInputRef}
              type="file"
              id="fileInput"
              className="file-input"
              accept=".csv"
              onChange={handleFileInputChange}
            />
          </div>

          {selectedFile && (
            <div className="selected-file-card show">
              <div className="file-icon">📄</div>
              <div className="file-info">
                <div className="file-name">{fileName}</div>
                <div className="file-size">{fileSize}</div>
              </div>
              <button className="remove-file" onClick={handleRemoveFile}>
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="actions-section">
          <button
            id="generateExcelBtn"
            className="btn btn-primary"
            disabled={!selectedFile}
            onClick={handleGenerateExcel}
          >
            📊 Excel Report
          </button>
          <button
            id="generateHtmlBtn"
            className="btn btn-secondary"
            disabled={!selectedFile}
            onClick={handleGenerateReport}
          >
            🖨️ Print Report
          </button>
        </div>

        {progress.percent > 0 && (
          <div className="progress-container show">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.percent}%` }}
              ></div>
            </div>
            <div className="progress-text">{progress.text}</div>
          </div>
        )}

        {status.show && (
          <div className={`status-message ${status.type} show`}>
            {status.message}
          </div>
        )}

        <div className="info-box">
          <h3>What you'll get:</h3>
          <ul>
            <li>Automatic categorization (OEM, SHOP, WORK, TYRE)</li>
            <li>Products grouped by SKU with totals</li>
            <li>Sorted by price (highest first)</li>
            <li>Complete tax and payment breakdown</li>
            <li>100% secure - all processing in your browser</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default HomePage
