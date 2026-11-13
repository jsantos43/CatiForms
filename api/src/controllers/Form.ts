import type { NextFunction, Request, Response } from 'express';
import { Unauthorized } from '../errors/index.js';
import type { CreateFormData, FormIdParams, UpdateFormData } from '../schemas/Form.js';
import Service from '../services/Form.js';

class Form {
  static async readOwn(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new Unauthorized();

      const forms = await Service.readByAuthor(req.user.id);

      return res.status(200).json({ success: true, forms });
    } catch (err) {
      return next(err);
    }
  }

  static async readAll(req: Request, res: Response, next: NextFunction) {
    try {
      const forms = await Service.readAll();

      return res.status(200).json({ success: true, forms });
    } catch (err) {
      return next(err);
    }
  }

  static async readById(req: Request<FormIdParams>, res: Response, next: NextFunction) {
    try {
      const form = await Service.readById(req.params.id);

      return res.status(200).json({ success: true, form });
    } catch (err) {
      return next(err);
    }
  }

  static async create(
    req: Request<Record<string, string>, unknown, CreateFormData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user) throw new Unauthorized();

      const form = await Service.create(req.user.id, req.body);

      return res.status(201).json({ success: true, form });
    } catch (err) {
      return next(err);
    }
  }

  static async update(
    req: Request<FormIdParams, unknown, UpdateFormData>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const form = await Service.update(req.params.id, req.body);

      return res.status(200).json({ success: true, form });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req: Request<FormIdParams>, res: Response, next: NextFunction) {
    try {
      const form = await Service.delete(req.params.id);

      return res.status(200).json({ success: true, form });
    } catch (err) {
      return next(err);
    }
  }
}

export default Form;
