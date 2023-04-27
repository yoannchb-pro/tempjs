const editor = document.querySelector("#editor");
const data = document.querySelector("#data");
const iframe = document.querySelector("#view");

const defaultTemplate = `<h1>{%= gretting %}</h1>
<p>It remain {%= todos.length %} items in my todo list:</p>
<ul>
    {% for(const todo of todos) { %}
        <li>{%= todo %}</li>
    {% } %}
</ul>
`;
const defaultDatas = {
  gretting: "Welcome to my todo list!",
  todos: ["Understand tempjs", "Learn typescript", "Make a cake"],
};
const defaultRender = tempjs.compile(defaultTemplate, defaultDatas);

editor.value = defaultTemplate;
data.value = JSON.stringify(defaultDatas, undefined, 4);
iframe.srcdoc = defaultRender;
