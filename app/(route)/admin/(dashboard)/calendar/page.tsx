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
        const fetchData = async () => {
            setLoading(true)
            try {
                // Execute both fetches in parallel
                const [ordersPromise, limitsPromise] = await Promise.all([
                    orderHook.getCompletedOrders(),
                    fetch('/api/bff/limit').then(res => res.json())
                ]);

                // Set the orders
                setOrders(ordersPromise);

                // Set the limits
                if (limitsPromise[0]) {
                    setLimits({
                        product: limitsPromise[0].product || 0,
                        release: limitsPromise[0].release || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                method: 'PATCH', // Changed from PUT to PATCH since PUT is not allowed
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(limits)
            })
            if (response.ok) {
                // Handle success
                console.log('Limits updated successfully')
            } else {
                console.error('Failed to update limits:', response.status)
            }
        } catch (error) {
            console.error('Error updating limits:', error)
        } finally {
            setLoading(false)
        }
    }

    console.log("ASDAS", limits.release)

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