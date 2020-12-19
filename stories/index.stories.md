```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/read-more.js';

export default {
  title: 'ReadMore',
  component: 'read-more',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# ReadMore

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add read-more
```

```js
import 'read-more/read-more.js';
```

```js preview-story
export const Simple = () => html`
  <read-more></read-more>
`;
```

## Variations

###### Custom Title

```js preview-story
export const CustomTitle = () => html`
  <read-more title="Hello World"></read-more>
`;
```
