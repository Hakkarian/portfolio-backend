import express from 'express';
import middlewares from '../middlewares';

import { projectCtrl } from '../controllers';
import { upload } from '../helpers/multerPhoto';

const router = express.Router();

router.get("/", projectCtrl.getAllProjects)
router.post("/", middlewares.authenticate, upload.single('image'), projectCtrl.addProject);
router.patch(
  "/:projectId",
  middlewares.authenticate,
  middlewares.isAdmin,
  upload.single("image"),
  projectCtrl.updateProject
);
router.delete(
  "/:projectId",
  middlewares.authenticate,
  middlewares.isAdmin,
  projectCtrl.deleteProject
);
router.put("/:projectId", middlewares.authenticate, projectCtrl.projectLike);
router.put("/:projectId", middlewares.authenticate, projectCtrl.projectDislike);

export default router;
