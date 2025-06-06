import { component$ } from '@builder.io/qwik';
import { CodeSnippet } from '~/components/code-snippet/code-snippet';

import BuildingBlocksSnippet from './snippets/building-blocks.tsx?raw';
export const CodeSnippetBuildingBlocks = component$(() => {
  return <CodeSnippet code={BuildingBlocksSnippet} />;
});

import SelectCssSnippet from './snippets/select.css?raw';
export const CodeSnippetSelectCss = component$(() => {
  return <CodeSnippet code={SelectCssSnippet} />;
});
