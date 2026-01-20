import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'

interface Column {
  id: string
  label: string
  minWidth?: number
  align?: 'right' | 'left' | 'center'
  format?: (value: any) => React.ReactNode
  renderItem?: (row: any) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  rows: any[]
  onRowClick?: (row: any) => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onView?: (row: any) => void
  selectable?: boolean
  onSelectAll?: (selected: boolean) => void
  onSelectRow?: (row: any, selected: boolean) => void
  selectedRows?: any[]
}

const DataTable = ({
  columns,
  rows,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  selectable = false,
  onSelectAll,
  onSelectRow,
  selectedRows = [],
}: DataTableProps) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any>(null)

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: any) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked)
    }
  }

  const handleSelectRow = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    if (onSelectRow) {
      onSelectRow(row, event.target.checked)
    }
  }

  const isSelected = (row: any) => {
    return selectedRows.some((selected) => selected.id === row.id)
  }

  const isAllSelected = rows.length > 0 && selectedRows.length === rows.length
  const hasActions = Boolean(onEdit || onDelete || onView)

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRows.length > 0 && selectedRows.length < rows.length}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    size='small'
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ minWidth: column.minWidth, fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell align="right" style={{ fontWeight: 600 }}>
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
              const selected = isSelected(row)
              return (
                <TableRow
                  hover
                  key={row.id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onChange={(e) => handleSelectRow(e, row)}
                        size='small'
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = row[column.id]
                    return (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.renderItem
                          ? column.renderItem(row)
                          : column.format
                            ? column.format(value)
                            : value}
                      </TableCell>
                    )
                  })}
                  {hasActions && (
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, row)}
                      >
                        <MoreVertical size={16} />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, rows.length)} of{' '}
          {rows.length} records
        </Typography>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onView && (
          <MenuItem onClick={() => { onView(selectedRow); handleMenuClose() }}>
            <Eye size={16} style={{ marginRight: 8 }} />
            View
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => { onEdit(selectedRow); handleMenuClose() }}>
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => { onDelete(selectedRow); handleMenuClose() }} sx={{ color: 'error.main' }}>
            <Trash2 size={16} style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  )
}

export default DataTable
