/**
 * Resolve the full path for a file from a path and a file
 * @param path
 * @param file
 * @returns
 */
function resolvePath(path: string, file: string): string {
  const splittedPath = document.location.pathname.split("/");
  if (splittedPath[splittedPath.length - 1]?.includes(".")) splittedPath.pop();
  const absolutePath = splittedPath.join("/");

  path = path.replace(/^\.?\//g, "/").replace(/\/$/g, "");
  file = file.replace(/^\.?\//g, "").replace(/\/$/g, "");
  return `${absolutePath}${path ? "/" + path : ""}/${file}`;
}

/**
 * Resolve dirname of a path
 * @param path
 * @returns
 */
function resolveDirname(path: string): string {
  const separator = "/";
  const parts = path.split(separator);
  if (parts.length === 1) {
    return ".";
  }
  parts.pop();
  if (parts.length === 1 && parts[0] === "") {
    return separator;
  }
  return parts.join(separator);
}

/**
 * Polyfill of fs.readFile for browser
 * @param file
 * @param format
 * @param callback
 */
async function readFile(file: string) {
  return (await fetch(file)).text();
}

/**
 * Escape HTML XSS injection from a string
 * @param obj The data we want to escape
 * @returns
 */
function escapeHTML(obj: unknown) {
  if (typeof obj !== "string") return obj;

  return obj.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&#39;";
      case '"':
        return "&quot;";
      default:
        return match;
    }
  });
}

export { resolvePath, resolveDirname, readFile, escapeHTML };
