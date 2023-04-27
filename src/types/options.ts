type Options = {
  openDelimiter?: string;
  closeDelimiter?: string;
  context?: unknown;
  async?: boolean;
  minimified?: boolean;
  delimiters?: {
    name: string;
    description: string;
    delimiter: string;
    fn: (content: string, options: Options) => string;
  }[];
  plugins?: { name: string; description: string; fn: Function }[];
};

export default Options;
