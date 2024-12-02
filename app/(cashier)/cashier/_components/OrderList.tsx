import React, { useEffect, useState } from 'react'
import useOrder from '@/hooks/useOrder'
import { Button } from '@/components/ui/button'
import { OrderProps } from '@/types/Order'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Slip from './Slip'
import TotalPayment from './TotalPayment'
import PaymentCTA from './PaymentCTA'

const OrderList = () => {
  const orderHook = useOrder({ init: false })
  const [orders, setOrders] = useState<OrderProps[]>([])
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const getOrders = async () => {
      const pendingOrders = await orderHook.getPendingOrders()
      setOrders(pendingOrders || []) // Ensure orders is an array even if null/undefined
    }
    getOrders()
  }, [])

  const handleOrderClick = async (orderId: string) => {
    await orderHook.orderDetail(orderId)
    setSelectedOrder(orderId)
    setOpen(true)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Orders</h2>
      <div className="grid grid-cols-3 gap-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Button
              key={order._id}
              variant="outline"
              className="p-4 text-left h-auto"
              onClick={() => handleOrderClick(order._id as string)}
            >
              <div>
                <div className="font-bold">Order #{order._id?.slice(-6) || ""}</div>
                <div>Total: {order.totalAmount || 0}</div>
              </div>
            </Button>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No pending orders found
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {orderHook.order && orderHook.order.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-5">
                  <Slip orderData={orderHook.order as any} />
                </div>
                <div className="space-y-5">
                  <TotalPayment
                    total={orderHook.order[0]?.totalAmount || ""}
                    status={orderHook.order[0]?.status as string}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <PaymentCTA
                  orderNo={orderHook.order[0]?._id as string}
                  status={orderHook.order[0]?.status as string}
                  orderHook={orderHook}
                />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              No order details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderList