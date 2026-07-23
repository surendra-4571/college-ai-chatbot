const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const UPLOAD_DIR = process.env.FILE_UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /javascript|json|python|java|cpp|c|text|plain|x-sh/;
    const allowedExtensions = /\.(js|json|py|java|cpp|c|txt|sh)$/i;

    if (allowedExtensions.test(path.extname(file.originalname)) || 
        allowedTypes.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only source code and text files allowed.'));
    }
  }
});

// In-memory file tracking
const fileMetadata = {};

// Upload file
const uploadFile = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileId = uuidv4();
    fileMetadata[fileId] = {
      id: fileId,
      originalName: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date()
    };

    res.json({
      message: 'File uploaded successfully',
      fileId,
      metadata: fileMetadata[fileId]
    });
  });
};

// Download file
const downloadFile = (req, res) => {
  try {
    const { fileId } = req.params;
    const metadata = fileMetadata[fileId];

    if (!metadata) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filepath = metadata.path;
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.download(filepath, metadata.originalName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete file
const deleteFile = (req, res) => {
  try {
    const { fileId } = req.params;
    const metadata = fileMetadata[fileId];

    if (!metadata) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filepath = metadata.path;
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    delete fileMetadata[fileId];

    res.json({
      message: 'File deleted successfully',
      fileId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// List files
const listFiles = (req, res) => {
  try {
    const files = Object.values(fileMetadata).map(meta => ({
      ...meta,
      sizeKB: (meta.size / 1024).toFixed(2)
    }));

    res.json({
      files,
      total: files.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  listFiles
};
