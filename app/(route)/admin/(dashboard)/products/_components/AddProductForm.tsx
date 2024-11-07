"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formSchema, ProductProps } from "@/types/Product";
import { FC, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import useCategory from "@/hooks/useCategory";
import { orderBy } from "lodash";
import useProduct, { useProductState } from "@/hooks/useProduct";
import useReport from "@/hooks/useReport";

import { useToast } from "@/components/ui/use-toast";
import constant from "@/utils/constant";

import { ScrollArea } from "@/components/ui/scroll-area";

interface AddProductProps {
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}

const AddProductForm: FC<AddProductProps> = ({ onOpenChange, refresh }) => {
    const catergoryHook = useCategory({ init: true });
    const productHook = useProduct({ init: false });
    const reportHook = useReport()
    const productState = useProductState();
    const [productImage, setProductImage] = useState<string | null>(productState.selected?.image as string);
    const { toast } = useToast();
    const form = useForm<ProductProps>({
        resolver: zodResolver(formSchema),
        mode: "all",
        defaultValues: productState.selected || { description: "" }
    })

    const onSubmit: SubmitHandler<ProductProps> = async (data) => {
        let response = productState.selected ? await productHook.update({ ...data, image: productImage as string }, productState.selected?.["_id"] as string) : await productHook.create({ ...data, image: productImage as string });

        const productResponse = response;
        if (productResponse.product) {
            const reportPayload = {
                productId: productResponse.product._id,
                beginningInventory: {
                    quantity: productResponse.product.quantity,
                    unitCost: productResponse.product.cost,
                    unitPrice: productResponse.product.price
                },
                sales: {
                    unitCost: productResponse.product.cost,
                    unitPrice: productResponse.product.price
                },
                endingInventory: {
                    unitCost: productResponse.product.cost,
                    unitPrice: productResponse.product.price
                }
            }
            console.log("report", reportPayload)
            const responses = await reportHook.create(reportPayload)
            console.log("R", responses)
        }

        console.log("T", response)
        if (response?.error) {
            return toast({
                title: "Something went wrong",
                description: constant?.error?.[response?.error?.code as string],
                variant: "destructive"
            })
        }
        toast({
            title: "Save successfully"
        })
        form.reset();
        if (refresh) {
            refresh()
        }
    }
    const handleFileChange = (event: any) => {
        const file = event?.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setProductImage(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    console.log("formState", form.formState, productImage)
    return (
        <Form {...form}>
            <ScrollArea className="h-[500px] px-5">

                <form className="space-y-4 mt-5" onSubmit={form.handleSubmit(onSubmit)} >

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Category <span className="text-red-500">*</span>
                                </FormLabel>
                                {(!catergoryHook.loading || !productHook.loading) ? <FormControl>
                                    <Select {...field} onValueChange={(value) => field.onChange(value)}>
                                        <SelectTrigger className="focus:ring-0">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                orderBy(catergoryHook.categories?.categories, ["name"], ["asc"])?.map(category => (
                                                    <SelectItem value={category._id as string}>{category.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </FormControl> : <Skeleton className="h-10 w-[full]" />}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="productId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Product ID <span className="text-red-500">*</span>
                                </FormLabel>
                                {!productHook.loading ? <FormControl>
                                    <Input {...field} />
                                </FormControl> : <Skeleton className="h-10 w-[full]" />}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name <span className="text-red-500">*</span>
                                </FormLabel>
                                {!productHook.loading ? <FormControl>
                                    <Input {...field} />
                                </FormControl> : <Skeleton className="h-10 w-[full]" />}
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                {!productHook.loading ? <FormControl>
                                    <Input {...field} />
                                </FormControl> : <Skeleton className="h-10 w-[full]" />}
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-4 w-full">
                        <FormField
                            control={form.control}
                            name="cost"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Cost <span className="text-red-500">*</span>
                                    </FormLabel>
                                    {!productHook.loading ? <FormControl>
                                        <Input {...field} onChange={(event) => field.onChange(+event.target.value)} />
                                    </FormControl> : <Skeleton className="h-10 w-[full]" />}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Price <span className="text-red-500">*</span>
                                    </FormLabel>
                                    {!productHook.loading ? <FormControl>
                                        <Input {...field} onChange={(event) => field.onChange(+event.target.value)} />
                                    </FormControl> : <Skeleton className="h-10 w-[full]" />}
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Quantity <span className="text-red-500">*</span>
                                    </FormLabel>
                                    {!productHook.loading ? <FormControl>
                                        <Input {...field} onChange={(event) => field.onChange(+event.target.value)} />
                                    </FormControl> : <Skeleton className="h-10 w-[full]" />}
                                </FormItem>
                            )}
                        />

                    </div>
                    <div className="space-y-3">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Product Image
                                    </FormLabel>
                                    {!productHook.loading ? <FormControl>
                                        <Input type="file" onChange={handleFileChange} />
                                    </FormControl> : <Skeleton className="h-10 w-[full]" />}
                                </FormItem>
                            )}
                        />
                        {productImage && <img src={productImage as string} alt="Product Image" className="max-w-[400px] max-h-[300px]" />}
                    </div>
                    <div>
                        <div className="flex gap-2 justify-end mt-10">

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                disabled={productHook.loading}
                            >
                                Close
                            </Button>
                            <Button type="submit"
                                disabled={!form.formState.isValid || productHook.loading}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </ScrollArea>
        </Form>
    )

}

export default AddProductForm;