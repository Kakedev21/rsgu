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

    useEffect(() => {
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
                const response = await fetch('/api/bff/limit')
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
        fetchOrders()
        fetchLimits()
    }, [])

    useEffect(() => {
        if (orders) {
            // Group orders by date
            const groupedOrders = orders.reduce((acc: any, order) => {
                const date = new Date(order.createdAt!).toISOString().split('T')[0]
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
                textColor: '#000', // Blue text
                className: 'text-lg font-bold text-center flex flex-col items-center justify-center'
            }))

            setEvents(calendarEvents)
        }
    }, [orders])

    const handleUpdateLimits = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/bff/limit`, {
                method: 'PUT',
                body: JSON.stringify(limits)
            })
            if (response.ok) {
                // Handle success
                console.log('Limits updated successfully')
            }
        } finally {
            setLoading(false)
        }
    }

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