const editor = document.querySelector("#editor");
const data = document.querySelector("#data");
const iframe = document.querySelector("#view");

const defaultTemplate = `<h1>{%= greeting %}</h1>
<p>It is a simplified version. See the <a target="_blank" href="https://github.com/yoannchb-pro/tempjs">documentation</a> for the full version</p>
<p>If you are on mobile you can see the editor below otherwise on the left</p>
<p>It remain {%= todos.length %} items in my todo list:</p>
<ul>
    {% for(const todo of todos) { %}
        <li>{%= todo %}</li>
    {% } %}
</ul>
`;
const defaultDatas = {
  greeting: "Welcome to the live demo of tempjs!",
  todos: ["Understand tempjs", "Learn typescript", "Make a cake"],
};
const defaultRender = tempjs.compile(defaultTemplate, defaultDatas);

editor.value = defaultTemplate;
data.value = JSON.stringify(defaultDatas, undefined, 4);
iframe.srcdoc = defaultRender;

function updateView() {
  try {
    const res = tempjs.compile(
      editorArea.getValue(),
      JSON.parse(dataArea.getValue())
    );
    iframe.srcdoc = res;
  } catch (e) {
    iframe.srcdoc = `
    <h1>Error while compiling the template</h1>
    <pre>${e.message}</pre>
    `;
  }
}

const editorArea = CodeMirror.fromTextArea(editor, {
  mode: "htmlmixed",
  lineNumbers: true,
});
const dataArea = CodeMirror.fromTextArea(data, {
  mode: "javascript",
  lineNumbers: true,
});

dataArea.on("change", updateView);
editorArea.on("change", updateView);

const areas = document.querySelectorAll(".cm-s-default");
areas[0].style.flex = "1 1";
areas[1].style.height = "15rem";
