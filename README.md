# tempjs

TEMPJS is a fast, low code and no dependencies templating langage where you can use javascript inside html !

## Table of content

- [tempjs](#tempjs)
  - [Table of content](#table-of-content)
  - [Demo](#demo)
  - [Update](#update)
  - [Why tempjs ?](#why-tempjs-)
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
      - [Return a value without escaping HTML](#return-a-value-without-escaping-html)
      - [Writting comments](#writting-comments)
      - [Skip js instruction](#skip-js-instruction)
    - [Options](#options)

## Demo

See a simplified live editor on the [github page](https://yoannchb-pro.github.io/tempjs/index.html)

## Update

> NOTE: Use a version upper or equal to 1.0.6 to prevent XSS injection

See the [CHANGELOG](./CHANGELOG.md) file

## Why tempjs ?

There are several reasons why you should consider using tempjs:

1. <b>Lightweight</b>: tempjs is less than 5 kilobytes in size, making it a great choice for projects where size matters.

2. <b>No dependencies</b>: tempjs has no external dependencies, so you won't have to worry about installing and maintaining additional packages.

3. <b>Written in TypeScript</b>: tempjs is written in TypeScript, which makes it easy to use in modern projects and ensures that it follows best practices.

4. <b>Fast</b>: tempjs is optimized for rendering templates quickly, so your users won't experience any delays while waiting for content to load.

5. <b>Cross-platform</b>: tempjs works on any device and has the same properties and functionalities in both Node.js and the browser, making it a versatile tool for rendering templates in any environment.

6. <b>Customizable</b>: With tempjs, you can add as many custom delimiters and plugins as you want, allowing you to tailor it to your specific needs and make it work exactly the way you want it to.

By choosing tempjs, you can be confident that you're using a reliable and efficient template engine for your web application.

## Installation

```
$ npm i tempjs-template
```

Or directly in the browser with

```html
<script src="https://unpkg.com/tempjs-template@1.0.7/dist/index.js"></script>
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
    {%_# I'm just a comment dont worry _%}
    <ul>
        {%_ let index = 0 _%}
        {% for(const todo of todos){ _%}    
            <li style="color: {%= index%2 === 0 ? "red" : "green" %}">{%= todo %}</li>
            {%_ ++index %}
        {%_ } _%}
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
    {%_
        const req = await fetch("https://jsonplaceholder.typicode.com/todos/")
        const todos = await req.json()
    _%}
    <ul>
        {%_ for(const todo of todos){ _%}    
            <li>{%= todo.title %}</li>
        {%_ } _%}
    </ul>
    `,
  {
    /*some data here*/
  },
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
{%@ include("header.html", { userName: "Yoann" }) %}
```

#### Include from browser

> NOTE: Don't forget to set the option "async: true" if the file also have an includeBrowser

includeBrowser(filaname: string, data: Record<string, unknown>, options: Options): Promise\<string\>

```
{%@ await includeBrowser("header.html", { userName: "Yoann" }) %}
```

### Other Tags

#### Remove white spaces

> NOTE: It can be combined with custom delimiters (example: {%_# I'm a comment _%})

- `{%_` Remove white spaces before the first delimiter
- `_%}` Remove white spaces after the last delimiter

```html
{% if(5 > 0){ _%}
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

#### Return a value without escaping HTML

> **XSS injection warning**: Only use this with include/includeBrowser or if you are sure about what you are doing

The html will be executed

```
{% const greeting = "<h1>Hello World!</h1>" %}
{%@ greeting %}
```

Should compile as follow: `<h1>Hello World!</h1>`

#### Writting comments

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
  removeWhitespace?: boolean;
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
- <b>removeWhitespace</b> (default: false): Remove all whitespace before and after js instruction
- <b>delimiters</b> : Create customs delimiters. By default you have:

```
= return a value
@ return a value without escaping HTML
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
      return `$__output += escapeHTML(${content})`;
    },
},
```

- <b>plugins</b> : Create custom acessibles function into the template. By default you have "include" and "includeBrowser" that allow you to render other template into the current template:

```ts
include(filaname: string, data: Record<string, unknown>, options: Options): string | Promise<string>
includeBrowser(filaname: string, data: Record<string, unknown>, options: Options): Promise<string>

//Can be useful to create your own plugins
escapeHTML(obj: unknow): unknow //if the obj is a string HTML will be escaped
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
