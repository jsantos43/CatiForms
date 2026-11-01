import { Router } from "express";
import Controller from "../controllers/User.js";

const router = Router();

router
  .get(
    "/user",
    Controller.readAll
  )
  .get(
    "/user/:id",
    Controller.readById
  )
  .post(
    "/user",
    Controller.create
  )
  .put(
    "/user",
    Controller.update
  )
  .delete(
    "/user",
    Controller.delete
  )

export default router;