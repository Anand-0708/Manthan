import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/papers";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    _req,
    _file,
    cb
  ) => {
    cb(null, uploadDir);
  },

  filename: (
    _req,
    file,
    cb
  ) => {
    const uniqueName =
      `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

export const paperUpload =
  multer({
    storage,

    limits: {
      fileSize:
        20 * 1024 * 1024,
    },

    fileFilter: (
      _req,
      file,
      cb
    ) => {
      const ext =
        path.extname(
          file.originalname
        );

      if (
        ext !== ".pdf"
      ) {
        return cb(
          new Error(
            "Only PDF files are allowed."
          )
        );
      }

      cb(
        null,
        true
      );
    },
  });