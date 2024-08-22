declare module 'swagger-jsdoc' {
  const swaggerJsDoc: (options: any) => any;
  export default swaggerJsDoc;
}

import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
  interface Request {
    user?: string | JwtPayload;
  }
}