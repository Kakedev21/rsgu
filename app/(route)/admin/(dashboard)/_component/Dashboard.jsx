"use client"


import OrdersCard from "./OrdersCard";
import OrdersCount from "./OrdersCount";

import OrdersChart from "./OrdersChart";
import moment from "moment";
import ProductsChart from "./ProductsChart";
const Dashboard = () => {
    
    
    return (
        <div className="w-full space-y-5">
          <div className="w-full space-y-3">
            <p className="font-semibold">Orders</p>
            <div className="w-full flex gap-5"> 
              <div className="w-full">
                <OrdersCard
                  title="Pending"
                  description="Total Count of Pending Orders"
                  content={
                    <div>
                      
                      <OrdersCount status="Pending"/>
                    </div>

                  }
                />
              </div>
              <div className="w-full">
                <OrdersCard
                  title="Paid"
                  description="Total Count of Paid Orders"
                  content={
                    <div>
                      <OrdersCount status="Paid" className="text-blue-500 font-semibold"/>
                    </div>

                  }
                />
              </div>
              <div className="w-full">
                <OrdersCard
                  title="Completed"
                  description="Total Count of Completed Orders"
                  content={
                    <div>
                      
                      <OrdersCount status="Completed" className="text-green-500 font-semibold"/>
                    </div>

                  }
                />
              </div>
            </div>
            
          </div>
          <div className="flex w-full gap-5 my-5">
            <div className="w-full">
              <p className="font-semibold">Orders for {moment().format('MMMM YYYY')}</p>
              <div className="w-full">
                <OrdersChart status="Order" type="line"
                  countType="daily"
                  month={moment().format("M")}
                  year={moment().format("YYYY")}
                  chartHeight="300"
                />
              </div>
            </div>
            <div className="w-full">
              <p className="font-semibold">Products Inventory</p>
              <div className="w-full">
                <ProductsChart  
                  type="line"
                  chartHeight="300"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full gap-5 my-5">
            <div className="w-full">
              <OrdersChart status="Pending"/>
            </div>
            <div className="w-full">
              <OrdersChart status="Paid"/>
            </div>
            <div className="w-full">
              <OrdersChart status="Completed"/>
            </div>
            
          </div>
        </div>
    )
}


export default Dashboard;