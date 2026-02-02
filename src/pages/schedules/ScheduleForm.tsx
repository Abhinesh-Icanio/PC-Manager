import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import DynamicAppComponents, { FieldConfig } from '../../appComponents/DynamicAppComponents'
import { scheduleFormFields } from './constants'

interface ScheduleFormProps {
    onSave: (values: any) => void
    onCancel?: () => void
    initialValues?: any
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ onSave, initialValues }) => {
    // Create validation schema from fields using Yup
    const validationSchema = Yup.object().shape(
        scheduleFormFields.reduce((acc, field) => {
            if (field.required) {
                let schema: any

                if (field.component === 'datePicker' || field.component === 'date' || field.type === 'date') {
                    schema = Yup.date()
                        .required(`${field.label} is required`)
                        .nullable()
                        .typeError(`${field.label} must be a valid date`)
                } else if (field.type === 'number') {
                    schema = Yup.number()
                        .required(`${field.label} is required`)
                        .typeError(`${field.label} must be a number`)
                } else {
                    schema = Yup.string()
                        .required(`${field.label} is required`)
                        .trim()
                }

                acc[field.name] = schema
            } else {
                // Optional fields still need type validation
                if (field.component === 'datePicker' || field.component === 'date' || field.type === 'date') {
                    acc[field.name] = Yup.date()
                        .nullable()
                        .typeError(`${field.label} must be a valid date`)
                } else if (field.type === 'number') {
                    acc[field.name] = Yup.number()
                        .nullable()
                        .typeError(`${field.label} must be a number`)
                }
            }
            return acc
        }, {} as Record<string, any>)
    )

    const defaultValues = scheduleFormFields.reduce((acc, field) => {
        if (field.component === 'datePicker' || field.component === 'date') {
            acc[field.name] = field.defaultValue || null
        } else {
            acc[field.name] = field.defaultValue || (field.component === 'select' ? '' : '')
        }
        return acc
    }, {} as Record<string, any>)

    // Convert date strings to Date objects for datePicker fields
    const processedInitialValues = initialValues ? { ...initialValues } : {}
    scheduleFormFields.forEach((field) => {
        if ((field.component === 'datePicker' || field.component === 'date') && processedInitialValues[field.name]) {
            const dateValue = processedInitialValues[field.name]
            if (typeof dateValue === 'string') {
                processedInitialValues[field.name] = new Date(dateValue)
            }
        }
    })

    const formValues = { ...defaultValues, ...processedInitialValues }

    const formik = useFormik({
        initialValues: formValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            onSave(values)
        },
    })

    // Handle form submission from external button
    useEffect(() => {
        const formId = initialValues ? 'edit-row-form' : 'schedule-form'
        const form = document.getElementById(formId) as HTMLFormElement
        if (form) {
            const handleSubmit = (e: Event) => {
                e.preventDefault()
                formik.handleSubmit()
            }
            form.addEventListener('submit', handleSubmit)
            return () => {
                form.removeEventListener('submit', handleSubmit)
            }
        }
    }, [formik, initialValues])

    const formId = initialValues ? 'edit-row-form' : 'schedule-form'

    return (
        <form id={formId} onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {scheduleFormFields.map((field: FieldConfig) => (
                    <DynamicAppComponents
                        key={field.name}
                        field={field}
                        value={formik.values[field.name]}
                        onChange={(name, value) => {
                            formik.setFieldValue(name, value)
                        }}
                        onBlur={(name) => {
                            formik.setFieldTouched(name, true)
                        }}
                        error={formik.errors[field.name] as string}
                        touched={!!formik.touched[field.name]}
                    />
                ))}
            </Box>
        </form>
    )
}

export default ScheduleForm
