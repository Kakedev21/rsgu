import React from 'react';

interface SlipProps {
  orderData: Array<{
    _id: string;
    createdAt: string;
    userId: string;
    user?: {
      name: string;
      email: string;
    };
    products: any
    totalAmount: number;
  }>;
}

const Slip: React.FC<SlipProps> = ({ orderData }) => {

  console.log('0', orderData)

  if (!orderData || orderData.length === 0) {
    return (
      <div className="border p-4">
        <p>No order data available</p>
      </div>
    );
  }

  // Get first order since it's an array
  const order = orderData[0];

  console.log(';0', order.products)

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Safely get the order ID suffix
  const getOrderIdSuffix = (id: string) => {
    try {
      return id.slice(-6);
    } catch (error) {
      return 'XXXXXX';
    }
  };

  return (
    <div className="border p-4">
      <div className="border p-2 mb-4">
        <div className="w-full">
          <div className="flex justify-between border-b border pb-2 mb-2">
            <p>UNIFORM ORDER SLIP NO.: <span className="font-bold">
              RGO2024-{getOrderIdSuffix(order._id)}
            </span></p>
            <p>DATE: {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex justify-between border-b border pb-2 mb-2">
            <p>SR CODE: {order.userId || 'N/A'}</p>
            <p>OFFICIAL RECEIPT NO.: N/A</p>
          </div>
          <div className="border-b border pb-2 mb-2">
            <p>NAME OF CUSTOMER: {order.user?.name || 'N/A'}</p>
          </div>
          <div className="border-b border pb-2 mb-2">
            <p>CONTACT NUMBER: N/A</p>
          </div>
          <div className="border-b border pb-2 mb-2">
            <p>EMAIL: {order.user?.email || 'N/A'}</p>
          </div>
        </div>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">PRODUCT NAME</th>
            <th className="border p-2">QTY</th>
            <th className="border p-2">UNIT PRICE</th>
            <th className="border p-2">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {order?.products ? (
            <tr>
              <td className="border p-2">{order.products.name || 'N/A'}</td>
              <td className="border p-2">{order.products.quantity || 1}</td>
              <td className="border p-2">₱{order.products.price.toFixed(2)}</td>
              <td className="border p-2">₱{((order.products.price || 0) * (order.products.quantity || 1)).toFixed(2)}</td>
            </tr>
          ) : (
            <tr>
              <td className="border p-2" colSpan={5}>No items available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end mt-4">
        <p className="font-bold">TOTAL AMOUNT: ₱{order.totalAmount?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

export default Slip;