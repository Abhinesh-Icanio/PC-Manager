import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Download, Plus, Search, Upload } from 'lucide-react'
import { useState } from 'react'
import DataTable from '../app/components/DataTable'

interface Schedule {
  id: string
  name: string
  product: string
  status: 'Active' | 'Inactive' | 'Draft'
  createdAt: string
  node: string
}

const Schedules = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [productFilter, setProductFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedRows, setSelectedRows] = useState<Schedule[]>([])

  // Dummy data
  const [schedules] = useState<Schedule[]>([
    { id: '1', name: 'Q4 2024 Project Alpha Launch', product: 'Product Alpha', status: 'Active', createdAt: 'Nov 04, 2025', node: 'HK-42' },
    { id: '2', name: 'Annual Financial Audit Prep', product: 'Product Beta', status: 'Active', createdAt: 'Nov 03, 2025', node: 'US-E1' },
    { id: '3', name: 'New User Onboarding Flow', product: 'Product Gamma', status: 'Draft', createdAt: 'Nov 01, 2025', node: 'EU-W2' },
    { id: '4', name: 'Infrastructure Upgrade Phase 2', product: 'Product Delta', status: 'Active', createdAt: 'Oct 31, 2025', node: 'US-E1' },
    { id: '5', name: 'HR Policy Review Cycle', product: 'Product Epsilon', status: 'Active', createdAt: 'Oct 23, 2025', node: 'HK-42' },
    { id: '6', name: 'Marketing Campaign Q1', product: 'Product Zeta', status: 'Inactive', createdAt: 'Oct 20, 2025', node: 'EU-W2' },
    { id: '7', name: 'Security Audit Schedule', product: 'Product Eta', status: 'Active', createdAt: 'Oct 15, 2025', node: 'US-E1' },
    { id: '8', name: 'System Maintenance Window', product: 'Product Theta', status: 'Draft', createdAt: 'Oct 10, 2025', node: 'HK-42' },
    { id: '9', name: 'Data Migration Plan', product: 'Product Iota', status: 'Active', createdAt: 'Oct 05, 2025', node: 'EU-W2' },
    { id: '10', name: 'Customer Portal Update', product: 'Product Kappa', status: 'Active', createdAt: 'Oct 01, 2025', node: 'US-E1' },
  ])

  const products = ['All', 'Product Alpha', 'Product Beta', 'Product Gamma', 'Product Delta', 'Product Epsilon']

  const columns = [
    { id: 'name', label: 'Name', minWidth: 250 },
    { id: 'product', label: 'Product', minWidth: 150 },
    { id: 'node', label: 'Node', minWidth: 100 },
    { id: 'createdAt', label: 'Created At', minWidth: 120 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value: string) => {
        const colorMap: Record<string, 'success' | 'default' | 'warning'> = {
          Active: 'success',
          Inactive: 'default',
          Draft: 'warning',
        }
        return (
          <Chip
            label={value}
            color={colorMap[value] || 'default'}
            size="small"
          />
        )
      },
    },
  ]

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProduct = productFilter === 'All' || schedule.product === productFilter
    const matchesStatus = statusFilter === 'All' || schedule.status === statusFilter
    return matchesSearch && matchesProduct && matchesStatus
  })

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(filteredSchedules)
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (row: Schedule, selected: boolean) => {
    if (selected) {
      setSelectedRows([...selectedRows, row])
    } else {
      setSelectedRows(selectedRows.filter((r) => r.id !== row.id))
    }
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Schedules
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage schedules in your organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          sx={{ textTransform: 'none' }}
        >
          Create Schedule
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search by name or product..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: 300 }}
            />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Product</InputLabel>
              <Select
                value={productFilter}
                label="Product"
                onChange={(e) => setProductFilter(e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {selectedRows.length} schedule(s) selected
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Upload size={16} />}
                  sx={{
                    textTransform: 'none',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Bulk Upload
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Download size={16} />}
                  sx={{
                    textTransform: 'none',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Export
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Schedules ({filteredSchedules.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Upload size={16} />}
                sx={{ textTransform: 'none' }}
              >
                Import XLSX
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Download size={16} />}
                sx={{ textTransform: 'none' }}
              >
                Export
              </Button>
            </Box>
          </Box>
          <DataTable
            columns={columns}
            rows={filteredSchedules}
            selectable
            selectedRows={selectedRows}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => console.log('Delete', row)}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default Schedules
