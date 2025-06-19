import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type ActionButtonProps = {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tooltip: string;
  variant:
    | "secondary"
    | "ghost"
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | null
    | undefined;
  size: "sm" | "lg" | "icon" | "default" | null | undefined;
};
export default function ActionButton({
  icon,
  onClick,
  disabled,
  tooltip,
  variant,
  size,
}: ActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant={variant}
          size={size}
          className="text-peregrine-secondary-foreground group-hover:text-white cursor-pointer"
          onClick={onClick}
          disabled={disabled}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
