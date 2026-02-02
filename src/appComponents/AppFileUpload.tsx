import React, { useRef, useState } from 'react'
import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { Upload, Trash2, Eye } from 'lucide-react'
import { styled } from '@mui/material/styles'

const DropZone = styled(Box)(({ theme, error, dragActive }: any) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `2px dashed ${error ? theme.palette.error.main : dragActive ? theme.palette.primary.main : theme.palette.divider}`,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backgroundColor: dragActive 
    ? theme.palette.primary.main + '08' 
    : error 
      ? theme.palette.error.main + '08'
      : 'transparent',
  '&:hover': {
    borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}))

export interface AppFileUploadProps {
  name: string
  value?: File | null
  onChange: (name: string, file: File | null) => void
  onBlur?: (name: string, value: any) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
  showPreview?: boolean
  allowedFileTypes?: string[]
}

const AppFileUpload: React.FC<AppFileUploadProps> = ({
  name,
  value,
  onChange,
  onBlur,
  accept = '.xlsx,.xls,.csv',
  multiple = false,
  maxSize = 100, // 100MB default
  placeholder = 'Choose a file or drag it here',
  error,
  disabled = false,
  className = '',
  showPreview = false,
  allowedFileTypes = [],
}) => {
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsProcessing(true)
    const file = files[0]

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      onChange(name, null)
      setIsProcessing(false)
      alert(`Maximum file size is ${maxSize}MB`)
      return
    }

    // Validate file type if allowedFileTypes is specified
    if (allowedFileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!fileExtension || !allowedFileTypes.includes(fileExtension)) {
        onChange(name, null)
        setIsProcessing(false)
        alert(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`)
        return
      }
    }

    onChange(name, file)
    onBlur?.(name, file)
    setTimeout(() => setIsProcessing(false), 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files)
  }

  const handleRemoveFile = () => {
    onChange(name, null)
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileChange(e.dataTransfer.files)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xlsx':
      case 'xls':
        return '📊'
      case 'csv':
        return '📋'
      case 'pptx':
      case 'ppt':
        return '📋'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️'
      default:
        return '📎'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Box className={className} sx={{ width: '100%' }}>
      <DropZone
        error={!!error}
        dragActive={dragActive}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (!value && !isProcessing && !disabled) {
            fileRef.current?.click()
          }
        }}
        sx={{
          cursor: value || isProcessing || disabled ? 'default' : 'pointer',
        }}
      >
        <input
          ref={fileRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        {!value ? (
          <Box>
            <Upload size={48} style={{ margin: '0 auto', color: '#9ca3af' }} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {placeholder}
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, color: 'primary.main', fontWeight: 500 }}>
              Click to browse files
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
              Max size: {maxSize}MB
            </Typography>
            {allowedFileTypes.length > 0 && (
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.secondary' }}>
                Allowed: {allowedFileTypes.join(', ')}
              </Typography>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
              <Typography variant="h5" sx={{ flexShrink: 0 }}>
                {getFileIcon(value.name)}
              </Typography>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500, truncate: true }}>
                  {value.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatFileSize(value.size)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              {showPreview && (
                <Tooltip title="View file">
                  <IconButton size="small" onClick={() => {}}>
                    <Eye size={16} />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="Remove file">
                <IconButton size="small" onClick={handleRemoveFile} disabled={disabled}>
                  <Trash2 size={16} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}
      </DropZone>

      {error && (
        <Typography variant="caption" sx={{ mt: 1, color: 'error.main', display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default AppFileUpload
