import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { MyTabs, MyTabList, MyTabPanel, MyTab } from './user-tabs';

export const UserTabs = component$(() => {
  return (
    <MyTabs>
      <MyTabList style={{ background: 'red' }}>
        <MyTab>Tab 1</MyTab>
        <MyTab>Tab 2</MyTab>
        <MyTab>Tab 3</MyTab>
      </MyTabList>
      <MyTabPanel>Panel 1</MyTabPanel>
      <MyTabPanel>Panel 2</MyTabPanel>
      <MyTabPanel>Panel 3</MyTabPanel>
    </MyTabs>
  );
});

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <p>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </p>
      <UserTabs />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
