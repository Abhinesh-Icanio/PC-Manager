import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import DataTable from './DataTable'

interface AppTableProps {
    filters?: React.ReactNode
    tableTitle?: string | React.ReactNode
    tableActions?: React.ReactNode
    columns: any[]
    rows: any[]
    selectable?: boolean
    selectedRows?: any[]
    onSelectAll?: (selected: boolean) => void
    onSelectRow?: (row: any, selected: boolean) => void
    onEdit?: (row: any) => void
    onDelete?: (row: any) => void
    onView?: (row: any) => void
    onRowClick?: (row: any) => void
}

const AppTable: React.FC<AppTableProps> = ({
    filters,
    tableTitle,
    tableActions,
    columns,
    rows,
    selectable = false,
    selectedRows = [],
    onSelectAll,
    onSelectRow,
    onEdit,
    onDelete,
    onView,
    onRowClick,
}) => {
    return (
        <>
            {/* Filters Section */}
            {filters && (
                <Card sx={{ mb: 3 }}>
                    <CardContent>{filters}</CardContent>
                </Card>
            )}

            {/* Table Section */}
            <Card>
                <CardContent>
                    {(tableTitle || tableActions) && (
                        <Box
                            sx={{
                                mb: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            {tableTitle && typeof tableTitle === 'string' ? (
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    {tableTitle}
                                </Typography>
                            ) : tableTitle}
                            {tableActions && <Box>{tableActions}</Box>}
                        </Box>
                    )}
                    <DataTable
                        columns={columns}
                        rows={rows}
                        selectable={selectable}
                        selectedRows={selectedRows}
                        onSelectAll={onSelectAll}
                        onSelectRow={onSelectRow}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onView={onView}
                        onRowClick={onRowClick}
                    />
                </CardContent>
            </Card>
        </>
    )
}

export default AppTable
