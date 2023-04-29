import tempjs from "../dist";
import fs from "fs";
import path from "path";

describe("Simple test list", function () {
  it("Comment - we should get an empty string", function () {
    const result = tempjs.compile(`{%# I'm a comment %}`);
    expect(result).toBe("");
  });

  it("Js instruction - Simple list of js instruction that should work", function () {
    const data = {
      todos: [
        "Eat a cake",
        "Learn typescript",
        "Make some food",
        "Learn tempjs",
      ],
    };
    const result = tempjs.compile(
      `
        {% for(let i=0; i<todos.length; ++i){ %}
            {% if(i%2 === 0){ %}
                <p>{%= todos[i] %}</p>
            {% } %}
        {% } %}
    `,
      data
    );
    expect(result.includes("Learn typescript")).toBeFalsy();
    expect(result.includes("Learn tempjs")).toBeFalsy();
  });

  it("White Space - Should remove white spaces", function () {
    const data = { greeting: "Hello" };
    const result = tempjs.compile(
      `
        {%_ if(greeting){ _%}
            <p>{%= greeting %}</p>
        {%_ } _%}
    `,
      data
    );
    expect(result).toBe("<p>Hello</p>");
  });

  it("White space and delimiter - Should remove white space but keep custom delimiter", function () {
    const data = { greeting: "Hello" };
    const result = tempjs.compile(
      `
       {%_= greeting _%}
    `,
      data
    );
    expect(result).toBe("Hello");
  });

  it("Skip js instruction - Should skip js instruction with string characters", function () {
    const result = tempjs.compile(`{%% console.log("hey") %}`);
    expect(result).toBe(`{% console.log("hey") %}`);
  });

  it("Skip js instruction 2 - Should skip js instruction with string characters", function () {
    const result = tempjs.compile(`{%%= greeting %}`);
    expect(result).toBe(`{%= greeting %}`);
  });

  it("Debug and minimified - Debug should return not minified code", function () {
    const minimified = tempjs.debug("<p>Hi</p>");
    const notMinimified = tempjs.debug("<p>Hi</p>", {}, { minimified: false });
    expect(
      minimified.generatedCode === notMinimified.generatedCode
    ).toBeFalsy();
  });

  it("Create Function - Should return a function to compile the template", function () {
    const fn = tempjs.createFunction("<p>{%= greeting %}</p>", {
      greeting: "Hello",
    });
    expect(fn()).toBe("<p>Hello</p>");
  });

  it("Compile File - Should compile a file", function () {
    const result = tempjs.compileFromFile(
      path.resolve(__dirname, "./templates/simpleTemplate.html"),
      { greeting: "Hello" }
    );
    expect(result).toBe("<h1>Hello</h1>");
  });

  it("Include - Should include some files", function () {
    const result = tempjs.compile(
      "{%= include(path, { username, greeting }) %}<p>Welcome to tempjs</p>",
      {
        greeting: "Hello",
        username: "Yoann",
        path: path.resolve(__dirname, "./templates/include.html"),
      }
    );
    expect(result).toBe(
      "<header>Yoann</header><h1>Hello</h1><p>Welcome to tempjs</p>"
    );
  });

  it("Root - Should include some files with a specified root", function () {
    const result = tempjs.compile(
      "{%= include('include.html', { username, greeting }) %}<p>Welcome to tempjs</p>",
      {
        greeting: "Hello",
        username: "Yoann",
        root: path.resolve(__dirname, "./templates"),
      }
    );
    expect(result).toBe(
      "<header>Yoann</header><h1>Hello</h1><p>Welcome to tempjs</p>"
    );
  });

  it("Multiple includes - Should include some files with", function () {
    const result = tempjs.compile(
      `{%= include('include.html', { username, greeting }) %}{%= include('simpleTemplate.html', { username, greeting }) %}`,
      {
        greeting: "Hello",
        username: "Yoann",
        root: path.resolve(__dirname, "./templates"),
      }
    );
    expect(result).toBe(`<header>Yoann</header><h1>Hello</h1><h1>Hello</h1>`);
  });

  it("Custom Plugin - Should create a custom plugin", function () {
    const result = tempjs.compile(
      "<p>{%= truncat('Hello My Name is Yoann', 5) %}</p>",
      {},
      {
        plugins: [
          {
            name: "truncat",
            description: "Truncat some text",
            fn: function (text: string, size: number) {
              return text.substring(0, size);
            },
          },
        ],
      }
    );
    expect(result).toBe("<p>Hello</p>");
  });

  it("Custom Delimiter - Should create a custom delimiter", function () {
    const result = tempjs.compile(
      "<p>{%> HELLO %}</p>",
      {},
      {
        delimiters: [
          {
            name: "LowerCase",
            description: "Should transform a string to lower case",
            delimiter: ">",
            fn: (content) => `$__output += "${content.toLocaleLowerCase()}"`,
          },
        ],
      }
    );
    expect(result).toBe("<p> hello </p>");
  });

  it("Context - should define the good context", function () {
    const result = tempjs.compile(
      "<p>{%= this.greeting %}</p>",
      {},
      { context: { greeting: "Hello" } }
    );
    expect(result).toBe("<p>Hello</p>");
  });

  it("Open and close delimiters - Should replace the delimiters by [[]]", function () {
    const data = { greeting: "Hello" };
    const result = tempjs.compile(
      `
          [[_ if(greeting){ _]]
              <p>[[= greeting ]]</p>
          [[_ } _]]
      `,
      data,
      { openDelimiter: "[[", closeDelimiter: "]]" }
    );
    expect(result).toBe("<p>Hello</p>");
  });

  it("Async - Should work with async files", async function () {
    const result = await tempjs.compile(
      "<p>{%= await Promise.resolve(greeting) %}</p>",
      { greeting: 123 },
      { async: true }
    );
    expect(result).toBe("<p>123</p>");
  });
});
