"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formSchema, ProductProps } from "@/types/Product";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import useCategory from "@/hooks/useCategory";
import { orderBy } from "lodash";
import useProduct, { useProductState } from "@/hooks/useProduct";
import { useToast } from "@/components/ui/use-toast";
import constant from "@/utils/constant";
interface AddProductProps {
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}

const AddProductForm: FC<AddProductProps> = ({onOpenChange, refresh}) => {
    const catergoryHook = useCategory({init: true});
    const productHook = useProduct({init: false});
    const productState = useProductState();
    const { toast } = useToast();
    const form = useForm<ProductProps>({
        resolver: zodResolver(formSchema),
        mode: "all",
        defaultValues: productState.selected  || {}
      })

    const onSubmit: SubmitHandler<ProductProps> = async (data) => {
        let response = productState.selected ? await  productHook.update(data, productState.selected?.["_id"] as string) : await productHook.create(data);
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
    console.log("formState", form.formState)
    return (
        <Form {...form}>
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
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
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
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
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
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
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
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                        </FormItem>
                    )}
                />
                <div className="flex gap-4 w-full">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Price <span className="text-red-500">*</span>
                                </FormLabel>
                                {!productHook.loading ? <FormControl>
                                    <Input {...field} onChange={(event) => field.onChange(+event.target.value)}/>
                                </FormControl> : <Skeleton className="h-10 w-[full]"/>}
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
                                    <Input {...field} onChange={(event) => field.onChange(+event.target.value)}/>
                                </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                            </FormItem>
                        )}
                    />
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
        </Form>
    )

}

export default AddProductForm;