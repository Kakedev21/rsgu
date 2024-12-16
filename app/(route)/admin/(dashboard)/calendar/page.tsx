'use client'
import React, { useEffect, useState } from 'react'
import useOrder from '@/hooks/useOrder'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { OrderProps } from '@/types/Order'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import LoadingOverlay from 'react-loading-overlay-ts'

const Page = () => {
    const orderHook = useOrder({ init: false })
    const [orders, setOrders] = useState<OrderProps[]>([])
    const [events, setEvents] = useState<any[]>([])
    const [limits, setLimits] = useState({
        product: 0,
        release: 0
    })
    const [loading, setLoading] = useState(false)

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const completedOrders = await orderHook.getCompletedOrders()
            setOrders(completedOrders)
        } finally {
            setLoading(false)
        }
    }

    const fetchLimits = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/bff/limit', {
                cache: 'no-store' // Disable caching
            })
            const data = await response.json()
            if (data[0]) {
                setLimits({
                    product: data[0].product || 0,
                    release: data[0].release || 0
                })
            }
        } finally {
            setLoading(false)
        }
    }



    const handleUpdateLimits = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/bff/limit`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(limits),
                cache: 'no-store' // Disable caching
            })
            if (response.ok) {
                // Handle success
                console.log('Limits updated successfully')
                // Refresh data after update
                fetchOrders()
                fetchLimits()
            } else {
                console.error('Failed to update limits:', response.status)
            }
        } catch (error) {
            console.error('Error updating limits:', error)
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchOrders()
        fetchLimits()
    }, [])

    // Set up polling for updates every 30 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchOrders()
            fetchLimits()
        }, 30000) // 30 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        if (orders) {
            // Group orders by date (using local timezone)
            const groupedOrders = orders.reduce((acc: any, order) => {
                // Convert to local timezone date string
                const date = new Date(order.createdAt!).toLocaleDateString('en-CA') // YYYY-MM-DD format
                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(order)
                return acc
            }, {})

            // Create events array for calendar
            const calendarEvents = Object.entries(groupedOrders).map(([date, dateOrders]: [string, any]) => ({
                title: `Released:\n${dateOrders.length}`,
                date,
                display: 'auto',
                textColor: '#000',
                className: 'text-lg font-bold text-center flex flex-col items-center justify-center'
            }))

            setEvents(calendarEvents)
        }
    }, [orders])

    return (
        <LoadingOverlay active={loading} spinner>
            <div className="h-screen p-4">
                <div className="mb-4 flex gap-4 items-center">
                    <div className="flex flex-col gap-2">
                        <label>Release Limit</label>
                        <Input
                            type="number"
                            value={limits.release}
                            onChange={(e) => setLimits(prev => ({ ...prev, release: parseInt(e.target.value) }))}
                        />
                    </div>
                    <Button onClick={handleUpdateLimits} className="mt-6">
                        Update Limits
                    </Button>
                </div>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="100%"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth'
                    }}
                />
            </div>
        </LoadingOverlay>
    )
}

export default Page