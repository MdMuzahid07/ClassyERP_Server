// import { NextFunction, Request, Response } from "express";
// import { ZodObject } from "zod";

// const requestValidator = (schema: ZodObject<any, any>) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             // if the validation is OK, then next function will called
//             await schema.parseAsync({
//                 body: req.body,
//                 cookies: req.cookies,
//                 query: req.query,
//                 params: req.params,
//             });
//             next();
//         } catch (error) {
//             next(error);
//         }
//     };
// };

// export default requestValidator;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

const requestValidator = (schema: ZodObject<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try parsing as wrapped object first (schemas that expect { body, cookies, query, params })
      try {
        await schema.parseAsync({
          body: req.body,
          cookies: req.cookies,
          query: req.query,
          params: req.params,
        });
      } catch (err) {
        // Fallback: try parsing the raw body (schemas that describe body directly)
        await schema.parseAsync(req.body);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requestValidator;
