import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import DynamicAppComponents, { FieldConfig } from '../../appComponents/DynamicAppComponents'
import { rateTableFormFields } from './constants'

interface RateTableFormProps {
  onSave: (values: any) => void
  onCancel?: () => void
  initialValues?: any
}

const RateTableForm: React.FC<RateTableFormProps> = ({ onSave, initialValues }) => {
  // Create validation schema from fields using Yup
  const validationSchema = Yup.object().shape(
    rateTableFormFields.reduce((acc, field) => {
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
            .min(3, `${field.label} must be at least 3 characters`)
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
  ).test('endDateAfterStartDate', 'End Date must be after Start Date', function (values) {
    const { startDate, endDate } = values
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      return end >= start
    }
    return true
  })

  const defaultValues = rateTableFormFields.reduce((acc, field) => {
    if (field.component === 'datePicker' || field.component === 'date') {
      acc[field.name] = field.defaultValue || null
    } else {
      acc[field.name] = field.defaultValue || (field.component === 'select' ? '' : '')
    }
    return acc
  }, {} as Record<string, any>)

  // Convert date strings to Date objects for datePicker fields
  const processedInitialValues = initialValues ? { ...initialValues } : {}
  rateTableFormFields.forEach((field) => {
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
    const formId = 'rate-table-form'
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
  }, [formik])

  return (
    <form id="rate-table-form" onSubmit={formik.handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {rateTableFormFields.map((field: FieldConfig) => (
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

export default RateTableForm
