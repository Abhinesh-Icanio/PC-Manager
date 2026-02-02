import React, { memo } from 'react'
import { TextField, Switch, FormControlLabel, RadioGroup, Radio, FormControl } from '@mui/material'
import AppSelect from './AppSelect'
import AppDatePicker from './AppDatePicker'

export interface FieldConfig {
    component: string
    label: string
    name: string
    placeholder?: string
    required?: boolean
    options?: { label: string; value: any }[]
    defaultValue?: any
    description?: string
    className?: string
    type?: string
    multiline?: boolean
    minRows?: number
    [key: string]: any
}

export interface DynamicAppComponentsProps {
    field: FieldConfig
    value: any
    onChange: (name: string, value: any) => void
    onBlur?: (name: string) => void
    error?: string
    touched?: boolean
    disabled?: boolean
    [key: string]: any
}

const DynamicAppComponents: React.FC<DynamicAppComponentsProps> = memo(
    ({
        field,
        value,
        onChange,
        onBlur,
        error,
        touched,
        disabled = false,
        ...rest
    }) => {
        const {
            component = 'input',
            name = '',
            label = '',
            placeholder,
            type = 'text',
            required = false,
            options = [],
            multiline = false,
            minRows = 1,
            labelParam = 'label',
            valueParam = 'value',
        } = field

        const handleChange = (e: any) => {
            let newValue
            if (component === 'switch' || component === 'checkbox') {
                newValue = e?.target ? e.target.checked : e
            } else {
                newValue = e?.target ? e.target.value : e
            }
            onChange(name, newValue)
        }

        const handleBlur = () => {
            onBlur?.(name)
        }

        let inputComponent = null

        switch (component) {
            case 'input':
                inputComponent = (
                    <TextField
                        id={name}
                        name={name}
                        type={type}
                        label={label}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!error && touched}
                        helperText={touched && error ? error : ''}
                        fullWidth
                        required={required}
                        disabled={disabled}
                        multiline={multiline}
                        minRows={minRows}
                        size="small"
                        {...rest}
                    />
                )
                break

            case 'dropDown':
            case 'select':
                inputComponent = (
                    <AppSelect
                        label={label}
                        options={options || []}
                        value={value || (field.multiple ? [] : '')}
                        onChange={(val) => onChange(name, val)}
                        placeholder={placeholder}
                        labelParam={labelParam}
                        valueParam={valueParam}
                        multiple={field.multiple || false}
                        disabled={disabled}
                        error={!!error && touched}
                        helperText={touched && error ? error : ''}
                        size="small"
                        fullWidth
                    />
                )
                break

            case 'switch':
                inputComponent = (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={Boolean(value)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={disabled}
                                color="primary"
                            />
                        }
                        label={label}
                        required={required}
                    />
                )
                break

            case 'radio':
                inputComponent = (
                    <FormControl component="fieldset">
                        <RadioGroup
                            name={name}
                            value={value || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            row={field.orientation === 'row'}
                        >
                            {(options.length ? options : [
                                { label: 'Yes', value: true },
                                { label: 'No', value: false },
                            ]).map((option: any, idx: number) => (
                                <FormControlLabel
                                    key={idx}
                                    value={String(option[valueParam] ?? option.value ?? option)}
                                    control={<Radio size="small" color="primary" />}
                                    label={option[labelParam] ?? option.label ?? option}
                                    disabled={disabled}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                )
                break

            case 'checkbox':
                inputComponent = (
                    <FormControlLabel
                        control={
                            <input
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={disabled}
                            />
                        }
                        label={label}
                        required={required}
                    />
                )
                break

            case 'datePicker':
            case 'date':
                inputComponent = (
                    <AppDatePicker
                        name={name}
                        id={name}
                        label={label}
                        value={value ? (value instanceof Date ? value : new Date(value)) : null}
                        onChange={(date) => onChange(name, date)}
                        onBlur={handleBlur}
                        error={!!error && touched}
                        helperText={touched && error ? error : ''}
                        required={required}
                        disabled={disabled}
                        placeholder={placeholder || 'DD/MM/YYYY'}
                        minDate={field.minDate ? (field.minDate instanceof Date ? field.minDate : new Date(field.minDate)) : undefined}
                        maxDate={field.maxDate ? (field.maxDate instanceof Date ? field.maxDate : new Date(field.maxDate)) : undefined}
                        fullWidth
                        size="small"
                        isYearOnly={field.isYearOnly || false}
                    />
                )
                break

            default:
                inputComponent = (
                    <TextField
                        id={name}
                        name={name}
                        type={type}
                        label={label}
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!error && touched}
                        helperText={touched && error ? error : ''}
                        fullWidth
                        required={required}
                        disabled={disabled}
                        size="small"
                        {...rest}
                    />
                )
        }

        return (
            <div className={field.className || ''}>
                {inputComponent}
            </div>
        )
    }
)

DynamicAppComponents.displayName = 'DynamicAppComponents'

export default DynamicAppComponents
