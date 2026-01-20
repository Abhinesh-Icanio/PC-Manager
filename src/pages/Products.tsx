import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Search } from 'lucide-react'
import { useState } from 'react'
import AppSelect from '../app/components/AppSelect'
import AppTable from '../app/components/AppTable'
import Layout from '../app/components/Layout'

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
    { id: 'name', label: 'Name', minWidth: 200, align: 'left' as const },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center' as const,
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

  const statusOptions = [
    { label: 'All Status', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ]

  return (
    <Layout
      header={
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Products
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage products in your organization
          </Typography>
        </Box>
      }
    >
      <AppTable
        filters={
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
            <Box sx={{ minWidth: 150 }}>
              <AppSelect
                options={statusOptions}
                value={statusFilter}
                onChange={(value: string) => setStatusFilter(value)}
                label="Status"
                placeholder="Select status..."
                size="small"
              />
            </Box>
          </Box>
        }
        tableTitle={`Products (${filteredProducts.length})`}
        columns={columns}
        rows={filteredProducts}
        selectable
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
      />
    </Layout>
  )
}

export default Products
