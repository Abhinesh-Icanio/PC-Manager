import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import Popper from '@mui/material/Popper'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { Plus } from 'lucide-react'
import React, { useMemo, useState } from 'react'

interface OptionType {
  [key: string]: any
}

interface AppSelectProps
  extends Omit<
    AutocompleteProps<any, any, any, any>,
    'options' | 'value' | 'onChange' | 'renderInput'
  > {
  options: OptionType[]
  value: any
  onChange: (value: any) => void
  onBlur?: () => void
  placeholder?: string
  labelParam?: string
  valueParam?: string
  label?: string
  multiple?: boolean
  freeSolo?: boolean
  className?: string
  disabled?: boolean
  limitTags?: number
  allOptionLabel?: string
  getOptionDisabled?: (option: any) => boolean
  loading?: boolean
  helperText?: string
  error?: boolean
  fullWidth?: boolean
  others?: boolean
  othersLabel?: string
  onOptionAdd?: (newOption: OptionType) => void
}

const StyledPopper = styled(Popper)(({ theme }) => ({
  '& .MuiAutocomplete-listbox': {
    padding: 3,
  },
  borderRadius: '8px !important',
  border: 'none !important',
  '& .MuiAutocomplete-option': {
    margin: 2,
    '&[aria-selected="true"],&:hover': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: '#fff',
      '& .MuiChip-label': {
        padding: '0.5rem 1rem',
      },
    },
    '&[data-others="true"]': {
      backgroundColor: '#f3f4f6',
      border: '1px dashed #d1d5db',
      borderRadius: '6px',
      '&:hover': {
        backgroundColor: '#e5e7eb',
        borderColor: '#9ca3af',
      },
    },
  },
  '& .MuiAutocomplete-noOptions': {
    color: theme.palette.primary.main,
    fontWeight: 500,
    padding: '12px 16px',
    fontSize: '0.9rem',
  },
}))

const AppSelect: React.FC<AppSelectProps> = ({
  options = [],
  value,
  onChange,
  onBlur,
  placeholder = 'Select...',
  labelParam = 'label',
  valueParam = 'value',
  label,
  multiple = false,
  freeSolo = false,
  className,
  disabled = false,
  limitTags = 3,
  allOptionLabel,
  getOptionDisabled = (option: any) => option?.disabled,
  loading = false,
  helperText,
  error,
  disableClearable = true,
  fullWidth = true,
  others = false,
  othersLabel = 'Add manually',
  onOptionAdd,
  size = 'small',
  ...rest
}) => {
  const [newOptions, setNewOptions] = useState<OptionType[]>([])

  const safeOptions = Array.isArray(options) ? options : []
  const allOptions = [...safeOptions, ...newOptions]

  const updatedOptions = useMemo(
    () =>
      allOptionLabel
        ? [{ [labelParam]: allOptionLabel, [valueParam]: 'All' }, ...allOptions]
        : allOptions,
    [allOptions, allOptionLabel, labelParam, valueParam]
  )

  const getValueFromOption = (opt: any) => {
    if (typeof opt === 'string') return opt
    return opt?.[valueParam]
  }

  const optionsKey = useMemo(
    () => updatedOptions?.map(opt => getValueFromOption(opt)).join(','),
    [updatedOptions]
  )

  const filterOptions = (options: any[], { inputValue }: any) => {
    if (!Array.isArray(options)) {
      return []
    }

    const filtered = options
      .filter(option => {
        const label = typeof option === 'string' ? option : option[labelParam]
        return label?.toLowerCase().includes(inputValue.toLowerCase())
      })
      .sort((a: any, b: any) => {
        const labelA = typeof a === 'string' ? a : a?.[labelParam] || ''
        const labelB = typeof b === 'string' ? b : b?.[labelParam] || ''
        return labelA.localeCompare(labelB)
      })

    // Add others option if no results found and others is enabled
    if (others && inputValue && filtered.length === 0) {
      return [
        {
          [labelParam]: inputValue,
          [valueParam]: inputValue,
          isOthers: true,
        },
      ]
    }

    return filtered
  }

  const getOptionFromValue = (val: any) => {
    if (val == null || updatedOptions?.length === 0) return multiple ? [] : null
    if (multiple && Array.isArray(val)) {
      return val
        .map((v: any) => {
          const foundOption = updatedOptions.find(opt => getValueFromOption(opt) == v)
          if (foundOption) return foundOption
          return others || freeSolo ? v : null
        })
        .filter(Boolean)
    }
    const foundOption = updatedOptions.find(opt => getValueFromOption(opt) == val)
    if (foundOption) return foundOption
    return others || freeSolo ? val : null
  }

  return (
    <Autocomplete
      {...rest}
      key={optionsKey}
      fullWidth={fullWidth}
      limitTags={limitTags}
      size={size}
      multiple={multiple}
      freeSolo={freeSolo}
      disableClearable={disableClearable}
      options={updatedOptions || []}
      value={getOptionFromValue(value)}
      getOptionDisabled={getOptionDisabled}
      filterSelectedOptions={multiple}
      filterOptions={filterOptions}
      onChange={(e, newValue: any) => {
        // If it's an "others" option, add it to the options array
        if (newValue && newValue.isOthers) {
          const newOption = {
            [labelParam]: newValue[labelParam],
            [valueParam]: newValue[valueParam],
          }
          setNewOptions(prev => [...prev, newOption])
          onOptionAdd?.(newOption)
          const actualValue = newValue[valueParam]
          onChange?.(actualValue)
          return
        }

        if (multiple) {
          onChange?.((newValue as any[]).map(getValueFromOption))
        } else {
          onChange?.(getValueFromOption(newValue))
        }
      }}
      onBlur={onBlur}
      getOptionLabel={(option: any) =>
        typeof option === 'string' ? option : option[labelParam] || ''
      }
      isOptionEqualToValue={(option: any, val: any) =>
        getValueFromOption(option) == getValueFromOption(val)
      }
      renderInput={params => (
        <TextField
          error={!!error}
          helperText={helperText}
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          className={className}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={15} color="primary" />
              </InputAdornment>
            ) : (
              params.InputProps.endAdornment
            ),
          }}
        />
      )}
      renderOption={(props, option: any) => {
        const optionValue = getValueFromOption(option)
        const optionLabel = typeof option === 'string' ? option : option[labelParam] || ''
        const uniqueKey =
          typeof option === 'string'
            ? option
            : optionValue
              ? String(optionValue)
              : optionLabel
                ? `${optionLabel}-${JSON.stringify(option)}`
                : JSON.stringify(option)

        const { key, ...restProps } = props

        return (
          <li
            key={uniqueKey}
            id={optionValue ? `${optionValue}-option` : undefined}
            {...restProps}
            data-others={option.isOthers ? 'true' : undefined}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            {option.isOthers && <Plus size={16} />}
            {option.isOthers
              ? `${othersLabel} : ${option[labelParam]}`
              : typeof option === 'string'
                ? option
                : option[labelParam]}
          </li>
        )
      }}
      {...(multiple && {
        renderTags: (tagValue: any[], getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              size="small"
              color="primary"
              label={typeof option === 'string' ? option : option[labelParam]}
              {...getTagProps({ index })}
              sx={{ borderRadius: '2rem' }}
            />
          )),
      })}
      PopperComponent={StyledPopper as any}
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ],
        },
      }}
      disabled={disabled || loading}
    />
  )
}

export default AppSelect
