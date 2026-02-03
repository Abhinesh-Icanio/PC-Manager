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
import { useNavigate } from 'react-router-dom'
import AppMenu from '../../appComponents/AppMenu'
import AppSelect from '../../appComponents/AppSelect'
import AppTable from '../../appComponents/AppTable'
import Layout from '../../appComponents/Layout'

interface RateTable {
  id: string
  name: string
  schedule: string
  status: 'Active' | 'Inactive' | 'Draft'
  createdAt: string
  rate: string
}

const RateTables = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [scheduleFilter, setScheduleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedRows, setSelectedRows] = useState<RateTable[]>([])

  // Dummy data
  const [rateTables] = useState<RateTable[]>([
    { id: '1', name: 'Standard Rate Table', schedule: 'Q4 2024 Project Alpha Launch', status: 'Active', createdAt: 'Nov 04, 2025', rate: '12.5%' },
    { id: '2', name: 'Premium Rate Table', schedule: 'Annual Financial Audit Prep', status: 'Active', createdAt: 'Nov 03, 2025', rate: '15.2%' },
    { id: '3', name: 'Basic Rate Table', schedule: 'New User Onboarding Flow', status: 'Draft', createdAt: 'Nov 01, 2025', rate: '8.5%' },
    { id: '4', name: 'Enterprise Rate Table', schedule: 'Infrastructure Upgrade Phase 2', status: 'Active', createdAt: 'Oct 31, 2025', rate: '18.9%' },
    { id: '5', name: 'Custom Rate Table', schedule: 'HR Policy Review Cycle', status: 'Active', createdAt: 'Oct 23, 2025', rate: '10.3%' },
    { id: '6', name: 'Tier 1 Rate Table', schedule: 'Marketing Campaign Q1', status: 'Inactive', createdAt: 'Oct 20, 2025', rate: '9.8%' },
    { id: '7', name: 'Tier 2 Rate Table', schedule: 'Security Audit Schedule', status: 'Active', createdAt: 'Oct 15, 2025', rate: '11.2%' },
    { id: '8', name: 'Tier 3 Rate Table', schedule: 'System Maintenance Window', status: 'Draft', createdAt: 'Oct 10, 2025', rate: '7.5%' },
    { id: '9', name: 'Special Rate Table', schedule: 'Data Migration Plan', status: 'Active', createdAt: 'Oct 05, 2025', rate: '13.7%' },
    { id: '10', name: 'Default Rate Table', schedule: 'Customer Portal Update', status: 'Active', createdAt: 'Oct 01, 2025', rate: '10.0%' },
  ])

  const scheduleOptions = [
    { label: 'All', value: 'All' },
    { label: 'Q4 2024 Project Alpha Launch', value: 'Q4 2024 Project Alpha Launch' },
    { label: 'Annual Financial Audit Prep', value: 'Annual Financial Audit Prep' },
    { label: 'New User Onboarding Flow', value: 'New User Onboarding Flow' },
    { label: 'Infrastructure Upgrade Phase 2', value: 'Infrastructure Upgrade Phase 2' },
  ]

  const statusOptions = [
    { label: 'All Status', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Draft', value: 'Draft' },
  ]

  const columns = [
    { id: 'name', label: 'Name', minWidth: 200, align: 'left' as const },
    { id: 'schedule', label: 'Schedule', minWidth: 250, align: 'left' as const },
    { id: 'rate', label: 'Rate', minWidth: 100, align: 'right' as const },
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

  const filteredRateTables = rateTables.filter((table) => {
    const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.schedule.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchedule = scheduleFilter === 'All' || table.schedule === scheduleFilter
    const matchesStatus = statusFilter === 'All' || table.status === statusFilter
    return matchesSearch && matchesSchedule && matchesStatus
  })

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(filteredRateTables)
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (row: RateTable, selected: boolean) => {
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
              Rate Tables
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage rate tables in your organization
            </Typography>
          </Box>
          <AppMenu
            menuItems={[
              {
                id: 'manual',
                label: 'Manual Creation',
                icon: FileText,
                onClick: () => {
                  navigate('/rate-tables/create')
                },
              },
              {
                id: 'bulk',
                label: 'Bulk Upload',
                icon: Upload,
                onClick: () => {
                  navigate('/rate-tables/create')
                },
              },
            ]}
            trigger={
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                sx={{ textTransform: 'none' }}
              >
                Create Rate Table
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
                placeholder="Search by name or schedule..."
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
              <Box sx={{ minWidth: 250 }}>
                <AppSelect
                  options={scheduleOptions}
                  value={scheduleFilter}
                  onChange={(value: string) => setScheduleFilter(value)}
                  label="Schedule"
                  placeholder="Select schedule..."
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
                  {selectedRows.length} rate table(s) selected
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {selectedRows.length > 1 && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Edit size={16} />}
                      onClick={() => {
                        console.log('Edit bulk rate tables', selectedRows)
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
                      Edit Bulk Rate Tables
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Download size={16} />}
                    onClick={() => {
                      console.log('Export selected rate tables', selectedRows)
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
                    Export Selected Rate Tables
                  </Button>
                </Box>
              </Box>
            )}
          </>
        }
        tableTitle={`Rate Tables (${filteredRateTables.length})`}
        tableActions={
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
            onClick={() => {
              console.log('Export all rate tables')
            }}
            sx={{ textTransform: 'none' }}
          >
            Export All
          </Button>
        }
        columns={columns}
        rows={filteredRateTables}
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

export default RateTables
