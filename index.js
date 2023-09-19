// server.js
const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage })

const app = express()
app.use(cors())

const port = 3000

app.use((req, res, next) => {
  req.on('close', () => {
    // This will run when the client disconnects.
    console.log('abort', req.destroyed)
    if (!res.writableEnded && req.destroyed) {
      // If the response hasn't been sent yet, we consider it as an abort.
      req.clientAborted = true
    }
  })
  next()
})

app.post('/upload', upload.single('test'), (req, res) => {
  if (req.clientAborted) {
    console.log('Upload was cancelled')

    // สำหรับลบ file หาก upload เสร็จไปแล้ว
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path)
    }
    return res.status(400).send('Upload was cancelled')
  }
  res.send(req.file)

})

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
