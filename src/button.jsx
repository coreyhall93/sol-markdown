import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const buttonVariants = cva("sol-button", {
  variants: {
    variant: {
      default: "sol-button-default",
      outline: "sol-button-outline",
      ghost: "sol-button-ghost",
    },
    size: { default: "sol-button-size" },
  },
  defaultVariants: { variant: "outline", size: "default" },
});
export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={twMerge(clsx(buttonVariants({ variant, size, className })))}
      {...props}
    />
  );
}
