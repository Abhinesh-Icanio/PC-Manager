import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress } from '@mui/material'
import { Download, FileText } from 'lucide-react'
import AppDrawer from './AppDrawer'

export interface AppFileViewerProps {
  open: boolean
  onClose?: (value: boolean) => void
  objectUri?: string
  blob?: Blob
  fileName?: string
  fileType?: string
  title?: string
  maxWidth?: number | string
  fullWidth?: boolean
  loading?: boolean
}

const AppFileViewer: React.FC<AppFileViewerProps> = ({
  open,
  onClose,
  objectUri,
  blob,
  fileName = 'document',
  fileType,
  title,
  maxWidth = 800,
  fullWidth = true,
  loading: externalLoading = false,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
      }
      setError(null)
      return
    }

    if (blob) {
      const url = URL.createObjectURL(blob)
      setBlobUrl(url)
      setError(null)
    } else if (objectUri) {
      setBlobUrl(objectUri)
      setError(null)
    } else {
      setError('No file source provided. Please provide either objectUri or blob.')
      setBlobUrl(null)
    }

    return () => {
      if (blobUrl && blob) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [open, blob, objectUri])

  const handleDownload = () => {
    const url = blobUrl || objectUri
    if (!url) return

    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const dialogTitle = title || fileName || 'File Viewer'

  return (
    <AppDrawer
      open={open}
      onClose={() => onClose?.(false)}
      anchor="right"
      width={maxWidth}
      title={dialogTitle}
      footer={
        blobUrl || objectUri ? (
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            onClick={handleDownload}
            sx={{ textTransform: 'none' }}
          >
            Download
          </Button>
        ) : undefined
      }
    >
      {externalLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading file...
          </Typography>
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 2 }}>
          <FileText size={48} style={{ color: '#9ca3af' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Error loading file
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {error}
            </Typography>
          </Box>
        </Box>
      ) : blobUrl || objectUri ? (
        <Box sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2, boxShadow: 1 }}>
              <Typography variant="body2" color="text.secondary">
                File: {fileName}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Preview not available. Click download to view the file.
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : null}
    </AppDrawer>
  )
}

export default AppFileViewer
