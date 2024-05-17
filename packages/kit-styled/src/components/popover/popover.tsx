import { PropsOf, Slot, component$, useStyles$ } from '@builder.io/qwik';
import { Popover as HeadlessPopover } from '@qwik-ui/headless';
import { cn } from '@qwik-ui/utils';

const Root = component$<PropsOf<typeof HeadlessPopover.Root>>(({ ...props }) => {
  return (
    <HeadlessPopover.Root {...props}>
      <Slot />
    </HeadlessPopover.Root>
  );
});

const Trigger = HeadlessPopover.Trigger;

const Panel = component$<PropsOf<typeof HeadlessPopover.Panel>>(({ ...props }) => {
  useStyles$(`
    .my-transition {
      transition: opacity 150ms, display 150ms, overlay 150ms;
      transition-behavior: allow-discrete;
    }
  
    .popover-showing {
      opacity: 1;
    }
  
    .popover-closing {
      opacity: 0;
    }
    `);

  return (
    <HeadlessPopover.Panel
      {...props}
      class={cn(
        'my-transition w-72 rounded-md border bg-popover p-4 text-popover-foreground opacity-0 shadow-md outline-none',
        props.class,
      )}
    >
      <Slot />
    </HeadlessPopover.Panel>
  );
});

export const Popover = {
  Root,
  Trigger,
  Panel,
};
