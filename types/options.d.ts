type Options = {
  openDelimiter?: string;
  closeDelimiter?: string;
  context?: unknown;
  delimiters?: {
    name: string;
    delimiter: string;
    fn: (content: string) => string;
  }[];
  plugins?: { name: string; fn: Function }[];
};

export default Options;
