import { $, component$, useSignal, useStyles$ } from '@builder.io/qwik';
import {
  Select,
  SelectListbox,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from '@qwik-ui/headless';
import styles from './select.css?inline';
export default component$(() => {
  useStyles$(styles);
  const users = ['Tim', 'Ryan', 'Jim', 'Jessie', 'Abby'];
  const selected = useSignal<string>('Ryan');

  return (
    <>
      <Select
        onChange$={$((value: string) => {
          selected.value = value;
        })}
        bind:value={selected}
        class="select"
      >
        <SelectTrigger class="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectListbox class="select-listbox">
          {users.map((user, index) => (
            <SelectOption value={index.toString()} class="select-option" key={user}>
              {user}
            </SelectOption>
          ))}
        </SelectListbox>
      </Select>
      <button onClick$={$(() => (selected.value = '4'))}>Change to Abby</button>
    </>
  );
});