import { component$ } from '@builder.io/qwik';
import { Popover, PopoverTrigger } from '@qwik-ui/headless';

export default component$(() => {
  const myPopovers = [
    { id: 'auto-1', content: 'Popover 1' },
    { id: 'auto-2', content: 'Popover 2' },
  ];

  return (
    <>
      {myPopovers.map((popover, index) => (
        <>
          <PopoverTrigger
            popovertarget={popover.id}
            class="mb-4 rounded-md border-2 border-slate-300 bg-slate-800 px-3 py-1 text-white"
          >
            Popover Trigger {index + 1}
          </PopoverTrigger>

          <Popover
            id={popover.id}
            class="shadow-dark-medium py- rounded-md border-2 border-slate-300 bg-slate-800 px-3 py-1"
            style={{ top: `${index * 20}px` }}
          >
            {popover.content}
          </Popover>
        </>
      ))}
    </>
  );
});
