import tempjs from "../dist";

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

  it("Skip js instruction - Should skip js instruction", function () {
    const result = tempjs.compile("{%% console.log('hey') %}");
    expect(result).toBe("{% console.log('hey') %}");
  });

  it("Async - Should work with async files", async function () {
    const result = await tempjs.compile(
      "<p>{%= await Promise.resolve(greeting) %}</p>",
      { greeting: 123 },
      { async: true }
    );
    expect(result).toBe("<p>123</p>");
  });

  it("Debug and minimified - Debug should return not minified code", function () {
    const minimified = tempjs.debug("<p>Hi</p>");
    const notMinimified = tempjs.debug("<p>Hi</p>", {}, { minimified: false });
    expect(
      minimified.generatedCode === notMinimified.generatedCode
    ).toBeFalsy();
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
});
