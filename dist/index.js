"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tempjs(template, data) {
    const delimiterRegex = /\{\{([\s\S]*?)\}\}/gi;
    const result = [];
    const templateText = template.split(/\{\{[\s\S]*?\}\}/gi);
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
exports.default = tempjs;
//# sourceMappingURL=index.js.map