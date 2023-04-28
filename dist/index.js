!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).tempjs=t()}(this,(function(){"use strict";const e=[{name:"return",description:"Allow user to add variable to the output",delimiter:"=",fn:function(e){return"$__output += "+e}},{name:"comment",description:"Shortcut to turn some code into a comment",delimiter:"#",fn:function(e){return"/*"+e+"*/"}},{name:"cancel",description:"Output the instruction as text with delimiters",delimiter:"%",fn:function(e,t){return`$__output += "${t.openDelimiter}${e}${t.closeDelimiter}"`}}],t={openDelimiter:"{%",closeDelimiter:"%}",minimified:!0},n="undefined"==typeof window,i=n&&require("fs"),o=n&&require("path");let r="";function u(e,t={},u={}){if(!n)throw new Error("Including file is only available in nodejs environement");u.root&&(e=o.resolve(u.root,e));const l=i.readFileSync(o.resolve(r,e),"utf-8");return r||(r=o.dirname(e)),a(l,t,u)}const l=[{name:"include",description:"Allow to render other file into the template",fn:u}],s=async function(){}.constructor;function c(e){return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function d(n,i={},o={}){var r,u,d,a,p,m,f;(o=Object.assign({},t,o)).delimiters=(null!==(r=o.delimiters)&&void 0!==r?r:[]).concat(e),o.plugins=(null!==(u=o.plugins)&&void 0!==u?u:[]).concat(l);const g=["let $__output=''"],h=new RegExp(String.raw`(\n?[\s\t]*${c(o.openDelimiter)}_?[\s\S]*?_?${c(o.closeDelimiter)}[\s\t]*\n?)`,"gi");for(const e of n.split(h)){if(!h.test(e)){g.push(`$__output += ${JSON.stringify(e)}`);continue}const t=null===(d=e.match(/^\n?[\s\t]*/g))||void 0===d?void 0:d[0],n=null===(a=e.match(/[\s\t]*\n?$/g))||void 0===a?void 0:a[0];let i=e.substring(o.openDelimiter.length+(null!==(p=t.length)&&void 0!==p?p:0),e.length-(o.closeDelimiter.length+(null!==(m=n.length)&&void 0!==m?m:0)));const r=i.startsWith("_"),u=i.endsWith("_");r?i=i.substring(1):g.push(`$__output += ${JSON.stringify(t)}`),u&&(i=i.substring(0,i.length-1));const l=o.delimiters.find((e=>i.startsWith(e.delimiter)));l&&(i=l.fn(i.substring(1),o)),console.log(i,h),g.push(i),u||g.push(`$__output += ${JSON.stringify(n)}`)}g.push("return $__output");const $=g.join(o.minimified?";":";\n"),_=o.async?s:Function,v=Object.keys(i),b=Object.values(i),y=o.plugins.map((e=>e.name)),w=o.plugins.map((e=>e.fn));return{template:n,data:i,options:o,generatedFunction:_(...v,...y,$).bind(null!==(f=o.context)&&void 0!==f?f:null,...b,...w),generatedCode:$,dataListName:v,dataListValue:b,pluginsName:y,pluginsFunctions:w}}function a(e,t={},n={}){return d(e,t,n).generatedFunction()}return{compile:a,compileFromFile:u,createFunction:function(e,t={},n={}){return d(e,t,n).generatedFunction},debug:d}}));
//# sourceMappingURL=index.js.map
