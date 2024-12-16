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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSession } from "next-auth/react";

interface AddUserProps {
    onOpenChange: (value: boolean) => void;
    refresh?: () => void;
}

const AddUserForm: FC<AddUserProps> = ({ onOpenChange, refresh }) => {
    const userHook = useUser({ init: false });
    const session = useSession();
    const userState = useUserState();
    const { toast } = useToast();
    const form = useForm<UserProps>({
        resolver: zodResolver(formSchema),
        mode: "all",
        defaultValues: userState.selected || {}
    })

    const onSubmit: SubmitHandler<UserProps> = async (data) => {
        let response = userState.selected ? await userHook.update(data, userState.selected?.["_id"] as string) : await userHook.create(data);
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
                                <Input {...field} />
                            </FormControl> : <Skeleton className="h-10 w-[full]" />}
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
                                <Input {...field} />
                            </FormControl> : <Skeleton className="h-10 w-[full]" />}
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
                                <Input {...field} />
                            </FormControl> : <Skeleton className="h-10 w-[full]" />}
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
                                <Input {...field} />
                            </FormControl> : <Skeleton className="h-10 w-[full]" />}
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
                                <Input {...field} type="password" />
                            </FormControl> : <Skeleton className="h-10 w-[full]" />}
                        </FormItem>
                    )}
                />}
                {["admin"].includes(session.data?.user?.role as string) && (
                    <>
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>
                                        Role <span className="text-red-500">*</span>
                                    </FormLabel>
                                    {!userHook.loading ? <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                if (value === 'sub-admin') {
                                                    form.setValue('role', 'admin');
                                                    form.setValue('subRole', 'sub-admin');
                                                } else {
                                                    form.setValue('role', value);
                                                    form.setValue('subRole', '');
                                                }
                                            }}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="admin" id="admin" />
                                                <label htmlFor="admin">Admin</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="sub-admin" id="sub-admin" />
                                                <label htmlFor="sub-admin">Sub Admin</label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl> : <Skeleton className="h-10 w-[full]" />}
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="subRole"
                            render={({ field }) => {
                                return <FormItem className="hidden">
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            }}
                        />
                    </>
                )}
                {["cashier"].includes(session.data?.user?.role as string) && (
                    <>
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>
                                        Role <span className="text-red-500">*</span>
                                    </FormLabel>
                                    {!userHook.loading ? <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                if (value === 'sub-cashier') {
                                                    form.setValue('role', 'cashier');
                                                    form.setValue('subRole', 'sub-cashier');
                                                } else {
                                                    form.setValue('role', value);
                                                    form.setValue('subRole', '');
                                                }
                                            }}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="cashier" id="cashier" />
                                                <label htmlFor="cashier">Cashier</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="sub-cashier" id="sub-cashier" />
                                                <label htmlFor="sub-cashier">Sub Cashier</label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl> : <Skeleton className="h-10 w-[full]" />}
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="subRole"
                            render={({ field }) => {
                                return <FormItem className="hidden">
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            }}
                        />
                    </>
                )}
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
                            disabled={userHook.loading}
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