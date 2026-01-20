import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import { Download, Edit, FileText, Plus, Search, Upload } from 'lucide-react'
import { useState } from 'react'
import AppMenu from '../app/components/AppMenu'
import AppSelect from '../app/components/AppSelect'
import AppChip from '../app/components/AppChip'
import AppTable from '../app/components/AppTable'
import Layout from '../app/components/Layout'

interface Schedule {
  id: string
  name: string
  product: string
  status: 'Active' | 'Inactive' | 'Draft'
  createdAt: string
  rateTableCount?: number
  methodologiesCount?: number
}

const Schedules = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [productFilter, setProductFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedRows, setSelectedRows] = useState<Schedule[]>([])

  // Dummy data
  const [schedules] = useState<Schedule[]>([
    { id: '1', name: 'Q4 2024 Project Alpha Launch', product: 'Product Alpha', status: 'Active', createdAt: 'Nov 04, 2025', rateTableCount: 10, methodologiesCount: 20 },
    { id: '2', name: 'Annual Financial Audit Prep', product: 'Product Beta', status: 'Active', createdAt: 'Nov 03, 2025', rateTableCount: 5, methodologiesCount: 12 },
    { id: '3', name: 'New User Onboarding Flow', product: 'Product Gamma', status: 'Draft', createdAt: 'Nov 01, 2025', rateTableCount: 3, methodologiesCount: 8 },
    { id: '4', name: 'Infrastructure Upgrade Phase 2', product: 'Product Delta', status: 'Active', createdAt: 'Oct 31, 2025', rateTableCount: 15, methodologiesCount: 25 },
    { id: '5', name: 'HR Policy Review Cycle', product: 'Product Epsilon', status: 'Active', createdAt: 'Oct 23, 2025', rateTableCount: 8, methodologiesCount: 15 },
    { id: '6', name: 'Marketing Campaign Q1', product: 'Product Zeta', status: 'Inactive', createdAt: 'Oct 20, 2025', rateTableCount: 6, methodologiesCount: 10 },
    { id: '7', name: 'Security Audit Schedule', product: 'Product Eta', status: 'Active', createdAt: 'Oct 15, 2025', rateTableCount: 12, methodologiesCount: 18 },
    { id: '8', name: 'System Maintenance Window', product: 'Product Theta', status: 'Draft', createdAt: 'Oct 10, 2025', rateTableCount: 4, methodologiesCount: 7 },
    { id: '9', name: 'Data Migration Plan', product: 'Product Iota', status: 'Active', createdAt: 'Oct 05, 2025', rateTableCount: 9, methodologiesCount: 14 },
    { id: '10', name: 'Customer Portal Update', product: 'Product Kappa', status: 'Active', createdAt: 'Oct 01, 2025', rateTableCount: 7, methodologiesCount: 11 },
  ])

  const productOptions = [
    { label: 'All', value: 'All' },
    { label: 'Product Alpha', value: 'Product Alpha' },
    { label: 'Product Beta', value: 'Product Beta' },
    { label: 'Product Gamma', value: 'Product Gamma' },
    { label: 'Product Delta', value: 'Product Delta' },
    { label: 'Product Epsilon', value: 'Product Epsilon' },
  ]

  const statusOptions = [
    { label: 'All Status', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Draft', value: 'Draft' },
  ]

  const columns = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 250,
      align: 'left' as const,
      renderItem: (row: Schedule) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
            {row.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {row.rateTableCount !== undefined && (
              <AppChip
                type="rateTable"
                label={`Rate Table - ${row.rateTableCount}`}
                size="small"
              />
            )}
            {row.methodologiesCount !== undefined && (
              <AppChip
                type="methodology"
                label={`Methodologies - ${row.methodologiesCount}`}
                size="small"
              />
            )}
          </Box>
        </Box>
      ),
    },
    { id: 'product', label: 'Product', minWidth: 150, align: 'left' as const },
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
    <Layout
      header={
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              Schedules
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage schedules in your organization
            </Typography>
          </Box>
          <AppMenu
            menuItems={[
              {
                id: 'manual',
                label: 'Manual Creation',
                icon: FileText,
                onClick: () => {
                  console.log('Manual creation')
                  // Add your manual creation logic here
                },
              },
              {
                id: 'bulk',
                label: 'Bulk Upload',
                icon: Upload,
                onClick: () => {
                  console.log('Bulk upload')
                  // Add your bulk upload logic here
                },
              },
            ]}
            trigger={
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{ textTransform: 'none' }}
              >
                Create Schedule
              </Button>
            }
          />
        </Box>
      }
    >
      <AppTable
        filters={
          <>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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
              <Box sx={{ minWidth: 180 }}>
                <AppSelect
                  options={productOptions}
                  value={productFilter}
                  onChange={(value: string) => setProductFilter(value)}
                  label="Product"
                  placeholder="Select product..."
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

            {/* Bulk Actions - Above Table */}
            {selectedRows.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'primary.main',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {selectedRows.length} schedule(s) selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {selectedRows.length > 1 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit size={16} />}
                      onClick={() => {
                        console.log('Edit bulk schedules', selectedRows)
                        // Add your bulk edit logic here
                      }}
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
                      Edit Bulk Schedules
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Download size={16} />}
                    onClick={() => {
                      console.log('Export selected schedules', selectedRows)
                      // Add your export logic here
                    }}
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
                    Export Selected Schedules
                  </Button>
                </Box>
              </Box>
            )}
          </>
        }
        tableTitle={`Schedules (${filteredSchedules.length})`}
        tableActions={
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
            onClick={() => {
              console.log('Export all schedules')
              // Add your export all logic here
            }}
            sx={{ textTransform: 'none' }}
          >
            Export All
          </Button>
        }
        columns={columns}
        rows={filteredSchedules}
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

export default Schedules
