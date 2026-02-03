import { useEffect, useImperativeHandle, forwardRef, useMemo } from 'react'
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

export interface ScheduleFormRef {
    submitForm: () => void
}

const ScheduleForm = forwardRef<ScheduleFormRef, ScheduleFormProps>(({ onSave, initialValues }, ref) => {
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

    const defaultValues = useMemo(() => {
        return scheduleFormFields.reduce((acc, field) => {
            if (field.component === 'datePicker' || field.component === 'date') {
                acc[field.name] = field.defaultValue || null
            } else {
                acc[field.name] = field.defaultValue || (field.component === 'select' ? '' : '')
            }
            return acc
        }, {} as Record<string, any>)
    }, [])

    // Convert date strings to Date objects for datePicker fields and trim string values
    const formValues = useMemo(() => {
        const processedInitialValues = initialValues ? { ...initialValues } : {}
        scheduleFormFields.forEach((field) => {
            if ((field.component === 'datePicker' || field.component === 'date') && processedInitialValues[field.name]) {
                const dateValue = processedInitialValues[field.name]
                if (typeof dateValue === 'string') {
                    processedInitialValues[field.name] = new Date(dateValue)
                }
            } else if ((field.component === 'select' || field.component === 'dropDown') && processedInitialValues[field.name]) {
                // Trim select values to ensure proper matching with options
                const selectValue = processedInitialValues[field.name]
                if (typeof selectValue === 'string') {
                    processedInitialValues[field.name] = selectValue.trim()
                }
            }
        })
        return { ...defaultValues, ...processedInitialValues }
    }, [initialValues, defaultValues])

    const formik = useFormik({
        initialValues: formValues,
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            onSave(values)
        },
    })

    // Expose submit function to parent component
    useImperativeHandle(ref, () => ({
        submitForm: () => {
            formik.handleSubmit()
        },
    }))

    // Handle form submission from external button
    useEffect(() => {
        const form = document.getElementById('schedule-form') as HTMLFormElement
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
    }, [formik])

    const formId = 'schedule-form'

    return (
        <form id={formId} onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {scheduleFormFields
                    .filter((field: FieldConfig) => field.className !== 'hidden') // Hide version field
                    .map((field: FieldConfig) => (
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
})

ScheduleForm.displayName = 'ScheduleForm'

export default ScheduleForm
