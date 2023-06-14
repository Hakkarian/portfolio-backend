import express from "express";
import { commentCtrl } from "../controllers";
import middlewares from "../middlewares";

const router = express.Router();

router.get('/:projectId/comments', middlewares.authenticate, commentCtrl.getAllComments);
router.post(
  "/:projectId/comments",
  middlewares.authenticate,
  commentCtrl.addComment
);
router.patch(
  "/:projectId/comments/:commentId",
  middlewares.authenticate,
  commentCtrl.updateComment
);
router.delete(
  "/:projectId/comments/:commentId",
  middlewares.authenticate,
  commentCtrl.deleteComment
);

export default router;