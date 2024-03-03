import { component$, useStyles$ } from '@builder.io/qwik';
import {
  Select,
  SelectGroup,
  SelectLabel,
  SelectListbox,
  SelectOption,
  SelectTrigger,
  SelectValue,
} from '@qwik-ui/headless';
import styles from './select.css?inline';

export default component$(() => {
  useStyles$(styles);
  const users = ['Tim', 'Ryan', 'Jim', 'Abby'];
  const animals = ['Dog', 'Cat', 'Bird'];

  return (
    <Select class="select">
      <SelectTrigger class="select-trigger">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectListbox class="select-listbox">
        <SelectGroup>
          <SelectLabel class="select-label">People</SelectLabel>
          {users.map((user) => (
            <SelectOption class="select-option" key={user}>
              {user}
            </SelectOption>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel class="select-label">Animals</SelectLabel>
          {animals.map((animal) => (
            <SelectOption class="select-option" key={animal}>
              {animal}
            </SelectOption>
          ))}
        </SelectGroup>
      </SelectListbox>
    </Select>
  );
});