(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tempjs = factory());
})(this, (function () { 'use strict';

  const defaultOptions = {
      openDelimiter: "{{",
      closeDelimiter: "}}",
  };
  const defaultPlugins = [
      {
          name: "return",
          delimiter: "=",
          fn: function (content) {
              return "return " + content;
          },
      },
      {
          name: "comment",
          delimiter: "#",
          fn: function (content) {
              return "/*" + content + "*/";
          },
      },
  ];
  function tempjs(template, data, opts = defaultOptions) {
      var _a;
      //custom plugin to add fatest return
      opts.plugins = ((_a = opts.plugins) !== null && _a !== void 0 ? _a : []).concat(defaultPlugins);
      const delimiterRegex = new RegExp(opts.openDelimiter + "([\\s\\S]*?)" + opts.closeDelimiter, "gi");
      const result = [];
      const templateText = template.split(new RegExp(opts.openDelimiter + "[\\s\\S]*?" + opts.closeDelimiter, "gi"));
      let match;
      while ((match = delimiterRegex.exec(template)) !== null) {
          const jsInstruction = match[1];
          const text = JSON.stringify(templateText.shift());
          let finalJsInstruction = jsInstruction;
          const customPlugin = opts.plugins.find((plugin) => jsInstruction.startsWith(plugin.delimiter));
          if (customPlugin) {
              finalJsInstruction = customPlugin.fn(jsInstruction.replace(customPlugin.delimiter, ""));
          }
          result.push((text ? text + "+" : "") + `((function(){ ${finalJsInstruction} })()??"")`);
      }
      const code = "return " +
          result.join(" + ") +
          (templateText.length > 0 ? "+" + JSON.stringify(templateText.shift()) : "");
      return new Function(...Object.keys(data), code).apply(null, Object.values(data));
  }

  return tempjs;

}));
//# sourceMappingURL=index.js.map
