import saveUploadedFile from "../utils/fileUpload.js";
import FileModel from "../models/FileModel.js"; // Your MongoDB model
import fs from "fs"
import path from "path"


const uploadFile = (req, res) => {
    console.log(req.body)

  saveUploadedFile(req, async (err, filePath) => {
    console.log(filePath)

    if (err) {
      return res.status(400).json({ message: 'Error handling file upload', error: err.message });
    }

    try {
      const blobName = path.basename(filePath);

      // Read the file data
      const fileData = fs.readFileSync(filePath);
      console.log(fileData,"file data ")

      // Save file data to MongoDB
      const fileRecord = new FileModel({
        name: blobName,
        data: fileData,
        contentType: req.headers['content-type'], // Optionally store the content type
      });

      await fileRecord.save();

      // Clean up locally saved file
      fs.unlinkSync(filePath);

      res.status(200).json({ message: 'File uploaded successfully', fileId: fileRecord._id });
    } catch (error) {
      res.status(500).json({ message: 'Error saving to database', error: error.message });
    }
  });
};

export default   uploadFile ;
