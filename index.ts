function tempjs(template: string, data: Record<string, unknown>): string {
  const delimiterRegex = /\{\{([\s\S]*?)\}\}/gi;

  const result: string[] = [];

  const templateText = template.split(/\{\{[\s\S]*?\}\}/gi);

  let index = 0;
  let match: RegExpExecArray;
  while ((match = delimiterRegex.exec(template)) !== null) {
    const jsInstruction = match[1];
    const text = JSON.stringify(templateText[index]);
    result.push(`${text} + ((function(){ ${jsInstruction} })() ?? "")`);
    ++index;
  }

  const code = "return " + result.join(" + ");
  return new Function(...Object.keys(data), code).apply(
    null,
    Object.values(data)
  );
}

export default tempjs;
