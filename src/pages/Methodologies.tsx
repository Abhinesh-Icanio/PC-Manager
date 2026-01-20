import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import AppSelect from '../app/components/AppSelect'
import AppTable from '../app/components/AppTable'
import Layout from '../app/components/Layout'

interface Methodology {
  id: string
  name: string
  rateTable: string
  status: 'Active' | 'Inactive' | 'Draft'
  createdAt: string
  efficiency: string
}

const Methodologies = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [rateTableFilter, setRateTableFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedRows, setSelectedRows] = useState<Methodology[]>([])

  // Dummy data
  const [methodologies] = useState<Methodology[]>([
    { id: '1', name: 'Tiered Methodology Delta', rateTable: 'Standard Rate Table', status: 'Active', createdAt: 'Nov 04, 2025', efficiency: '99.1%' },
    { id: '2', name: 'Linear Methodology Alpha', rateTable: 'Premium Rate Table', status: 'Active', createdAt: 'Nov 03, 2025', efficiency: '95.5%' },
    { id: '3', name: 'Exponential Methodology Beta', rateTable: 'Basic Rate Table', status: 'Draft', createdAt: 'Nov 01, 2025', efficiency: '87.2%' },
    { id: '4', name: 'Custom Methodology Gamma', rateTable: 'Enterprise Rate Table', status: 'Active', createdAt: 'Oct 31, 2025', efficiency: '98.8%' },
    { id: '5', name: 'Standard Methodology Epsilon', rateTable: 'Custom Rate Table', status: 'Active', createdAt: 'Oct 23, 2025', efficiency: '92.3%' },
    { id: '6', name: 'Advanced Methodology Zeta', rateTable: 'Tier 1 Rate Table', status: 'Inactive', createdAt: 'Oct 20, 2025', efficiency: '85.7%' },
    { id: '7', name: 'Hybrid Methodology Eta', rateTable: 'Tier 2 Rate Table', status: 'Active', createdAt: 'Oct 15, 2025', efficiency: '96.4%' },
    { id: '8', name: 'Optimized Methodology Theta', rateTable: 'Tier 3 Rate Table', status: 'Draft', createdAt: 'Oct 10, 2025', efficiency: '89.1%' },
    { id: '9', name: 'Dynamic Methodology Iota', rateTable: 'Special Rate Table', status: 'Active', createdAt: 'Oct 05, 2025', efficiency: '94.6%' },
    { id: '10', name: 'Static Methodology Kappa', rateTable: 'Default Rate Table', status: 'Active', createdAt: 'Oct 01, 2025', efficiency: '91.2%' },
  ])

  const rateTableOptions = [
    { label: 'All', value: 'All' },
    { label: 'Standard Rate Table', value: 'Standard Rate Table' },
    { label: 'Premium Rate Table', value: 'Premium Rate Table' },
    { label: 'Basic Rate Table', value: 'Basic Rate Table' },
    { label: 'Enterprise Rate Table', value: 'Enterprise Rate Table' },
    { label: 'Custom Rate Table', value: 'Custom Rate Table' },
  ]

  const statusOptions = [
    { label: 'All Status', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Draft', value: 'Draft' },
  ]

  const columns = [
    { id: 'name', label: 'Name', minWidth: 250, align: 'left' as const },
    { id: 'rateTable', label: 'Rate Table', minWidth: 200, align: 'left' as const },
    { id: 'efficiency', label: 'Efficiency', minWidth: 120, align: 'right' as const },
    { id: 'createdAt', label: 'Created At', minWidth: 120, align: 'left' as const },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center' as const,
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

  const filteredMethodologies = methodologies.filter((methodology) => {
    const matchesSearch = methodology.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      methodology.rateTable.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRateTable = rateTableFilter === 'All' || methodology.rateTable === rateTableFilter
    const matchesStatus = statusFilter === 'All' || methodology.status === statusFilter
    return matchesSearch && matchesRateTable && matchesStatus
  })

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(filteredMethodologies)
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (row: Methodology, selected: boolean) => {
    if (selected) {
      setSelectedRows([...selectedRows, row])
    } else {
      setSelectedRows(selectedRows.filter((r) => r.id !== row.id))
    }
  }

  return (
    <Layout
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              Methodologies
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage methodologies in your organization
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{ textTransform: 'none' }}
          >
            Create Methodology
          </Button>
        </Box>
      }
    >
      <AppTable
        filters={
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search by name or rate table..."
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
            <Box sx={{ minWidth: 200 }}>
              <AppSelect
                options={rateTableOptions}
                value={rateTableFilter}
                onChange={(value: string) => setRateTableFilter(value)}
                label="Rate Table"
                placeholder="Select rate table..."
                size="small"
              />
            </Box>
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
        tableTitle={`Methodologies (${filteredMethodologies.length})`}
        columns={columns}
        rows={filteredMethodologies}
        selectable
        selectedRows={selectedRows}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => console.log('Delete', row)}
      />
    </Layout>
  )
}

export default Methodologies
