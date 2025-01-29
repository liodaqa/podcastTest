declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Define and extend the `globalThis` object
declare global {
  interface ImportMeta {
    env: {
      VITE_API_BASE_URL: string;
    };
  }

  // Augment globalThis for Jest and testing
  namespace NodeJS {
    interface Global {
      importMeta: ImportMeta;
    }
  }
}
declare module 'async-retry' {
  export type Options = {
    retries?: number;
    factor?: number;
    minTimeout?: number;
    maxTimeout?: number;
  };

  export default function retry<T>(
    fn: (iteration: number) => Promise<T>,
    opts?: Options
  ): Promise<T>;
}
declare module 'crypto-js' {
  const content: any;
  export default content;
}
import { IncomingMessage, ServerResponse } from 'http';

// Define `VercelRequest` and `VercelResponse` manually
export interface VercelRequest extends IncomingMessage {
  query: { [key: string]: string | undefined };
  cookies: { [key: string]: string };
  body: any;
}

export interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => this;
  json: (body: any) => void;
}

// declare module 'node-fetch' {
//   import { RequestInit, Response, Body } from 'node-fetch';
//   export default function fetch(
//     url: string,
//     init?: RequestInit
//   ): Promise<Response>;
//   export { RequestInit, Response, Body };
// }

// declare module '@vercel/node' {
//   import { IncomingMessage, ServerResponse } from 'http';

//   export interface VercelRequest extends IncomingMessage {
//     query: { [key: string]: string | undefined };
//     cookies: { [key: string]: string };
//     body: any;
//   }

//   export type VercelResponse = ServerResponse;
// }
