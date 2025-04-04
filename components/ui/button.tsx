import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  {
    variants: {
      variant: {
        destructive:
        outline:
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

  asChild?: boolean;
    const Comp = asChild ? Slot : "button";

export { Button, buttonVariants };
