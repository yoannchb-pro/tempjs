(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.tempjs = factory());
})(this, (function () { 'use strict';

  function tempjs(template, data, opts = { openDelimiter: "{{", closeDelimiter: "}}" }) {
      const delimiterRegex = new RegExp(opts.openDelimiter + "([\\s\\S]*?)" + opts.closeDelimiter, "gi");
      const result = [];
      const templateText = template.split(new RegExp(opts.openDelimiter + "[\\s\\S]*?" + opts.closeDelimiter, "gi"));
      let index = 0;
      let match;
      while ((match = delimiterRegex.exec(template)) !== null) {
          const jsInstruction = match[1];
          const text = JSON.stringify(templateText[index]);
          result.push(`${text} + ((function(){ ${jsInstruction} })() ?? "")`);
          ++index;
      }
      const code = "return " + result.join(" + ");
      return new Function(...Object.keys(data), code).apply(null, Object.values(data));
  }

  return tempjs;

}));
//# sourceMappingURL=index.js.map
