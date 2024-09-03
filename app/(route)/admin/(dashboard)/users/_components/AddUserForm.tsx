"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/types/User";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import constant from "@/utils/constant";
import useUser, { useUserState } from "@/hooks/useUser";
import { UserProps } from "@/types/User";

import { KeySquare } from "lucide-react";
import { generatePassword } from "@/lib/utils";
interface AddUserProps {
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}

const AddUserForm: FC<AddUserProps> = ({onOpenChange, refresh}) => {
    const userHook = useUser({init: false});
    const userState = useUserState();
    const { toast } = useToast();
    const form = useForm<UserProps>({
        resolver: zodResolver(formSchema),
        mode: "all",
        defaultValues: userState.selected  || {}
      })

    const onSubmit: SubmitHandler<UserProps> = async (data) => {
        let response = userState.selected ? await  userHook.update(data, userState.selected?.["_id"] as string) : await userHook.create(data);
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name <span className="text-red-500">*</span>
                            </FormLabel>
                            {!userHook.loading ? <FormControl>
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email <span className="text-red-500">*</span>
                            </FormLabel>
                            {!userHook.loading ? <FormControl>
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Department <span className="text-red-500">*</span>
                            </FormLabel>
                            {!userHook.loading ? <FormControl>
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Username
                            </FormLabel>
                            {!userHook.loading ? <FormControl>
                                <Input {...field}/>
                            </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                        </FormItem>
                    )}
                />
                {!userState.selected?._id && <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>
                            Password <span className="text-red-500">*</span>
                        </FormLabel>
                        {!userHook.loading ? <FormControl>
                            <div  className="flex items-center gap-2">

                                <Input {...field} 
                                    readOnly
                                />
                                <Button
                                    className="flex items-center gap-2"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                        const password = generatePassword();
                                        form.setValue("password", password, {shouldValidate: true, shouldDirty: true})
                                    }}
                                >
                                   <KeySquare size={16} className="cursor-pointer"/>  Generate Password
                                </Button>
                            </div>
                            
                        </FormControl> : <Skeleton className="h-10 w-[full]"/>}
                        </FormItem>
                    )}
                />}
                <div>
                    <div className="flex gap-2 justify-end mt-10">

                        <Button 
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={userHook.loading}
                        >
                            Close
                        </Button>
                        <Button type="submit"
                            disabled={!form.formState.isValid || userHook.loading}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )

}

export default AddUserForm;