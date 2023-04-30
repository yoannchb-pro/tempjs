function errorToHTML(err) {
  return `
    <h1>Error while compiling the template</h1>
    <pre>${err.message}</pre>
    `;
}

async function init() {
  const editor = document.querySelector("#editor");
  const data = document.querySelector("#data");
  const iframe = document.querySelector("#view");

  const defaultTemplate = `<h1>{%@ await includeBrowser("./templates/header.html", { greeting }) %}</h1>
<p>It is a simplified version. See the <a target="_blank" href="https://github.com/yoannchb-pro/tempjs">documentation</a> for the full version.</p>
<p>If you are on mobile you can see the editor below otherwise on the left.</p>
<p>Use {%% javascript instruction %} inside the template.</p>
{%_# Below is just a simple example of a todo list %}
<p>It remain {%= todos.length %} items in my todo list:</p>
<ul>
    {% for(const todo of todos) { %}
        <li>{%= todo %}</li>
    {% } %}
</ul>`;
  const defaultDatas = {
    greeting: "Welcome to the live demo of tempjs!",
    todos: [
      "Understand tempjs",
      "Learn typescript",
      "Make a cake",
      "<script>alert('XSS injections are not working')</script>",
    ],
  };
  const defaultRender = await tempjs
    .compile(defaultTemplate, defaultDatas, {
      async: true,
    })
    .catch((err) => {
      return errorToHTML(err);
    });

  editor.value = defaultTemplate;
  data.value = JSON.stringify(defaultDatas, undefined, 4);
  iframe.srcdoc = defaultRender;

  async function updateView() {
    try {
      const res = await tempjs.compile(
        editorArea.getValue(),
        JSON.parse(dataArea.getValue()),
        { async: true }
      );
      iframe.srcdoc = res;
    } catch (err) {
      iframe.srcdoc = errorToHTML(err);
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
}

init();
