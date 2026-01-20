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

interface RateTable {
  id: string
  name: string
  schedule: string
  status: 'Active' | 'Inactive' | 'Draft'
  createdAt: string
  rate: string
}

const RateTables = () => {
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

  const schedules = ['All', 'Q4 2024 Project Alpha Launch', 'Annual Financial Audit Prep', 'New User Onboarding Flow', 'Infrastructure Upgrade Phase 2']

  const columns = [
    { id: 'name', label: 'Name', minWidth: 200 },
    { id: 'schedule', label: 'Schedule', minWidth: 250 },
    { id: 'rate', label: 'Rate', minWidth: 100 },
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
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Rate Tables
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage rate tables in your organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          sx={{ textTransform: 'none' }}
        >
          Create Rate Table
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
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
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Schedule</InputLabel>
              <Select
                value={scheduleFilter}
                label="Schedule"
                onChange={(e) => setScheduleFilter(e.target.value)}
              >
                {schedules.map((schedule) => (
                  <MenuItem key={schedule} value={schedule}>
                    {schedule}
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
                {selectedRows.length} rate table(s) selected
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
              Rate Tables ({filteredRateTables.length})
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
            rows={filteredRateTables}
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

export default RateTables
