const express = require("express");
const multer = require("multer");
const cors = require("cors");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

// Ensure folders exist
const uploadsDir = path.join(__dirname, "uploads");
const compressedDir = path.join(__dirname, "compressed");
["uploads", "compressed"].forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
});


// Multer setup
const upload = multer({ dest: uploadsDir + "/" });


// Serve sender and receiver UI
app.use("/sender", express.static("sender"));
app.use("/receiver", express.static("receiver"));



app.post("/upload", upload.single("audio"), (req, res) => {
const inputPath = req.file.path;
  const outputFilename = `${Date.now()}.mp3`;
  const outputPath = path.join(compressedDir, outputFilename);


  ffmpeg(inputPath)
    .audioBitrate('32k') // lower bitrate for less loss/better quality (was 64k)
    .audioFrequency(22050) // downsample for smaller size/low loss
    .save(outputPath)

    .on("end", () => {
      const originalSize = fs.statSync(inputPath).size;
      const compressedSize = fs.statSync(outputPath).size;

      // Store latest metadata
      const latestMeta = { name: outputFilename, originalSize, compressedSize, timestamp: Date.now() };
      fs.writeFileSync(path.join(compressedDir, 'latest.json'), JSON.stringify(latestMeta));

      res.json({
        message: "Compressed successfully",
        file: outputFilename,
        originalSize,
        compressedSize
      });


    })
    .on("error", (err) => {
      console.error(err);
      res.status(500).send("Compression error");
    });
});

// Send latest compressed audio
app.get("/audio", (req, res) => {
  const files = fs.readdirSync(compressedDir);
  if (!files.length) return res.status(404).send("No file");

  const latest = files.sort().reverse()[0];
  res.sendFile(path.join(compressedDir, latest));
});

// Get latest file details
app.get("/files", (req, res) => {
  const metaPath = path.join(compressedDir, 'latest.json');
  if (!fs.existsSync(metaPath)) return res.json({ error: "No files" });

  const meta = JSON.parse(fs.readFileSync(metaPath));
  res.json(meta);
});



app.listen(4000, () => console.log("Server running on port 4000"));

