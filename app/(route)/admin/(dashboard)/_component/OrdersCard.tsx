"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FC, ReactNode } from "react";
  

interface OrdersCardProps {
    title?: string;
    description?: string;
    content?: ReactNode;
    footer?: ReactNode
}
const OrdersCard:FC<OrdersCardProps> = ({title, description, content, footer}) => {
    return (
        <div>

            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {content}
                </CardContent>
                <CardFooter>
                    {footer}
                </CardFooter>
            </Card>
        </div>

    );
}
 
export default OrdersCard;