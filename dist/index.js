!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):(e="undefined"!=typeof globalThis?globalThis:e||self).tempjs=n()}(this,(function(){"use strict";const e={openDelimiter:"{{",closeDelimiter:"}}"},n=[{name:"return",delimiter:"=",fn:function(e){return"return "+e}},{name:"comment",delimiter:"#",fn:function(e){return"/*"+e+"*/"}}],i="undefined"==typeof window,t=i?require("fs"):{},l=i?require("path"):{};let o="";function r(e,n={},i={}){const r=t.readFileSync(l.resolve(o,e),"utf-8");return o||(o=l.dirname(e)),u(r,n,i)}const s=[{name:"include",fn:r}];function u(i,t={},l={}){var o,r,u;(l=Object.assign(e,l)).delimiters=(null!==(o=l.delimiters)&&void 0!==o?o:[]).concat(n),l.plugins=(null!==(r=l.plugins)&&void 0!==r?r:[]).concat(s);const c=new RegExp(l.openDelimiter+"([\\s\\S]*?)"+l.closeDelimiter,"gi"),f=[],m=i.split(new RegExp(l.openDelimiter+"[\\s\\S]*?"+l.closeDelimiter,"gi"));let d;for(;null!==(d=c.exec(i));){const e=d[1],n=JSON.stringify(m.shift());let i=e;const t=l.delimiters.find((n=>e.startsWith(n.delimiter)));t&&(i=t.fn(e.replace(t.delimiter,""))),f.push((n?n+"+":"")+`((function(){ ${i} })()??"")`)}const p="return "+f.join(" + ")+(m.length>0?"+"+JSON.stringify(m.shift()):"");return new Function(...Object.keys(t),...l.plugins.map((e=>e.name)),p).apply(null!==(u=l.context)&&void 0!==u?u:null,[...Object.values(t),...l.plugins.map((e=>e.fn))])}return{compile:u,compileFromFile:r}}));
//# sourceMappingURL=index.js.map
