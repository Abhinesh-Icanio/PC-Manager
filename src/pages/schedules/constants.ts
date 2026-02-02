import { FieldConfig } from '../../appComponents/DynamicAppComponents'

export const scheduleFormFields: FieldConfig[] = [
    {
        component: 'input',
        name: 'name',
        label: 'Schedule Name',
        placeholder: 'Enter schedule name',
        required: true,
        type: 'text',

    },
    {
        component: 'select',
        name: 'product',
        label: 'Product',
        placeholder: 'Select product',
        required: true,
        options: [
            { label: 'Product Alpha', value: 'Product Alpha' },
            { label: 'Product Beta', value: 'Product Beta' },
            { label: 'Product Gamma', value: 'Product Gamma' },
            { label: 'Product Delta', value: 'Product Delta' },
            { label: 'Product Epsilon', value: 'Product Epsilon' },
        ],

    },
    {
        component: 'select',
        name: 'scheduleType',
        label: 'Schedule Type',
        placeholder: 'Select schedule type',
        required: true,
        options: [
            { label: 'PCE', value: 'PCE' },
            { label: 'Vested', value: 'Vested' },
        ],
    },
    {
        component: 'select',
        name: 'status',
        label: 'Status',
        placeholder: 'Select status',
        required: true,
        options: [
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
            { label: 'Draft', value: 'Draft' },
        ],
        defaultValue: 'Active'
    },
    {
        component: 'input',
        name: 'description',
        label: 'Description',
        placeholder: 'Enter description',
        required: false,
        type: 'text',
        multiline: true,
        minRows: 3,
    },
    {
        component: 'datePicker',
        name: 'startDate',
        label: 'Start Date',
        placeholder: 'DD/MM/YYYY',
        required: true,
    },
    {
        component: 'datePicker',
        name: 'endDate',
        label: 'End Date',
        placeholder: 'DD/MM/YYYY',
        required: false,
    },
]
