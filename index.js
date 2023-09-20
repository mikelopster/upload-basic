// server.js
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null, fileName)
    // request aborted = ลบไฟล์
    req.on('aborted', () => {
      const fullPath = path.join('uploads', fileName)
      console.log('fullPath', fullPath)
      fs.unlinkSync(fullPath)
    })
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/plain') { // Check if the file's mimetype is text/plain
    cb(null, true)  // Accept the file
  } else {
    cb(new Error('Only .txt files are allowed!'), false) // Reject the file
  }
}

const upload = multer({
  storage: storage
})

const app = express()
app.use(cors())

const port = 3000

app.post('/upload', (req, res) => {
  upload.single('test')(req, res, (err) => {
    if (err) {
      console.log('error', err)
      return res.status(400).json({ message: 'upload fail', error: err.message })
    }
    res.send(req.file)
  })
})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
