import type { NextFunction, Request, Response } from 'express';
import type { FormIdParams, FormSlugParams } from '../schemas/Form.js';
import type { CreateResponseData, ResponseIdParams } from '../schemas/Response.js';
import Service from '../services/Response.js';

class FormResponse {
  static async readAll(req: Request<FormIdParams>, res: Response, next: NextFunction) {
    try {
      const responses = await Service.readAll(req.params.id);

      return res.status(200).json({ success: true, responses });
    } catch (err) {
      return next(err);
    }
  }

  static async readById(req: Request<ResponseIdParams>, res: Response, next: NextFunction) {
    try {
      const response = await Service.readById(req.params.id, req.params.responseId);

      return res.status(200).json({ success: true, response });
    } catch (err) {
      return next(err);
    }
  }

  static async create(
    req: Request<FormSlugParams, unknown, CreateResponseData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await Service.create(req.params.slug, req.body);

      return res.status(201).json({ success: true, response });
    } catch (err) {
      return next(err);
    }
  }
}

export default FormResponse;
