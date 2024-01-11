import { component$ } from '@builder.io/qwik';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@qwik-ui/fluffy';

export default component$(() => {
  return (
    <Accordion behavior="single" collapsible class="w-full">
      <AccordionItem id="item-1">
        <AccordionHeader>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem id="item-2">
        <AccordionHeader>
          <AccordionTrigger>Is it styled?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components&apos;
          aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem id="item-3">
        <AccordionHeader>
          <AccordionTrigger>Is it animated?</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
});
