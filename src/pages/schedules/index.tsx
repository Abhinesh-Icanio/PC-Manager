import {
    Box,
    Button,
    Chip,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { Download, Edit, FileText, Plus, Search, Upload } from 'lucide-react'
import { useState, useRef } from 'react'
import AppMenu from '../../appComponents/AppMenu'
import AppSelect from '../../appComponents/AppSelect'
import AppChip from '../../appComponents/AppChip'
import AppTable from '../../appComponents/AppTable'
import Layout from '../../appComponents/Layout'
import AppDrawer from '../../appComponents/AppDrawer'
import ScheduleForm, { ScheduleFormRef } from './ScheduleForm'
import BulkUploadForm from './BulkUploadForm'

interface Schedule {
    id: string
    name: string
    product: string
    scheduleType?: string
    status: 'Active' | 'Inactive' | 'Draft'
    createdAt?: string
    startDate?: string
    endDate?: string
    description?: string
    rateTableCount?: number
    methodologiesCount?: number
    version?: string
}

const Schedules = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [productFilter, setProductFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [selectedRows, setSelectedRows] = useState<Schedule[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
    const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
    const [bulkUploadButtonDisabled, setBulkUploadButtonDisabled] = useState(true)
    const formRef = useRef<ScheduleFormRef>(null)

    // Dummy data
    const [schedules, setSchedules] = useState<Schedule[]>([
        { id: '1', name: 'Q4 2024 Project Alpha Launch', scheduleType: 'Vested', product: 'Product Alpha', status: 'Active', createdAt: 'Nov 04, 2025', rateTableCount: 10, methodologiesCount: 20, version: '1.00' },
        { id: '2', name: 'Annual Financial Audit Prep', scheduleType: 'PCE', product: 'Product Beta', status: 'Active', createdAt: 'Nov 03, 2025', rateTableCount: 5, methodologiesCount: 12, version: '1.00' },
        { id: '3', name: 'New User Onboarding Flow', scheduleType: 'PCE', product: 'Product Gamma', status: 'Draft', createdAt: 'Nov 01, 2025', rateTableCount: 3, methodologiesCount: 8, version: '1.00' },
        { id: '4', name: 'Infrastructure Upgrade Phase 2', scheduleType: 'PCE', product: 'Product Delta', status: 'Active', createdAt: 'Oct 31, 2025', rateTableCount: 15, methodologiesCount: 25, version: '1.00' },
        { id: '5', name: 'HR Policy Review Cycle', scheduleType: 'Vested', product: 'Product Epsilon', status: 'Active', createdAt: 'Oct 23, 2025', rateTableCount: 8, methodologiesCount: 15, version: '1.00' },
        { id: '6', name: 'Marketing Campaign Q1', scheduleType: 'PCE', product: 'Product Zeta', status: 'Inactive', createdAt: 'Oct 20, 2025', rateTableCount: 6, methodologiesCount: 10, version: '1.00' },
        { id: '7', name: 'Security Audit Schedule', scheduleType: 'PCE', product: 'Product Eta', status: 'Active', createdAt: 'Oct 15, 2025', rateTableCount: 12, methodologiesCount: 18, version: '1.00' },
        { id: '8', name: 'System Maintenance Window', scheduleType: 'Vested', product: 'Product Theta', status: 'Draft', createdAt: 'Oct 10, 2025', rateTableCount: 4, methodologiesCount: 7, version: '1.00' },
        { id: '9', name: 'Data Migration Plan', scheduleType: 'PCE', product: 'Product Iota', status: 'Active', createdAt: 'Oct 05, 2025', rateTableCount: 9, methodologiesCount: 14, version: '1.00' },
        { id: '10', name: 'Customer Portal Update', scheduleType: 'Vested', product: 'Product Kappa', status: 'Active', createdAt: 'Oct 01, 2025', rateTableCount: 7, methodologiesCount: 11, version: '1.00' },
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
        { id: 'scheduleType', label: 'Schedule Type', minWidth: 150, align: 'left' as const },
        {
            id: 'version',
            label: 'Version',
            minWidth: 100,
            align: 'center' as const,
            format: (value: string) => value || '1.00',
        },
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

    const filteredSchedules = schedules
        .filter((schedule) => {
            const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                schedule.product.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesProduct = productFilter === 'All' || schedule.product === productFilter
            const matchesStatus = statusFilter === 'All' || schedule.status === statusFilter
            return matchesSearch && matchesProduct && matchesStatus
        })
        .sort((a, b) => {
            // Sort by createdAt date (newest first)
            if (!a.createdAt && !b.createdAt) return 0
            if (!a.createdAt) return 1
            if (!b.createdAt) return -1

            // Parse dates from format "Nov 04, 2025"
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)

            // Sort descending (newest first)
            return dateB.getTime() - dateA.getTime()
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

    const handleSave = (values: any) => {
        console.log('Form values:', values)
        // Add save logic here
        // values will include scheduleType along with other fields like product, name, etc.
        if (editingSchedule) {
            // Update existing schedule
            const updatedSchedules = schedules.map(s =>
                s.id === editingSchedule.id
                    ? { ...s, ...values, version: s.version || '1.00' }
                    : s
            )
            setSchedules(updatedSchedules)
            console.log('Updating schedule:', { ...editingSchedule, ...values })
        } else {
            // Create new schedule
            const newSchedule: Schedule = {
                id: String(schedules.length + 1),
                ...values,
                version: '1.00',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                rateTableCount: 0,
                methodologiesCount: 0,
            }
            setSchedules([...schedules, newSchedule])
            console.log('Creating schedule:', newSchedule)
        }
        // Close drawer and reset editing state
        setDrawerOpen(false)
        setEditingSchedule(null)
    }

    const handleDuplicate = (row: Schedule) => {
        // Get current version and increment it
        const currentVersion = parseFloat(row.version || '1.00')
        const newVersion = (currentVersion + 1).toFixed(2)

        // Create duplicate with incremented version
        const duplicatedSchedule: Schedule = {
            ...row,
            id: String(schedules.length + 1),
            version: newVersion,
            name: `${row.name} (v${newVersion})`,
            status: 'Draft' as const,
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        }

        setSchedules([...schedules, duplicatedSchedule])
        console.log('Duplicated schedule:', duplicatedSchedule)
    }

    const handleDelete = (row: Schedule) => {
        // Confirm deletion
        if (window.confirm(`Are you sure you want to delete "${row.name}"? This action cannot be undone.`)) {
            // Remove the schedule from the list
            const updatedSchedules = schedules.filter(s => s.id !== row.id)
            setSchedules(updatedSchedules)

            // Also remove from selected rows if it was selected
            setSelectedRows(selectedRows.filter(r => r.id !== row.id))

            console.log('Deleted schedule:', row)
        }
    }

    const handleEdit = (row: Schedule) => {
        setEditingSchedule(row)
        setDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        setEditingSchedule(null)
    }

    const handleBulkUploadSave = (data: any[]) => {
        // Convert bulk upload data to Schedule format and add to schedules
        const newSchedules: Schedule[] = data.map((item, index) => {
            const id = String(schedules.length + index + 1)
            return {
                id,
                name: item.name || `Schedule ${id}`,
                product: item.product || 'Unknown',
                status: item.status || 'Draft',
                scheduleType: item.scheduleType || '',
                startDate: item.startDate || '',
                endDate: item.endDate || '',
                description: item.description || '',
                createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                rateTableCount: 0,
                methodologiesCount: 0,
            }
        })

        // Add new schedules to existing schedules
        // In a real app, you would make an API call here
        console.log('Adding schedules:', newSchedules)
        // For now, just close the drawer
        // You can update the schedules state if needed: setSchedules([...schedules, ...newSchedules])

        setBulkUploadOpen(false)

    }

    const handleBulkUploadCancel = () => {
        setBulkUploadOpen(false)
    }

    return (
        <>
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
                                        setDrawerOpen(true)
                                    },
                                },
                                {
                                    id: 'bulk',
                                    label: 'Bulk Upload',
                                    icon: Upload,
                                    onClick: () => {
                                        setBulkUploadOpen(true)
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                />
            </Layout>

            <AppDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                anchor="right"
                width={600}
                title={editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
                footer={
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleCloseDrawer}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                            onClick={() => {
                                formRef.current?.submitForm()
                            }}
                        >
                            {editingSchedule ? 'Update' : 'Save'}
                        </Button>
                    </Box>
                }
            >
                <ScheduleForm
                    ref={formRef}
                    onSave={handleSave}
                    onCancel={handleCloseDrawer}
                    initialValues={editingSchedule ? {
                        name: editingSchedule.name,
                        product: editingSchedule.product,
                        scheduleType: editingSchedule.scheduleType ? editingSchedule.scheduleType.trim() : '',
                        status: editingSchedule.status,
                        description: editingSchedule.description || '',
                        startDate: editingSchedule.startDate ? new Date(editingSchedule.startDate) : null,
                        endDate: editingSchedule.endDate ? new Date(editingSchedule.endDate) : null,
                        version: editingSchedule.version || '1.00',
                    } : undefined}
                />
            </AppDrawer>

            <AppDrawer
                open={bulkUploadOpen}
                onClose={handleBulkUploadCancel}
                anchor="right"
                width={900}
                title="Bulk Upload Schedules"
                footer={
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            onClick={handleBulkUploadCancel}
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => {
                                // Trigger upload from BulkUploadForm
                                const event = new CustomEvent('bulk-upload-trigger')
                                window.dispatchEvent(event)
                            }}
                            sx={{ textTransform: 'none' }}
                            disabled={bulkUploadButtonDisabled}
                        >
                            Upload
                        </Button>
                    </Box>
                }
            >
                <BulkUploadForm
                    onSave={handleBulkUploadSave}
                    onCancel={handleBulkUploadCancel}
                    onUploadButtonStateChange={setBulkUploadButtonDisabled}
                />
            </AppDrawer>
        </>
    )
}

export default Schedules
