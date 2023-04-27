const editor = document.querySelector("#editor");
const data = document.querySelector("#data");
const iframe = document.querySelector("#view");

const defaultTemplate = "<h1>{%= gretting %}</h1>";
const defaultDatas = { gretting: "Hello World!" };
const defaultRender = tempjs.compile(defaultTemplate, defaultDatas);

editor.value = defaultTemplate;
data.value = JSON.stringify(defaultDatas, undefined, 4);
iframe.srcdoc = defaultRender;
