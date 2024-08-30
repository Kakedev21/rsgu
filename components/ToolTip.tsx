import { FC, ReactNode } from "react";
import { TooltipProvider, Tooltip as TooltipWrapper, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface TooltipProps {
    trigger?: ReactNode | string;
    tooltip?: ReactNode | string
}
const Tooltip: FC<TooltipProps> = ({trigger, tooltip }) => {


    return (
        <TooltipProvider>
            <TooltipWrapper>
                <TooltipTrigger>{trigger}</TooltipTrigger>
                <TooltipContent>
                    {tooltip}
                </TooltipContent>
            </TooltipWrapper>
        </TooltipProvider>
    )

}

export default Tooltip;