import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material'
import { Search, Plus } from 'lucide-react'
import DataTable from '../app/components/DataTable'
import { useState } from 'react'

interface Product {
  id: string
  name: string
  status: 'Active' | 'Inactive'
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedRows, setSelectedRows] = useState<Product[]>([])

  // Dummy data
  const [products] = useState<Product[]>([
    { id: '1', name: 'Product Alpha', status: 'Active' },
    { id: '2', name: 'Product Beta', status: 'Active' },
    { id: '3', name: 'Product Gamma', status: 'Inactive' },
    { id: '4', name: 'Product Delta', status: 'Active' },
    { id: '5', name: 'Product Epsilon', status: 'Active' },
    { id: '6', name: 'Product Zeta', status: 'Inactive' },
    { id: '7', name: 'Product Eta', status: 'Active' },
    { id: '8', name: 'Product Theta', status: 'Active' },
    { id: '9', name: 'Product Iota', status: 'Inactive' },
    { id: '10', name: 'Product Kappa', status: 'Active' },
  ])

  const columns = [
    { id: 'name', label: 'Name', minWidth: 200 },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value: string) => (
        <Chip
          label={value}
          color={value === 'Active' ? 'success' : 'default'}
          size="small"
        />
      ),
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(filteredProducts)
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (row: Product, selected: boolean) => {
    if (selected) {
      setSelectedRows([...selectedRows, row])
    } else {
      setSelectedRows(selectedRows.filter((r) => r.id !== row.id))
    }
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
          Products
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Manage products in your organization
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search by name..."
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
              </Select>
            </FormControl>
          
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Products ({filteredProducts.length})
            </Typography>
          </Box>
          <DataTable
            columns={columns}
            rows={filteredProducts}
            selectable
            selectedRows={selectedRows}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default Products
