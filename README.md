# tempjs

TEMPJS is a fast, low code and no dependencies templating langage where you can use javascript inside html !

## Update

See the [CHANGELOG](./CHANGELOG.md) file

## Installation

```
$ npm i tempjs
```

Or directly in the browser with

```html
<script src="https://unpkg.com/tempjs@1.0.0/dist/index.js"></script>
```

## Import

```ts
import tempjs from "tempsjs";
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
            {% if(index%2 === 0) { %} 
                <li style="color: red">{%= todo.title %}</li>
            {% } else { %}
                <li style="color: green">{%= todo.title %}</li>
            {% } %}
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

- tempjs.compile(template: string, data: Record<string, unknown>, options: Options): string | Promise<string>
- tempjs.compileFromFile(filePath: string, data: Record<string, unknown>, options: Options): string | Promise<string>

### Include other template into the current

> NOTE: Only available in nodejs

include(filaname: string, data: Record<string, unknown>, options: Options)

```
{%= include("header.html", { userName: "Yoann" }) %}
```

### Additionals delimiters

#### Remove white spaces

```html
{%_ if(5 > 0){ _%}
<h1>Five is greater than 0</h1>
{%_ } _%}
```

Should compile as follow: `<h1>Five is greater than 0</h1>`

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

### Skip js instruction

```
{%% gretting %}
```

Should compile as follow: `{% gretting %}`

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

> Comment

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

> Return value

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

- <b>plugins</b> : Create custom acessibles function into the template. By default you have "include" that allow you to render other template into the current template:

```
include(filaname: string, data: Record<string, unknown>, options: Options)
```

Example of implementation:

```ts
  {
    name: "truncat",
    description: "Truncat some text",
    fn: function(text: string, size: number){
        return text.substring(0, size);
    },
  },
```
