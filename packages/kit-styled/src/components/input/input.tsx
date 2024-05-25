import { component$, type PropsOf } from '@builder.io/qwik';
import { cn } from '@qwik-ui/utils';

type InputProps = PropsOf<'input'> & {
  error?: string;
};

export const Input = component$<InputProps>(
  ({
    name,
    error,
    'bind:value': valueSig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    'bind:checked': checkedSig,
    id,
    ...props
  }) => {
    const inputId = id || name;
    return (
      <>
        <input
          {...props}
          aria-errormessage={`${inputId}-error`}
          aria-invalid={!!error}
          bind:value={valueSig}
          class={cn(
            'flex h-12 w-full rounded-base border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            props.class,
          )}
          id={inputId}
        />
        {error && (
          <div id={`${inputId}-error`} class="text-destructive mt-1 text-sm">
            {error}
          </div>
        )}
      </>
    );
  },
);
