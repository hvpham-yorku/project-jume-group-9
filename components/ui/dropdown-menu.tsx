"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "@/lib/utils";



  }

      className,
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      sideOffset={sideOffset}
      className={cn(
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>

    inset?: boolean;
  <DropdownMenuPrimitive.Item
    className={cn(
      className,
    )}
    {...props}
  />

  <DropdownMenuPrimitive.CheckboxItem
    className={cn(
      className,
    )}
    checked={checked}
    {...props}
  >
      <DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>

  <DropdownMenuPrimitive.RadioItem
    className={cn(
      className,
    )}
    {...props}
  >
      <DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>

    inset?: boolean;
  <DropdownMenuPrimitive.Label
    {...props}
  />

  <DropdownMenuPrimitive.Separator
    {...props}

  className,
  ...props
  return (
      {...props}
    />
  );

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
};
