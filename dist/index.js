!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).tempjs=e()}(this,(function(){"use strict";const t=[{name:"return",description:"Allow user to add variable to the output",delimiter:"=",fn:function(t){return"$__output += "+t}},{name:"comment",description:"Shortcut to turn some code into a comment",delimiter:"#",fn:function(t){return"/*"+t+"*/"}},{name:"cancel",description:"Output the instruction as text with delimiters",delimiter:"%",fn:function(t,e){return`$__output += "${e.openDelimiter}${t}${e.closeDelimiter}"`}}],e={openDelimiter:"{%",closeDelimiter:"%}",minimified:!0},n="undefined"==typeof window,i=n&&require("fs"),o=n&&require("path");let u="";function l(t,e,l){if(!n)throw new Error("Including file is only available in nodejs environement");(null==l?void 0:l.root)&&(t=o.resolve(l.root,t));const r=i.readFileSync(o.resolve(u,t),"utf-8");return u||(u=o.dirname(t)),a(r,e,l)}const r=[{name:"include",description:"Allow to render other file into the template",fn:l}],s=async function(){}.constructor;function c(t){return t.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function d(n,i,o){var u,l,d,a,p,m,f;i=null!=i?i:{},o=null!=o?o:{},(o=Object.assign({},e,o)).delimiters=(null!==(u=o.delimiters)&&void 0!==u?u:[]).concat(t),o.plugins=(null!==(l=o.plugins)&&void 0!==l?l:[]).concat(r);const g=["'use strict'","let $__output=''"],h=new RegExp(String.raw`(\n?[\s\t]*${c(o.openDelimiter)}_?[\s\S]*?_?${c(o.closeDelimiter)}[\s\t]*\n?)`,"gi");for(const t of n.split(h)){if(!h.test(t)){g.push(`$__output += ${JSON.stringify(t)}`);continue}const e=null===(d=t.match(/^\n?[\s\t]*/g))||void 0===d?void 0:d[0],n=null===(a=t.match(/[\s\t]*\n?$/g))||void 0===a?void 0:a[0];let i=t.substring(o.openDelimiter.length+(null!==(p=e.length)&&void 0!==p?p:0),t.length-(o.closeDelimiter.length+(null!==(m=n.length)&&void 0!==m?m:0)));const u=i.startsWith("_"),l=i.endsWith("_");u?i=i.substring(1):g.push(`$__output += ${JSON.stringify(e)}`),l&&(i=i.substring(0,i.length-1));const r=o.delimiters.find((t=>i.startsWith(t.delimiter)));r&&(i=r.fn(i.substring(1),o)),console.log(i,h),g.push(i),l||g.push(`$__output += ${JSON.stringify(n)}`)}g.push("return $__output");const $=g.join(o.minimified?";":";\n"),_=o.async?s:Function,v=Object.keys(i),b=Object.values(i),y=o.plugins.map((t=>t.name)),w=o.plugins.map((t=>t.fn));return{template:n,data:i,options:o,generatedFunction:_(...v,...y,$).bind(null!==(f=o.context)&&void 0!==f?f:null,...b,...w),generatedCode:$,dataListName:v,dataListValue:b,pluginsName:y,pluginsFunctions:w}}function a(t,e,n){return d(t,e,n).generatedFunction()}return{compile:a,compileFromFile:l,createFunction:function(t,e,n){return d(t,e,n).generatedFunction},debug:d}}));
//# sourceMappingURL=index.js.map
