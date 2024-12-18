import React from 'react';

interface SlipProps {
  orderData: Array<{
    _id: string;
    createdAt: string;
    userId: string;
    user?: {
      name: string;
      email: string;
      contactNumber?: number
    };
    products: Array<{
      _id: string;
      name: string;
      price: number;
      quantity?: number;
    }>;
    productAndQty?: Array<{
      productId: string;
      quantity: number;
      price: number;
      size: number | null;
    }>;
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

  console.log("0", orderData)

  // Combine all products from all orders into a single array
  const allProducts = orderData.reduce((acc, order) => {
    const products = Array.isArray(order.products) ? order.products : [order.products];

    // Map through products and add quantities from productAndQty
    const productsWithQty = products.map(product => {
      const qtyInfo = order.productAndQty?.find(pq => pq.productId === product._id);
      return {
        ...product,
        quantity: qtyInfo?.quantity || product.quantity || 1,
        price: qtyInfo?.price || product.price,
        size: qtyInfo?.size
      };
    });

    return [...acc, ...productsWithQty];
  }, [] as Array<{
    _id: string;
    name: string;
    price: number;
    quantity?: number;
    size?: number | null;
  }>);

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

  console.log("AA", allProducts)

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
          <div className="border-b border pb-2 mb-2">
            <p>NAME OF CUSTOMER: {order.user?.name || 'N/A'}</p>
          </div>
          <div className="border-b border pb-2 mb-2">
            <p>CONTACT NUMBER: {order.user?.contactNumber}</p>
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
            <th className="border p-2">SIZE</th>
            <th className="border p-2">QTY</th>
            <th className="border p-2">UNIT PRICE</th>
            <th className="border p-2">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <tr key={product._id}>
                <td className="border p-2">{product.name || 'N/A'}</td>
                <td className="border p-2">{product.size || 'N/A'}</td>
                <td className="border p-2">{product.quantity || 0}</td>
                <td className="border p-2">₱{product.price?.toFixed(2) || '0.00'}</td>
                <td className="border p-2">₱{((product.quantity || 0) * (product.price || 0)).toFixed(2)}</td>
              </tr>
            ))
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