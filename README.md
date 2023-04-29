# tempjs

TEMPJS is a fast, low code and no dependencies templating langage where you can use javascript inside html !

## Table of content

- [tempjs](#tempjs)
  - [Table of content](#table-of-content)
  - [Demo](#demo)
  - [Update](#update)
  - [Installation](#installation)
  - [Import](#import)
  - [Simple example](#simple-example)
  - [Simple example with async](#simple-example-with-async)
  - [Usage](#usage)
    - [API](#api)
    - [Include other template into the current](#include-other-template-into-the-current)
      - [Include from nodejs](#include-from-nodejs)
      - [Include from browser](#include-from-browser)
    - [Other Tags](#other-tags)
      - [Remove white spaces](#remove-white-spaces)
    - [Additionals delimiters](#additionals-delimiters)
      - [Return a value](#return-a-value)
      - [Writing comments](#writing-comments)
      - [Skip js instruction](#skip-js-instruction)
    - [Options](#options)

## Demo

See a simplified live editor on the [github page](https://yoannchb-pro.github.io/tempjs/index.html)

## Update

See the [CHANGELOG](./CHANGELOG.md) file

## Installation

```
$ npm i tempjs-template
```

Or directly in the browser with

```html
<script src="https://unpkg.com/tempjs-template@1.0.4/dist/index.js"></script>
```

## Import

```ts
import tempjs from "tempjs-template";
```

## Simple example

> NOTE: You can use any javascript syntax into the template just ensure to use <b>=</b> operator if you want to return something (<b>never use return</b>)

In this example we render a list and apply a color on the index

```js
const todos = ["Make a chatbot", "Eat an apple", "Do some sports"];
const data = { todos };
document.body.innerHTML = tempjs.compile(
  `
    {%# I'm just a comment dont worry %}
    <ul>
        {% let index = 0 %}
        {% for(const todo of todos){ %}    
            <li style="{%= index%2 === 0 ? "red" : "green" %}">{%= todo %}</li>
            {% ++index %}
        {% } %}
    </ul>
    `,
  data
);
```

## Simple example with async

Working with async is pretty simple

```js
await tempjs.compile(
  `
    {%
        const req = await fetch("https://jsonplaceholder.typicode.com/todos/")
        const todos = await req.json()
    %}
    <ul>
        {% for(const todo of todos){ %}    
            <li>{%= todo.title %}</li>
        {% } %}
    </ul>
    `,
  {},
  { async: true }
);
```

## Usage

### API

> NOTE: The return type is calculed on the options so it will be automatically set to string or Promise\<string\>. Below is just a simplified version of the return type.

- <b>tempjs.compile</b>(template: string, data: Record\<string, unknown\>, options: Options): string | Promise\<string\>
- <b>tempjs.compileFromFile</b>(filePath: string, data: Record\<string, unknown\>, options: Options): string | Promise\<string\>
- <b>tempjs.compileFromFileBrowser</b>(filePath: string, data: Record\<string, unknown\>, options: Options): Promise\<string\>
- <b>tempjs.createFunction</b>(filePath: string, data: Record\<string, unknown\>, options: Options): () => string | Promise\<string\>
- <b>tempjs.debug</b>(filePath: string, data: Record\<string, unknown\>, options: Options): { template, options, data, generatedFunction, generatedCode, dataListName, dataListValue, pluginsName, pluginsFunctions }

### Include other template into the current

#### Include from nodejs

include(filaname: string, data: Record<string, unknown>, options: Options): string | Promise\<string\>

```
{%= include("header.html", { userName: "Yoann" }) %}
```

#### Include from browser

> NOTE: Don't forget to set the option "async: true" if the file also have an includeBrowser

includeBrowser(filaname: string, data: Record<string, unknown>, options: Options): Promise\<string\>

```
{%= await includeBrowser("header.html", { userName: "Yoann" }) %}
```

### Other Tags

#### Remove white spaces

> NOTE: It can be combined with custom delimiters (example: {%_# I'm a comment _%})

- `{%_` Remove white spaces before the first delimiter
- `_%}` Remove white spaces after the last delimiter

```html
{%_ if(5 > 0){ _%}
<h1>Five is greater than 0</h1>
{%_ } %}
```

Should compile as follow: `<h1>Five is greater than 0</h1>`

### Additionals delimiters

#### Return a value

```html
{% const greeting = "Hello World!" %}
<h1>{%= greeting %}</h1>
```

Should compile as follow: `<h1>Hello World!</h1>`

#### Writing comments

```html
{%# You can write some comments here it will not be shown or evaluate
console.log("I ll not show") %}
<h1>I love Tempjs</h1>
```

Should compile as follow: `<h1>I love Tempjs</h1>`

#### Skip js instruction

```
{%% greeting %}
```

Should compile as follow: `{% greeting %}`

### Options

```ts
type Options = {
  openDelimiter?: string;
  closeDelimiter?: string;
  context?: unknown;
  async?: boolean;
  minimified?: boolean;
  root?: string;
  delimiters?: {
    name: string;
    description: string;
    delimiter: string;
    fn: (content: string, options: Options) => string;
  }[];
  plugins?: { name: string; description: string; fn: Function }[];
};
```

- <b>openDelimiter</b> (default: {%) : Open delimiter
- <b>closeDelimiter</b> (default: %}) : Close delimiter
- <b>context</b> (default: null) : Context of the function
- <b>async</b> (default: false) : Make asynchronous requests in the template
- <b>minimified</b> (default: true) : Make the generated code more readable in debug mode
- <b>root</b> (default: null): Specifie a root directory for including files
- <b>delimiters</b> : Create customs delimiters. By default you have:

```
= return a value
# create a comment
% Ingnore js instruction and display is as text with delimiters
```

Examples of implementation:

- Comment

```js
{
    name: "comment",
    description: "Shortcut to turn some code into a comment",
    delimiter: "#",
    fn: function (content, options) {
      return "/*" + content + "*/";
    },
  }
```

- Return value

```js
{
    name: "return",
    description: "Allow user to add variable to the output",
    delimiter: "=",
    fn: function (content, options) {
      return "$__output += " + content;
    },
},
```

- <b>plugins</b> : Create custom acessibles function into the template. By default you have "include" and "includeBrowser" that allow you to render other template into the current template:

```
include(filaname: string, data: Record<string, unknown>, options: Options): string | Promise<string>
includeBrowser(filaname: string, data: Record<string, unknown>, options: Options): Promise<string>
```

Example of implementation:

```ts
  {
    name: "truncat",
    description: "Truncat some text",
    fn: function(text: string, size: number){
        return text.trim().substring(0, size);
    },
  },
```
