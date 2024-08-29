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
interface AddProductProps {
    onOpenChange: (value: boolean) => void;
}

const AddProductForm: FC<AddProductProps> = ({onOpenChange}) => {
    const [loading, setLoading]  = useState();
    const form = useForm<ProductProps>({
        resolver: zodResolver(formSchema),
        mode: "all"
      })

    const onSubmit: SubmitHandler<ProductProps> = async (data) => {
        console.log("data", data);
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
                            {!loading ? <FormControl>
                                <Select {...field} onValueChange={(value) => field.onChange(value)}>
                                    <SelectTrigger className="focus:ring-0">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
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
                            {!loading ? <FormControl>
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
                            {!loading ? <FormControl>
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
                            {!loading ? <FormControl>
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
                                {!loading ? <FormControl>
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
                                {!loading ? <FormControl>
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
                        >
                            Cancel
                        </Button>
                        <Button type="submit"
                            disabled={!form.formState.isValid}
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