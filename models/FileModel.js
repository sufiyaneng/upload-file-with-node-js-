import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const FileModel = mongoose.model('File', FileSchema);

export default FileModel;