import mongoose from "mongoose";

export interface ProjectType extends Document {
  title: string;
  description: string;
  image: { url: string; id: string };
  likes: number;
  dislikes: number;
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
    },
    dislikes: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { versionKey: false }
);


const Project = mongoose.model('Project', projectSchema);

export default Project;