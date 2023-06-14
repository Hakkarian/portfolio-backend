import {Request, Response, NextFunction, RequestHandler} from 'express';

const catchAsync = (func: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        return func(req, res, next);
    } catch (error) {
        next(error)
    }
}


export default catchAsync;