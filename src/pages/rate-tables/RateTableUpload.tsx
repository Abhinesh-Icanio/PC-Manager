import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ArrowLeft, Save, X, Trash2, Upload } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import AppFileUpload from '../../appComponents/AppFileUpload'
import RateTableForm from './RateTableForm'
import EditableDataTable from './EditableDataTable'

const RateTableUpload = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Reset state when file is removed
  useEffect(() => {
    if (!file) {
      setParsedData([])
      setHeaders([])
      setError(null)
    }
  }, [file])

  // Process file when uploaded
  useEffect(() => {
    if (file) {
      processFile(file)
    }
  }, [file])

  const processFile = async (uploadedFile: File) => {
    setIsProcessing(true)
    setError(null)
    const fileExtension = uploadedFile.name.split('.').pop()?.toLowerCase()

    if (fileExtension === 'csv') {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        transform: (value: string) => value.trim(),
        complete: (results: Papa.ParseResult<any>) => {
          try {
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors)
            }

            if (!results.data || results.data.length === 0) {
              setError('CSV file is empty or contains no valid data')
              setIsProcessing(false)
              return
            }

            const hasData = results.data.some((row: any) => {
              return Object.values(row).some(val => val !== '' && val !== null && val !== undefined)
            })

            if (hasData) {
              const fileHeaders = (results.meta.fields || []).map((h: string) => h.trim())
              setHeaders(fileHeaders)
              setParsedData(results.data as any[])
              setError(null)
            } else {
              setError('CSV file contains no valid data')
            }
          } catch (error) {
            console.error('CSV processing error:', error)
            setError(`Error processing CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`)
          } finally {
            setIsProcessing(false)
          }
        },
        error: (error: Error) => {
          console.error('CSV parsing error:', error)
          setError(`Error parsing CSV file: ${error.message}`)
          setIsProcessing(false)
        },
      })
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })

          if (jsonData.length === 0) {
            setError('Excel file is empty or contains no valid data')
            setIsProcessing(false)
            return
          }

          const fileHeaders = (jsonData[0] as any[]).map((h: any) => String(h || '').trim())

          if (fileHeaders.length === 0 || fileHeaders.every(h => !h)) {
            setError('Excel file does not contain valid headers')
            setIsProcessing(false)
            return
          }

          // Convert rows to objects using header mapping
          const rows = (jsonData.slice(1) as any[][]).map((row: any[]) => {
            const obj: any = {}
            fileHeaders.forEach((header, index) => {
              obj[header] = row[index] || ''
            })
            return obj
          }).filter((row: any) => {
            // Filter out completely empty rows
            return Object.values(row).some((val: any) => val !== '' && val !== null && val !== undefined)
          })

          const hasData = rows.length > 0 && rows.some(row => {
            return Object.values(row).some(val => val !== '' && val !== null && val !== undefined)
          })

          if (hasData) {
            setHeaders(fileHeaders)
            setParsedData(rows)
            setError(null)
          } else {
            setError('Excel file contains no valid data')
          }
        } catch (error) {
          console.error('Excel parsing error:', error)
          setError(`Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
          setIsProcessing(false)
        }
      }
      reader.onerror = () => {
        setError('Error reading Excel file')
        setIsProcessing(false)
      }
      reader.readAsArrayBuffer(uploadedFile)
    } else {
      setError('Unsupported file format. Please upload a CSV or Excel file.')
      setIsProcessing(false)
    }
  }

  const handleFileChange = (name: string, file: File | null) => {
    setFile(file)
  }

  const handleDataChange = (newData: any[]) => {
    setParsedData(newData)
  }

  const handleSave = (formValues: any) => {
    // Combine form values with parsed data
    const rateTableData = {
      ...formValues,
      tableData: parsedData,
      headers: headers,
      fileName: file?.name,
    }
    console.log('Saving rate table:', rateTableData)
    // TODO: Implement actual save logic (API call)
    navigate('/rate-tables')
  }

  const handleRemoveFile = () => {
    setFile(null)
    setParsedData([])
    setHeaders([])
    setError(null)
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/rate-tables')
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/rate-tables')}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {isEditMode ? 'Edit Rate Table' : 'Create Rate Table'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Upload a rate table file and configure the details
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
        {!file && (
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Upload Rate Table File
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Please upload an Excel (.xlsx, .xls) or CSV file containing your rate table data.
            </Typography>
            <AppFileUpload
              name="rateTableFile"
              value={file}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              placeholder="Choose a file or drag it here"
            />
          </Paper>
        )}

        {file && (
          <>
            {/* File Info and Remove/Re-upload Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Uploaded File
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 size={18} />}
                    onClick={handleRemoveFile}
                    sx={{ textTransform: 'none' }}
                  >
                    Remove File
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Upload size={18} />}
                    onClick={handleRemoveFile}
                    sx={{ textTransform: 'none' }}
                  >
                    Re-upload
                  </Button>
                </Box>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>

            {isProcessing && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                  Processing file...
                </Typography>
              </Box>
            )}

            {!isProcessing && headers.length > 0 && (
              <Grid container spacing={3}>
                {/* Left Section - Editable Data Table */}
                <Grid item xs={12} md={7}>
                  <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Rate Table Data
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      Click on any cell to edit. Press Enter to save, Escape to cancel.
                    </Typography>
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                      <EditableDataTable
                        data={parsedData}
                        headers={headers}
                        onDataChange={handleDataChange}
                      />
                    </Box>
                  </Paper>
                </Grid>

                {/* Right Section - Form */}
                <Grid item xs={12} md={5}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Rate Table Details
                    </Typography>
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                      <RateTableForm onSave={handleSave} />
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}
          </>
        )}
      </Box>

      {/* Footer */}
      {file && !isProcessing && headers.length > 0 && (
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<X size={18} />}
            onClick={handleCancel}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Save size={18} />}
            onClick={() => {
              const form = document.getElementById('rate-table-form') as HTMLFormElement
              if (form) {
                form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
              }
            }}
            sx={{ textTransform: 'none' }}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default RateTableUpload
