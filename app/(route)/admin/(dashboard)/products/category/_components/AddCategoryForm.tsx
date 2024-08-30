"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryFormSchema, CategoryProps } from "@/types/Product";
import { FC, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import useCategory, { useCategoryState } from "@/hooks/useCategory";
import { useToast } from "@/components/ui/use-toast";
interface AddCategoryProps {
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}

const AddCategoryForm: FC<AddCategoryProps> = ({onOpenChange, refresh}) => {
    const categoryState = useCategoryState();
    const { toast } = useToast();
    const categoryHook = useCategory({init: false});
    const form = useForm<CategoryProps>({
        resolver: zodResolver(categoryFormSchema),
        mode: "all",
        defaultValues: categoryState.selected  || {}
      })

    const onSubmit: SubmitHandler<CategoryProps> = async (data) => {

        let response = categoryState.selected ? await  categoryHook.update(data, categoryState.selected?.["_id"] as string) : await categoryHook.create(data);
        if (response?.data?.error) {
            return toast({
                title: "Something went wrong",
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
                            {!categoryHook.loading ? <FormControl>
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
                            disabled={categoryHook.loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit"
                            disabled={!form.formState.isValid || categoryHook.loading}
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