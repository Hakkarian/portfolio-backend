import { Request, Response, NextFunction, RequestHandler } from 'express';

// surrounds the function by try&catch block in order to handle possible errors

const catchAsync = (func: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        return func(req, res, next);
    } catch (error) {
        next(error)
    }
}


export default catchAsync;