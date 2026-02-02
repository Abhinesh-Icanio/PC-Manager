import React, { useRef, useState } from 'react'
import { LucideIcon } from 'lucide-react'
import { Menu, MenuItem as MuiMenuItem, MenuProps } from '@mui/material'

export interface MenuItem {
    id: string
    label: string
    icon: LucideIcon
    onClick: () => void
    disabled?: boolean
    className?: string
}

export interface AppMenuProps {
    trigger: React.ReactNode
    children?: React.ReactNode
    menuItems?: MenuItem[]
    anchorEl?: HTMLElement | null
    onClose?: () => void
    className?: string
    menuProps?: Partial<MenuProps>
    useInternalRef?: boolean
    disabled?: boolean
}

const AppMenu: React.FC<AppMenuProps> = ({
    trigger,
    children,
    menuItems = [],
    anchorEl: externalAnchorEl,
    onClose: externalOnClose,
    className = '',
    menuProps = {},
    useInternalRef = true,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const internalRef = useRef<HTMLDivElement>(null)

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen)
        }
    }

    const handleClose = () => {
        setIsOpen(false)
        if (externalOnClose) {
            externalOnClose()
        }
    }

    // Use internal ref if specified, otherwise use the provided anchorEl
    const menuAnchorEl = useInternalRef ? internalRef.current : externalAnchorEl

    return (
        <div className={className} style={{ position: 'relative' }}>
            <div
                ref={useInternalRef ? internalRef : undefined}
                onClick={handleToggle}
                style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            >
                {trigger}
            </div>

            <Menu
                anchorEl={menuAnchorEl}
                open={isOpen}
                onClose={handleClose}
                sx={{
                    mt: 1,
                    '& .MuiPaper-root': {
                        minWidth: 230,
                        borderRadius: 2,
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #e5e7eb',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        overflow: 'hidden',
                    },
                    '& .MuiMenu-list': {
                        padding: '4px 0',
                    },
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                {...menuProps}
            >
                {/* Render custom children if provided */}
                {children}

                {/* Render menu items from array if provided */}
                {menuItems.map((item) => (
                    <MuiMenuItem
                        key={item.id}
                        onClick={() => {
                            if (!item.disabled && !disabled) {
                                item.onClick()
                                handleClose()
                            }
                        }}
                        disabled={item.disabled || disabled}
                        className={item.className}
                        sx={{
                            py: 1.5,
                            px: 2,
                            mx: 1,
                            my: 0.5,
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: item.disabled ? '#9ca3af' : '#1e293b',
                            '&:hover': {
                                backgroundColor: item.disabled ? 'transparent' : '#f3f4f6',
                                transform: item.disabled ? 'none' : 'translateX(2px)',
                                transition: 'all 0.2s ease-in-out',
                            },
                            '&:active': {
                                backgroundColor: '#e5e7eb',
                                transform: 'scale(0.98)',
                            },
                            '&.Mui-disabled': {
                                opacity: 0.6,
                                cursor: 'not-allowed',
                            },
                        }}
                    >
                        <item.icon
                            size={16}
                            style={{
                                color: item.disabled ? '#9ca3af' : '#2563eb',
                                flexShrink: 0,
                                marginRight: 12,
                            }}
                        />
                        <span style={{ flex: 1 }}>{item.label}</span>
                    </MuiMenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default AppMenu
