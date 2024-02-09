import express from 'express';
import middlewares from '../middlewares';

import { projectCtrl } from '../controllers';
import { upload } from '../helpers/multerPhoto';

const router = express.Router();

// paths for dealing with projects: addition, deletion, full and partial update

router.get("/all", projectCtrl.getAllProjects);
router.get("/", projectCtrl.getPaginatedProjects);
router.get("/liked", middlewares.authenticate, projectCtrl.getLikedProjects);
router.post("/", middlewares.authenticate, upload.single('image'), projectCtrl.addProject);
router.patch(
  "/:projectId",
  middlewares.authenticate,
  upload.single("image"),
  projectCtrl.updateProject
);
router.delete(
  "/:projectId",
  middlewares.authenticate,
  projectCtrl.deleteProject
);


router.put("/:projectId/like", middlewares.authenticate, projectCtrl.projectLike);
router.put("/:projectId/dislike", middlewares.authenticate, projectCtrl.projectDislike);

export default router;
