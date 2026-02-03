import { FieldConfig } from '../../appComponents/DynamicAppComponents'

// Schedule options - these would typically come from an API or context
// For now, using the same schedule list from schedules page
export const scheduleOptions = [
  { label: 'Q4 2024 Project Alpha Launch', value: 'Q4 2024 Project Alpha Launch' },
  { label: 'Annual Financial Audit Prep', value: 'Annual Financial Audit Prep' },
  { label: 'New User Onboarding Flow', value: 'New User Onboarding Flow' },
  { label: 'Infrastructure Upgrade Phase 2', value: 'Infrastructure Upgrade Phase 2' },
  { label: 'HR Policy Review Cycle', value: 'HR Policy Review Cycle' },
  { label: 'Marketing Campaign Q1', value: 'Marketing Campaign Q1' },
  { label: 'Security Audit Schedule', value: 'Security Audit Schedule' },
  { label: 'System Maintenance Window', value: 'System Maintenance Window' },
  { label: 'Data Migration Plan', value: 'Data Migration Plan' },
  { label: 'Customer Portal Update', value: 'Customer Portal Update' },
]

export const rateTableFormFields: FieldConfig[] = [
  {
    component: 'input',
    name: 'name',
    label: 'Name',
    placeholder: 'Enter rate table name',
    required: true,
    type: 'text',
  },
  {
    component: 'select',
    name: 'schedule',
    label: 'Schedule',
    placeholder: 'Select schedule',
    required: true,
    options: scheduleOptions,
  },
  {
    component: 'input',
    name: 'comment',
    label: 'Comment',
    placeholder: 'Enter comment',
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
