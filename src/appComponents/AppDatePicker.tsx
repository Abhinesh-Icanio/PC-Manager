import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export interface AppDatePickerProps {
    name?: string
    id?: string
    label?: string
    value: Date | null
    onChange: (date: Date | null) => void
    onBlur?: () => void
    error?: boolean
    helperText?: string
    required?: boolean
    disabled?: boolean
    placeholder?: string
    minDate?: Date
    maxDate?: Date
    fullWidth?: boolean
    size?: 'small' | 'medium'
    variant?: 'outlined' | 'filled' | 'standard'
    dataTestId?: string
    isYearOnly?: boolean
}

const AppDatePicker: React.FC<AppDatePickerProps> = ({
    name,
    id,
    label,
    value,
    onChange,
    onBlur,
    error = false,
    helperText,
    required = false,
    disabled = false,
    placeholder,
    minDate,
    maxDate,
    fullWidth = true,
    size = 'small',
    variant = 'outlined',
    dataTestId,
    isYearOnly = false,
}) => {
    const handleChange = (newValue: Date | null) => {
        onChange(newValue)
    }

    const handleAccept = () => {
        onBlur?.()
    }

    // Custom TextField component that handles label and placeholder properly
    const CustomTextField = React.forwardRef<HTMLDivElement, TextFieldProps>(
        (props, ref) => {
            const { InputLabelProps, InputProps, ...other } = props
            return (
                <TextField
                    {...other}
                    ref={ref}
                    variant={variant}
                    size={size}
                    fullWidth={fullWidth}
                    error={error}
                    helperText={helperText}
                    required={required}
                    disabled={disabled}
                    InputLabelProps={{
                        ...InputLabelProps,
                        shrink: value ? true : undefined, // Shrink label when value exists
                    }}
                    InputProps={{
                        ...InputProps,
                        placeholder: value ? undefined : placeholder, // Only show placeholder when no value
                    }}
                />
            )
        }
    )

    CustomTextField.displayName = 'CustomTextField'

    const picker = (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                enableAccessibleFieldDOMStructure={false}

                label={label}
                value={value}
                onChange={handleChange}
                onAccept={handleAccept}
                minDate={minDate}
                maxDate={maxDate}
                disabled={disabled}
                views={isYearOnly ? ['year'] : undefined}
                openTo={isYearOnly ? 'year' : undefined}
                format={isYearOnly ? 'yyyy' : 'dd/MM/yyyy'}
                slots={{
                    textField: CustomTextField as any,
                }}
                slotProps={{
                    textField: {
                        name,
                        id,
                        placeholder: placeholder || (isYearOnly ? 'YYYY' : 'DD/MM/YYYY'),
                    } as any,
                }}
            />
        </LocalizationProvider>
    )

    if (dataTestId) {
        return <div data-testid={dataTestId}>{picker}</div>
    }

    return picker
}

export default AppDatePicker
