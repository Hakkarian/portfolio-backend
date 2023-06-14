import express from 'express';
import middlewares from '../middlewares';

import { projectCtrl } from '../controllers';
import { upload } from '../helpers/multerPhoto';

const router = express.Router();

router.get("/", projectCtrl.getAllProjects)
router.post("/", upload.single('image'), projectCtrl.addProject);
router.patch("/:projectId", upload.single('image'), projectCtrl.updateProject);
router.delete("/:projectId", projectCtrl.deleteProject);

export default router;
