"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryFormSchema, CategoryProps } from "@/types/Product";
import { FC, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
interface AddCategoryProps {
    onOpenChange: (value: boolean) => void;
}

const AddCategoryForm: FC<AddCategoryProps> = ({onOpenChange}) => {
    const [loading, setLoading]  = useState();
    const form = useForm<CategoryProps>({
        resolver: zodResolver(categoryFormSchema),
        mode: "all"
      })

    const onSubmit: SubmitHandler<CategoryProps> = async (data) => {
        console.log("data", data);
    }
    console.log("formState", form.formState)
    return (
        <Form {...form}>
            <form className="space-y-4 mt-5" onSubmit={form.handleSubmit(onSubmit)} >
               
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

export default AddCategoryForm;