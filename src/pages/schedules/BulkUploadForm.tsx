import React, { useState, useEffect } from 'react'
import { Box, Typography, Tooltip, Chip, Alert, Button } from '@mui/material'
import { AlertCircle, CheckCircle, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import AppFileUpload from '../../appComponents/AppFileUpload'
import AppDrawer from '../../appComponents/AppDrawer'
import AppTable from '../../appComponents/AppTable'
import ScheduleForm from './ScheduleForm'
import { scheduleFormFields } from './constants'

interface ValidationError {
    row: number
    field: string
    message: string
}

interface HeaderMismatchError {
    missing: string[]
    extra: string[]
}

interface BulkUploadFormProps {
    onSave: (data: any[]) => void
    onCancel: () => void
    onUploadButtonStateChange?: (disabled: boolean) => void
}
const fieldTypes: Record<string, string> = {
    name: 'string',
    product: 'string',
    scheduleType: 'string',
    status: 'string',
    description: 'string',
    startDate: 'date',
    endDate: 'date',
}

// Normalize string for comparison (lowercase, trim, remove special chars)
const normalize = (str: string): string => {
    return str.toLowerCase().trim().replace(/[_\s-]/g, '')
}

// Get field value from headers and values array using possible header name variations
const getFieldValue = (
    headers: string[],
    values: string[],
    possibleNames: string[],
    options: any[] = [],
    formatter = (value: string | number) => value,
    valueParam: string = 'value',
    others: boolean = false
): string => {
    for (const name of possibleNames) {
        const normName = normalize(name)
        const index = headers.findIndex(h => normalize(h) === normName)
        if (index !== -1 && values[index]) {
            if (typeof values[index] === 'string' && values[index]?.trim()) {
                const value = values[index].trim()
                if (options?.length) {
                    const option = options.find(
                        option => normalize(option[valueParam]) === normalize(value)
                    )
                    return option?.value || others ? value : ''
                }
                return formatter(value) as string
            }
            return formatter(values[index]) as string
        }
    }
    return ''
}

// Map CSV/Excel row values to schedule object
const valueMapper = (values: string[], headers: string[], scheduleFormFields: any[]) => {
    // Get product options from scheduleFormFields
    const productField = scheduleFormFields.find(f => f.name === 'product')
    const productOptions = productField?.options || []

    // Get status options from scheduleFormFields
    const statusField = scheduleFormFields.find(f => f.name === 'status')
    const statusOptions = statusField?.options || []

    // Get scheduleType options from scheduleFormFields
    const scheduleTypeField = scheduleFormFields.find(f => ['scheduleType', 'schedule type'].includes(f.name))
    const scheduleTypeOptions = scheduleTypeField?.options || []

    const schedule = {
        name: getFieldValue(headers, values, [
            'name',
            'schedule name',
            'schedule',
            'schedule_name',
            'schedule-name',
        ]),
        product: getFieldValue(
            headers,
            values,
            ['product', 'product name', 'productname', 'product_name', 'product-name'],
            productOptions,
            (value: any) => value || '',
            'value',
            true
        ),
        scheduleType: getFieldValue(
            headers,
            values,
            ['schedule type', 'scheduletype', 'schedule_type', 'schedule-type', 'type'],
            scheduleTypeOptions,
            (value: any) => value || '',
            'value',
            false
        ),
        status: getFieldValue(
            headers,
            values,
            ['status', 'schedule status', 'schedulestatus', 'status_type', 'status-type'],
            statusOptions,
            (value: any) => value || '',
            'value',
            false
        ),
        description: getFieldValue(headers, values, [
            'description',
            'desc',
            'details',
            'notes',
            'comment',
        ]),
        startDate: getFieldValue(
            headers,
            values,
            [
                'startdate',
                'start date',
                'start_date',
                'start-date',
                'begin date',
                'begindate',
                'from date',
                'fromdate',
            ],
            [],
            (value: any) => {
                if (!value) return ''
                // Try to parse date and return as ISO string
                const date = new Date(value)
                return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0]
            }
        ),
        endDate: getFieldValue(
            headers,
            values,
            [
                'enddate',
                'end date',
                'end_date',
                'end-date',
                'finish date',
                'finishdate',
                'to date',
                'todate',
            ],
            [],
            (value: any) => {
                console.log('value', value)
                if (!value) return ''
                // Try to parse date and return as ISO string
                const date = new Date(value)
                return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0]
            }
        ),
    }
    return schedule
}

const BulkUploadForm: React.FC<BulkUploadFormProps> = ({ onSave, onUploadButtonStateChange }) => {
    const [file, setFile] = useState<File | null>(null)
    const [parsedData, setParsedData] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([]) // Only fields matching scheduleFormFields
    const [headers, setHeaders] = useState<string[]>([])
    const [filteredHeaders, setFilteredHeaders] = useState<string[]>([]) // Only headers matching expected fields
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
    const [headerErrors, setHeaderErrors] = useState<HeaderMismatchError | null>(null)
    const [isValid, setIsValid] = useState(false)
    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [isEmptyFile, setIsEmptyFile] = useState(false)

    // Get required fields from constants, excluding status (status defaults to "Active" in bulk upload)
    const requiredFields = scheduleFormFields
        .filter(field => field.required && field.name !== 'status')
        .map(field => field.name)

    const expectedFields = scheduleFormFields?.filter((item) => item.name !== 'status').map(field => field.name)



    // Reset state when file is removed
    useEffect(() => {
        if (!file) {
            setParsedData([])
            setFilteredData([])
            setHeaders([])
            setFilteredHeaders([])
            setValidationErrors([])
            setHeaderErrors(null)
            setIsValid(false)
            setIsEmptyFile(false)
        }
    }, [file])

    useEffect(() => {
        if (file) {
            processFile(file)
        }
    }, [file])

    useEffect(() => {
        if (parsedData.length > 0 && headers.length > 0) {
            filterDataToExpectedFields()
            validateHeaders()
        }
    }, [parsedData, headers])

    useEffect(() => {
        if (filteredData.length > 0 && filteredHeaders.length > 0) {
            validateData()
        }
    }, [filteredData, filteredHeaders])

    // Filter data to only include rows that have at least one matching header key
    // Then map fields using valueMapper
    const filterDataToExpectedFields = () => {
        // Always show all expected fields
        setFilteredHeaders(expectedFields)

        // First, filter parsed data to only include rows that have at least one matching header
        const rowsWithMatchingHeaders = parsedData.filter(() => {
            // Check if any header matches our expected fields
            return headers.some(header => {
                const headerLower = normalize(header)
                return expectedFields.some(field => {
                    // Check if header matches field name or any of its possible variations
                    if (headerLower === normalize(field)) return true

                    // Check against possible name variations for each field
                    if (field === 'name') {
                        const nameVariations = ['name', 'schedule name', 'schedule', 'schedule_name', 'schedule-name']
                        return nameVariations.some(v => normalize(v) === headerLower)
                    }
                    // For product field
                    if (field === 'product') {
                        const productVariations = ['product', 'product name', 'productname', 'product_name', 'product-name']
                        return productVariations.some(v => normalize(v) === headerLower)
                    }
                    // For scheduleType field
                    if (field === 'scheduleType') {
                        const scheduleTypeVariations = ['schedule type', 'scheduletype', 'schedule_type', 'schedule-type', 'type']
                        return scheduleTypeVariations.some(v => normalize(v) === headerLower)
                    }
                    // For status field
                    if (field === 'status') {
                        const statusVariations = ['status', 'schedule status', 'schedulestatus', 'status_type', 'status-type']
                        return statusVariations.some(v => normalize(v) === headerLower)
                    }
                    // For description field
                    if (field === 'description') {
                        const descVariations = ['description', 'desc', 'details', 'notes', 'comment']
                        return descVariations.some(v => normalize(v) === headerLower)
                    }
                    // For startDate field
                    if (field === 'startDate') {
                        const startDateVariations = ['startdate', 'start date', 'start_date', 'start-date', 'begin date', 'begindate', 'from date', 'fromdate']
                        return startDateVariations.some(v => normalize(v) === headerLower)
                    }
                    // For endDate field
                    if (field === 'endDate') {
                        const endDateVariations = ['enddate', 'end date', 'end_date', 'end-date', 'finish date', 'finishdate', 'to date', 'todate']
                        return endDateVariations.some(v => normalize(v) === headerLower)
                    }
                    return false
                })
            })
        })

        // Convert filtered rows to array format and map using valueMapper
        const filtered = rowsWithMatchingHeaders.map(row => {
            // Convert row object to array of values in the same order as headers
            const values = headers.map(header => row[header] || '')

            // Use valueMapper to extract and map values
            const mappedSchedule = valueMapper(values, headers, scheduleFormFields)

            // Ensure all expected fields are present, show "-" for missing ones
            // Note: status is excluded from expectedFields, so it won't appear in the table
            const filteredRow: any = {}
            expectedFields.forEach(fieldName => {
                if (mappedSchedule[fieldName as keyof typeof mappedSchedule] !== undefined &&
                    mappedSchedule[fieldName as keyof typeof mappedSchedule] !== '') {
                    filteredRow[fieldName] = mappedSchedule[fieldName as keyof typeof mappedSchedule]
                } else {
                    filteredRow[fieldName] = '-' // Show "-" for missing fields
                }
            })
            // Always set status to "Active" for bulk upload (not shown in table)
            filteredRow.status = 'Active'
            return filteredRow
        })

        setFilteredData(filtered)
    }

    const processFile = async (uploadedFile: File) => {
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
                            const criticalErrors = results.errors.filter(error => error.type === 'Delimiter')
                            if (criticalErrors.length > 0) {
                                alert('Some rows may have formatting issues. Please review the data.')
                            }
                        }

                        if (!results.data || results.data.length === 0) {
                            setIsEmptyFile(true)
                            setHeaders([])
                            setParsedData([])
                            alert('CSV file is empty or contains no valid data')
                            return
                        }

                        // Check if data has actual content (not just empty objects)
                        const hasData = results.data.some((row: any) => {
                            return Object.values(row).some(val => val !== '' && val !== null && val !== undefined)
                        })

                        if (hasData) {
                            const fileHeaders = (results.meta.fields || []).map((h: string) => h.trim())
                            setHeaders(fileHeaders)
                            setParsedData(results.data as any[])
                            setIsEmptyFile(false)
                        } else {
                            setIsEmptyFile(true)
                            setHeaders([])
                            setParsedData([])
                        }
                    } catch (error) {
                        console.error('CSV processing error:', error)
                        setIsEmptyFile(true)
                        setHeaders([])
                        setParsedData([])
                        alert(`Error processing CSV file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format.`)
                    }
                },
                error: (error: Error) => {
                    console.error('CSV parsing error:', error)
                    setIsEmptyFile(true)
                    setHeaders([])
                    setParsedData([])
                    alert(`Error parsing CSV file: ${error.message}. Please check the format.`)
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
                        setIsEmptyFile(true)
                        setHeaders([])
                        setParsedData([])
                        alert('Excel file is empty or contains no valid data')
                        return
                    }

                    const fileHeaders = (jsonData[0] as any[]).map((h: any) => String(h || '').trim())

                    if (fileHeaders.length === 0 || fileHeaders.every(h => !h)) {
                        setIsEmptyFile(true)
                        setHeaders([])
                        setParsedData([])
                        alert('Excel file does not contain valid headers')
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

                    // Check if rows have actual content
                    const hasData = rows.length > 0 && rows.some(row => {
                        return Object.values(row).some(val => val !== '' && val !== null && val !== undefined)
                    })

                    if (hasData) {
                        setHeaders(fileHeaders)
                        setParsedData(rows)
                        setIsEmptyFile(false)
                    } else {
                        setIsEmptyFile(true)
                        setHeaders([])
                        setParsedData([])
                    }
                } catch (error) {
                    console.error('Excel parsing error:', error)
                    setIsEmptyFile(true)
                    setHeaders([])
                    setParsedData([])
                    alert(`Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the format.`)
                }
            }
            reader.readAsArrayBuffer(uploadedFile)
        }
    }

    const validateHeaders = () => {
        // Check if each expected field has a matching header (using flexible matching)
        const missing = expectedFields.filter(field => {
            const fieldLower = normalize(field)
            // Check if any header matches the field name or its variations
            return !headers.some(header => {
                const headerLower = normalize(header)
                // Direct match
                if (headerLower === fieldLower) return true

                // Check against possible name variations for each field
                if (field === 'name') {
                    const nameVariations = ['name', 'schedule name', 'schedule', 'schedule_name', 'schedule-name']
                    return nameVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'product') {
                    const productVariations = ['product', 'product name', 'productname', 'product_name', 'product-name']
                    return productVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'scheduleType') {
                    const scheduleTypeVariations = ['schedule type', 'scheduletype', 'schedule_type', 'schedule-type', 'type']
                    return scheduleTypeVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'status') {
                    const statusVariations = ['status', 'schedule status', 'schedulestatus', 'status_type', 'status-type']
                    return statusVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'description') {
                    const descVariations = ['description', 'desc', 'details', 'notes', 'comment']
                    return descVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'startDate') {
                    const startDateVariations = ['start date', 'startdate', 'start_date', 'start-date', 'begin date', 'begindate', 'from date', 'fromdate']
                    return startDateVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'endDate') {
                    const endDateVariations = ['end date', 'enddate', 'end_date', 'end-date', 'finish date', 'finishdate', 'to date', 'todate']
                    return endDateVariations.some(v => normalize(v) === headerLower)
                }
                return false
            })
        })

        // Check for extra headers (headers that don't match any expected field)
        const extra = headers.filter(header => {
            const headerLower = normalize(header)
            return !expectedFields.some(field => {
                const fieldLower = normalize(field)
                // Direct match
                if (headerLower === fieldLower) return true

                // Check against possible name variations for each field
                if (field === 'name') {
                    const nameVariations = ['name', 'schedule name', 'schedule', 'schedule_name', 'schedule-name']
                    return nameVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'product') {
                    const productVariations = ['product', 'product name', 'productname', 'product_name', 'product-name']
                    return productVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'scheduleType') {
                    const scheduleTypeVariations = ['schedule type', 'scheduletype', 'schedule_type', 'schedule-type', 'type']
                    return scheduleTypeVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'status') {
                    const statusVariations = ['status', 'schedule status', 'schedulestatus', 'status_type', 'status-type']
                    return statusVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'description') {
                    const descVariations = ['description', 'desc', 'details', 'notes', 'comment']
                    return descVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'startDate') {
                    const startDateVariations = ['start date', 'startdate', 'start_date', 'start-date', 'begin date', 'begindate', 'from date', 'fromdate']
                    return startDateVariations.some(v => normalize(v) === headerLower)
                }
                if (field === 'endDate') {
                    const endDateVariations = ['end date', 'enddate', 'end_date', 'end-date', 'finish date', 'finishdate', 'to date', 'todate']
                    return endDateVariations.some(v => normalize(v) === headerLower)
                }
                return false
            })
        })

        if (missing.length > 0 || extra.length > 0) {
            setHeaderErrors({ missing, extra })
        } else {
            setHeaderErrors(null)
        }
    }

    const validateData = () => {
        const errors: ValidationError[] = []

        // Create mapping from field names to labels (for display)
        const fieldToLabelMap: Record<string, string> = {}
        scheduleFormFields.forEach(field => {
            fieldToLabelMap[field.name] = field.label
        })

        filteredData.forEach((row, index) => {
            // Check required fields
            requiredFields.forEach((field) => {
                const value = row[field]
                // Treat "-" as empty
                if (!value || value === '-' || (typeof value === 'string' && value.trim() === '')) {
                    const displayLabel = fieldToLabelMap[field] || field
                    errors.push({
                        row: index + 1,
                        field: field, // Use field name as key
                        message: `${displayLabel} is required`,
                    })
                }
            })

            // Validate field types (only if value exists and is not "-")
            Object.keys(fieldTypes).forEach((field) => {
                const value = row[field]
                if (value !== undefined && value !== null && value !== '' && value !== '-') {
                    const expectedType = fieldTypes[field]
                    const displayLabel = fieldToLabelMap[field] || field

                    if (expectedType === 'date') {
                        const dateValue = new Date(value)
                        if (isNaN(dateValue.getTime())) {
                            errors.push({
                                row: index + 1,
                                field: field, // Use field name as key
                                message: `${displayLabel} must be a valid date (DD/MM/YYYY)`,
                            })
                        }
                    } else if (expectedType === 'string' && typeof value !== 'string') {
                        errors.push({
                            row: index + 1,
                            field: field, // Use field name as key
                            message: `${displayLabel} must be a string`,
                        })
                    }
                }
            })

            // Validate scheduleType field values (only if value exists and is not "-")
            if (row.scheduleType && row.scheduleType !== '-') {
                const validScheduleTypes = ['PCE', 'Vested']
                if (!validScheduleTypes.includes(String(row.scheduleType))) {
                    const displayLabel = fieldToLabelMap['scheduleType'] || 'Schedule Type'
                    errors.push({
                        row: index + 1,
                        field: 'scheduleType',
                        message: `${displayLabel} must be one of: ${validScheduleTypes.join(', ')}`,
                    })
                }
            }

            // Status is always set to "Active" in bulk upload and is not shown in the preview table
            // No validation needed for status in bulk upload context
        })

        setValidationErrors(errors)
        // Data is valid only if there are no validation errors AND no header errors
        setIsValid(errors.length === 0 && !headerErrors)
    }

    const getCellError = (rowIndex: number, fieldName: string): ValidationError | undefined => {
        return validationErrors.find(error => error.row === rowIndex + 1 && error.field === fieldName)
    }

    const handleEditRow = (rowIndex: number) => {
        setEditingRowIndex(rowIndex)
        setEditDrawerOpen(true)
    }

    const handleSaveRow = (values: any) => {
        if (editingRowIndex !== null) {
            // Update only the specific row in filteredData without resetting the entire array
            setFilteredData(prevData => {
                const updatedData = [...prevData]
                // Update only the edited row
                updatedData[editingRowIndex] = {
                    ...updatedData[editingRowIndex],
                    ...values
                }
                return updatedData
            })

            // Also update parsedData to maintain consistency - update only the specific row
            setParsedData(prevParsedData => {
                const updatedParsedData = [...prevParsedData]
                // Map values back to original file headers
                const row: any = { ...updatedParsedData[editingRowIndex] } // Keep existing row data

                headers.forEach(fileHeader => {
                    const headerLower = normalize(fileHeader)
                    const matchingField = expectedFields.find(f =>
                        normalize(f) === headerLower
                    )

                    // Check against possible name variations
                    if (!matchingField) {
                        // Try to find matching field by checking variations
                        expectedFields.forEach(field => {
                            let matches = false

                            if (field === 'name') {
                                matches = ['name', 'schedule name', 'schedule', 'schedule_name', 'schedule-name'].some(v => normalize(v) === headerLower)
                            } else if (field === 'product') {
                                matches = ['product', 'product name', 'productname', 'product_name', 'product-name'].some(v => normalize(v) === headerLower)
                            } else if (field === 'scheduleType') {
                                matches = ['schedule type', 'scheduletype', 'schedule_type', 'schedule-type', 'type'].some(v => normalize(v) === headerLower)
                            } else if (field === 'status') {
                                matches = ['status', 'schedule status', 'schedulestatus', 'status_type', 'status-type'].some(v => normalize(v) === headerLower)
                            } else if (field === 'description') {
                                matches = ['description', 'desc', 'details', 'notes', 'comment'].some(v => normalize(v) === headerLower)
                            } else if (field === 'startDate') {
                                matches = ['startdate', 'start date', 'start_date', 'start-date', 'begin date', 'begindate', 'from date', 'fromdate'].some(v => normalize(v) === headerLower)
                            } else if (field === 'endDate') {
                                matches = ['enddate', 'end date', 'end_date', 'end-date', 'finish date', 'finishdate', 'to date', 'todate'].some(v => normalize(v) === headerLower)
                            }

                            if (matches && values[field] !== undefined) {
                                let value = values[field]
                                if (value instanceof Date) {
                                    value = value.toISOString().split('T')[0]
                                }
                                row[fileHeader] = value
                            }
                        })
                    } else if (values[matchingField] !== undefined) {
                        // Convert Date objects to strings for display
                        let value = values[matchingField]
                        if (value instanceof Date) {
                            value = value.toISOString().split('T')[0]
                        }
                        row[fileHeader] = value
                    }
                })

                updatedParsedData[editingRowIndex] = row
                return updatedParsedData
            })

            setEditDrawerOpen(false)
            setEditingRowIndex(null)
        }
    }

    const handleDownloadTemplate = () => {
        // Create template with headers using labels from constants, excluding status
        // Status will default to "Active" when uploaded
        const templateHeaders = scheduleFormFields
            .filter(field => field.name !== 'status') // Exclude status from template
            .map(field => {
                // Use label from constants, capitalize properly
                const label = field.label || field.name
                // Capitalize first letter of each word
                return label.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ')
            })

        // Add sample row with empty values (user will fill)
        const templateData = [
            templateHeaders,
            templateHeaders.map(() => '')
        ]

        // Create workbook
        const wb = XLSX.utils.book_new()
        const ws = XLSX.utils.aoa_to_sheet(templateData)

        // Set column widths
        const colWidths = templateHeaders.map(() => ({ wch: 20 }))
        ws['!cols'] = colWidths

        XLSX.utils.book_append_sheet(wb, ws, 'Schedule Template')
        XLSX.writeFile(wb, 'Schedule_Template.xlsx')
    }

    // Calculate if upload button should be disabled
    const isUploadDisabled = !file || isEmptyFile || !isValid || filteredData.length === 0

    // Notify parent about button state
    useEffect(() => {
        if (onUploadButtonStateChange) {
            onUploadButtonStateChange(isUploadDisabled)
        }
    }, [isUploadDisabled, onUploadButtonStateChange])

    // Handle upload
    const handleUpload = () => {
        if (!isUploadDisabled && filteredData.length > 0) {
            onSave(filteredData)
        }
    }

    // Listen for upload trigger from parent
    useEffect(() => {
        const handleUploadTrigger = () => {
            handleUpload()
        }
        window.addEventListener('bulk-upload-trigger', handleUploadTrigger)
        return () => {
            window.removeEventListener('bulk-upload-trigger', handleUploadTrigger)
        }
    }, [isUploadDisabled, filteredData, onSave, file, isEmptyFile, isValid, validationErrors.length, headerErrors])

    const handleDeleteRow = (rowIndex: number) => {

        const updatedData = [...filteredData]
        updatedData.splice(rowIndex, 1)
        setFilteredData(updatedData)
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div />
                    <Button
                        variant="outlined"
                        startIcon={<Download size={16} />}
                        onClick={handleDownloadTemplate}
                        sx={{ textTransform: 'none' }}
                    >
                        Download Template
                    </Button>
                </Box>

                <AppFileUpload
                    name="bulkUpload"
                    value={file}
                    onChange={(_name, file) => {
                        setFile(file)
                        if (!file) {
                            // Reset all state when file is removed
                            setParsedData([])
                            setFilteredData([])
                            setHeaders([])
                            setFilteredHeaders([])
                            setValidationErrors([])
                            setHeaderErrors(null)
                            setIsValid(false)
                        }
                    }}
                    accept=".xlsx,.xls,.csv"
                    maxSize={100}
                    placeholder="Upload Excel or CSV file"
                    allowedFileTypes={['xlsx', 'xls', 'csv']}
                />

                {/* Empty File Error */}
                {isEmptyFile && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            No Data Available
                        </Typography>
                        <Typography variant="body2">
                            The uploaded file does not contain any data. Please upload a valid file with data rows.
                        </Typography>
                    </Alert>
                )}

                {/* Header Mismatch Error */}
                {!isEmptyFile && headerErrors && (headerErrors.missing.length > 0 || headerErrors.extra.length > 0) && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                            Header Mismatch Detected
                        </Typography>
                        {headerErrors.missing.length > 0 && (
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Missing Required Headers:
                                </Typography>
                                <Box component="ul" sx={{ m: 0, pl: 2, mt: 0.5 }}>
                                    {headerErrors.missing.map((header, idx) => (
                                        <li key={idx}>
                                            <Typography variant="caption" textTransform="capitalize">{header}</Typography>
                                        </li>
                                    ))}
                                </Box>
                            </Box>
                        )}

                    </Alert>
                )}

                {!isEmptyFile && filteredData.length > 0 && (
                    <Box>


                        <AppTable
                            tableTitle={

                                `Preview Data (${filteredData.length} rows)`

                            }
                            tableActions={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {isValid ? (
                                        <Chip
                                            icon={<CheckCircle size={16} />}
                                            label="Valid"
                                            color="success"
                                            size="small"
                                        />
                                    ) : (
                                        <Chip
                                            icon={<AlertCircle size={16} />}
                                            label={`${validationErrors.length + (headerErrors ? 1 : 0)} error(s)`}
                                            color="error"
                                            size="small"
                                        />
                                    )}
                                </Box>
                            }
                            columns={filteredHeaders.map((fieldName) => {
                                const field = scheduleFormFields.find(f => f.name === fieldName)
                                const label = field?.label || fieldName
                                const isRequired = field ? requiredFields.includes(fieldName) : false
                                return {
                                    id: fieldName,
                                    label: isRequired ? `${label} *` : label,
                                    minWidth: 150,
                                    align: 'left' as const,
                                    renderItem: (row: any) => {
                                        const rowIndex = row._rowIndex || 0
                                        const cellError = getCellError(rowIndex, fieldName)
                                        const value = row[fieldName] || '-'
                                        const isEmpty = value === '-' || value === '' || !value
                                        return (


                                            cellError ? (
                                                <Tooltip
                                                    title={cellError ? `${cellError.message}` : ''
                                                    }
                                                    arrow
                                                    disableHoverListener={!cellError
                                                    }
                                                    placement="top"
                                                >
                                                    <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                                                </Tooltip>
                                            ) :
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: isEmpty
                                                            ? 'text.secondary'
                                                            : cellError
                                                                ? 'error.main'
                                                                : 'text.primary',
                                                        fontWeight: cellError ? 500 : 400,
                                                        fontStyle: isEmpty ? 'italic' : 'normal',
                                                    }}
                                                >
                                                    {isEmpty ? cellError ? '' : "-" : String(value)}
                                                </Typography>


                                        )
                                    },
                                }
                            })}
                            rows={filteredData.map((row, index) => ({
                                ...row,
                                id: `row-${index}`,
                                _rowIndex: index, // Store row index for edit functionality
                            }))}
                            onEdit={(row) => handleEditRow(row._rowIndex)}

                            onDelete={(row) => handleDeleteRow(row._rowIndex)}

                        />


                    </Box>
                )}
            </Box >

            {/* Edit Row Drawer */}
            < AppDrawer
                open={editDrawerOpen}
                onClose={() => {
                    setEditDrawerOpen(false)
                    setEditingRowIndex(null)
                }}
                anchor="right"
                width={600}
                title={`Edit Row ${editingRowIndex !== null ? editingRowIndex + 1 : ''}`}
                footer={
                    < Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                setEditDrawerOpen(false)
                                setEditingRowIndex(null)
                            }}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                            type="submit"
                            form="edit-row-form"
                        >
                            Save
                        </Button>
                    </Box >
                }
            >
                {editingRowIndex !== null && (() => {
                    const rowData = filteredData[editingRowIndex]
                    // Convert date strings to Date objects for datePicker fields
                    const processedRowData = { ...rowData }
                    scheduleFormFields.forEach((field) => {
                        if ((field.component === 'datePicker' || field.component === 'date') && processedRowData[field.name]) {
                            const dateValue = processedRowData[field.name]
                            if (typeof dateValue === 'string') {
                                processedRowData[field.name] = new Date(dateValue)
                            }
                        }
                    })
                    return (
                        <ScheduleForm
                            onSave={handleSaveRow}
                            initialValues={processedRowData}
                        />
                    )
                })()}
            </AppDrawer >
        </>
    )
}

export default BulkUploadForm
