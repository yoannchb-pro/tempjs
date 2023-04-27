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
});
