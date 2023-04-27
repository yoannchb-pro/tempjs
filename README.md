# tempjs

TEMPJS is a fast, low code and no dependencies templating langage where you can use javascript inside html !

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

> NOTE: You can use any javascript syntax into the template just ensure to use <b>=</b> operator if you want to return some thing and <b>not return</b>

In this example we render a list and apply a color on the index

```js
const todos = ["Make a chatbot", "Eat an apple", "Do some sports"];
const data = { todos };
document.body.innerHTML = tempjs.compile(
  `
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

## Async

Working with async is pretty simple

```js
tempjs.compile(
  `
    {%
        const req = await fetch("https://jsonplaceholder.typicode.com/todos/")
        const todos = await req.json()
    %}
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
  {},
  { async: true }
);
```

## Usage

- tempjs.compile(template: string, data: Record<string, unknown>, options: Options)
- tempjs.compileFromFile(filePath: string, data: Record<string, unknown>, options: Options)
