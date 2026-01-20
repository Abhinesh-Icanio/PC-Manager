import { Box, Typography, Card, CardContent, Button } from '@mui/material'
import { Check, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Schedule {
  name: string
  id: string
  node: string
  status: string
  progress: number
  statusColor: string
  dotColor: string
  buttonLabel: string
  buttonColor: string
}

const ActiveManagementSchedules = () => {
  const navigate = useNavigate()
  
  const schedules: Schedule[] = [
    {
      name: 'Nubuck Hiking Sandals Line',
      id: '#56784',
      node: 'HK-42',
      status: 'EFFICIENCY',
      progress: 87.5,
      statusColor: 'text-green-600',
      dotColor: '#10b981',
      buttonLabel: 'LIVE',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Heavy Duty Winter Jackets',
      id: '#94856',
      node: 'US-E1',
      status: 'CALCULATION',
      progress: 42,
      statusColor: 'text-blue-600',
      dotColor: '#a855f7',
      buttonLabel: 'PROCESSING',
      buttonColor: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Classic Loafers Walden',
      id: '#22341',
      node: 'Awaiting Input',
      status: 'REVIEW REQUIREMENT',
      progress: 0,
      statusColor: 'text-gray-600',
      dotColor: '#9ca3af',
      buttonLabel: 'DRAFT',
      buttonColor: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      name: 'Trek Backpack Series',
      id: '#11094',
      node: 'EU-W2',
      status: 'EFFICIENCY',
      progress: 92,
      statusColor: 'text-green-600',
      dotColor: '#10b981',
      buttonLabel: 'LIVE',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    }
  ]


  const renderProgressSteps = (progress: number) => {
    const totalSteps = 5
    // Calculate completed steps based on progress percentage
    const completedSteps = Math.floor((progress / 100) * totalSteps)
    // Check if there's a current step (not completed, not zero)
    const hasCurrentStep = progress > 0 && progress < 100 && (completedSteps < totalSteps)
    const currentStepIndex = hasCurrentStep ? completedSteps : -1
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isCompleted = index < completedSteps
          const isCurrent = index === currentStepIndex
          
          return (
            <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              {isCompleted ? (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Check size={12} color="#ffffff" />
                </Box>
              ) : isCurrent ? (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: '#2563eb',
                    border: '2px solid',
                    borderColor: '#dbeafe',
                    flexShrink: 0,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: '#e2e8f0',
                    bgcolor: '#ffffff',
                    flexShrink: 0,
                  }}
                />
              )}
              {index < totalSteps - 1 && (
                <Box
                  sx={{
                    width: 24,
                    height: 2,
                    bgcolor: index < completedSteps ? '#2563eb' : '#e2e8f0',
                    ml: 0.5,
                  }}
                />
              )}
            </Box>
          )
        })}
      </Box>
    )
  }

  return (
    <Card sx={{ mb: 3, borderRadius: 2.5, border: '1px solid', borderColor: '#e2e8f0' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5, fontSize: '1.125rem' }}>
              Recent Schedules
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
              Latest activities regarding schedules
            </Typography>
          </Box>
          <Button
            variant="outlined"
            endIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/schedules')}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              borderColor: '#2563eb',
              color: '#2563eb',
              '&:hover': {
                borderColor: '#1d4ed8',
                bgcolor: 'rgba(37, 99, 235, 0.05)',
              },
            }}
          >
            See More
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {schedules.map((schedule, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 2,
                borderBottom: index < schedules.length - 1 ? '1px solid' : 'none',
                borderColor: '#e2e8f0',
                transition: 'all 0.15s',
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: schedule.dotColor,
                  }}
                />
              </Box>
              
              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.25, fontSize: '0.9375rem' }}>
                  {schedule.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                  {schedule.node}
                </Typography>
              </Box>
              
              {/* Progress Steps on Right */}
              <Box sx={{ flexShrink: 0 }}>
                {renderProgressSteps(schedule.progress)}
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ActiveManagementSchedules
