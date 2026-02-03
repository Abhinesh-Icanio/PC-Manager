import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
} from '@mui/material'

interface EditableDataTableProps {
  data: any[]
  headers: string[]
  onDataChange?: (data: any[]) => void
}

const EditableDataTable: React.FC<EditableDataTableProps> = ({ data, headers, onDataChange }) => {
  const [editableData, setEditableData] = useState<any[]>(data)
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; header: string } | null>(null)
  const [editValue, setEditValue] = useState<string>('')

  useEffect(() => {
    setEditableData(data)
  }, [data])

  const handleCellClick = (rowIndex: number, header: string, currentValue: any) => {
    setEditingCell({ rowIndex, header })
    setEditValue(String(currentValue || ''))
  }

  const handleCellBlur = () => {
    if (editingCell) {
      const newData = [...editableData]
      newData[editingCell.rowIndex] = {
        ...newData[editingCell.rowIndex],
        [editingCell.header]: editValue,
      }
      setEditableData(newData)
      onDataChange?.(newData)
      setEditingCell(null)
      setEditValue('')
    }
  }

  const handleCellKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellBlur()
    } else if (e.key === 'Escape') {
      setEditingCell(null)
      setEditValue('')
    }
  }

  if (!headers.length || !editableData.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No data to display. Please upload a file.
        </Typography>
      </Paper>
    )
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                sx={{
                  fontWeight: 600,
                  bgcolor: 'background.paper',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {editableData.map((row, rowIndex) => (
            <TableRow key={rowIndex} hover>
              {headers.map((header) => {
                const isEditing =
                  editingCell?.rowIndex === rowIndex && editingCell?.header === header
                const cellValue = row[header] || ''

                return (
                  <TableCell
                    key={header}
                    onClick={() => handleCellClick(rowIndex, header, cellValue)}
                    sx={{ cursor: 'pointer', p: isEditing ? 0.5 : 1 }}
                  >
                    {isEditing ? (
                      <TextField
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={handleCellKeyDown}
                        autoFocus
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          minHeight: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                            px: 1,
                            py: 0.5,
                          },
                        }}
                      >
                        {cellValue}
                      </Box>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default EditableDataTable
