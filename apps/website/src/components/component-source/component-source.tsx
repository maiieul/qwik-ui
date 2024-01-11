import { QwikIntrinsicElements, component$, useSignal, useTask$ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { isDev } from '@builder.io/qwik/build';
import { Highlight } from '../highlight/highlight';

// The below `/src/routes/docs/**/**/snippets/*.tsx` pattern is here so that import.meta.glob works both for fluffy and headless routes.
// For example:
// /src/routes/docs/components/fluffy/modal/snippets/building-blocks.tsx
// /src/routes/docs/components/headless/modal/snippets/building-blocks.tsx

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentSources: any = import.meta.glob('/', {
  as: 'raw',
  eager: isDev ? false : true,
});

type ComponentSourceProps = QwikIntrinsicElements['div'] & {
  name: string;
};

export const ComponentSource = component$<ComponentSourceProps>(({ name }) => {
  const location = useLocation();

  // Determine the file extension if not specified
  const fileExtension =
    name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.css') ? '' : '.tsx';
  const snippetPath = `/src/routes${location.url.pathname}snippets/${name}${fileExtension}`;

  const componentSourceSig = useSignal<string>();

  useTask$(async () => {
    componentSourceSig.value = isDev
      ? await componentSources[snippetPath]() // We need to call `await componentSources[snippetPath]()` in development as it is `eager:false`
      : componentSources[snippetPath]; // We need to directly access the `componentSources[snippetPath]` expression in preview/production as it is `eager:true`
  });

  return (
    <div class="shadow-3xl shadow-light-medium dark:shadow-dark-medium -mx-6 mb-6 rounded-xl border lg:-mx-8">
      <Highlight code={componentSourceSig.value || ''} />
    </div>
  );
});
