//project's blueprint

import mongoose from "mongoose";

export interface ProjectType extends Document {
  title: string;
  description: string;
  image: { url: string; id: string };
  likes: number;
  dislikes: number;
  liked: string[];
  disliked: string[];
  createdBy: mongoose.Schema.Types.ObjectId;
}

const projectSchema = new mongoose.Schema<ProjectType>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      id: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    liked: [
      { type: String }
    ],
    disliked: [
      { type: String }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false }
);


const Project = mongoose.model('Project', projectSchema);

export default Project;