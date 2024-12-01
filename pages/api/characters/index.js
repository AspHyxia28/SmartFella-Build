import fs from "fs";
import path from "path";
import multer from "multer";
import pool from "../../../lib/db";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for multer
  },
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const [rows] = await pool.query("SELECT * FROM playable_characters");
        res.status(200).json(rows);
      } catch (error) {
        console.error("GET Error:", error.message);
        res.status(500).json({ message: "Error fetching characters", error: error.message });
      }
      break;

    case "POST":
      upload.single("picture")(req, {}, async (err) => {
        if (err) return res.status(500).json({ message: "File upload error" });

        const { id, name, rarity, path, combat_type } = req.body;
        const picture = req.file ? `/uploads/${req.file.filename}` : null;

        try {
          await pool.query(
            "INSERT INTO playable_characters (id, name, rarity, path, combat_type, picture) VALUES (?, ?, ?, ?, ?, ?)",
            [id, name, rarity, path, combat_type, picture]
          );
          res.status(201).json({ message: "Character created successfully" });
        } catch (error) {
          console.error("POST Error:", error.message);
          res.status(500).json({ message: "Database error", error: error.message });
        }
      });
      break;

      case "PUT":
        upload.single("picture")(req, {}, async (err) => {
          if (err) return res.status(500).json({ message: "File upload error" });
      
          const { id, name, rarity, path, combat_type } = req.body;
      
          try {
            // Fetch existing character data
            const [existingCharacter] = await pool.query(
              "SELECT * FROM playable_characters WHERE id = ?",
              [id]
            );
      
            if (existingCharacter.length === 0) {
              return res.status(404).json({ message: "Character not found" });
            }
      
            // Use the previous image path if no new image is uploaded
            const previousPicture = existingCharacter[0].picture;
            let picture;

            if (req.file) {
              picture = `/uploads/${req.file.filename}`; // Use the new file path if a file is uploaded
            } else {
              picture = previousPicture; // Retain the previous image path if no new file is uploaded
            }
      
            // Update query and parameters
            const updateQuery =
              "UPDATE playable_characters SET name = ?, rarity = ?, path = ?, combat_type = ?, picture = ? WHERE id = ?";
            const updateParams = [name, rarity, path, combat_type, picture, id];
      
            // Update the database
            await pool.query(updateQuery, updateParams);
            res.status(200).json({ message: "Character updated successfully" });
          } catch (error) {
            console.error("PUT Error:", error.message);
            res.status(500).json({ message: "Database error", error: error.message });
          }
        });
        break;      

    case "DELETE":
      try {
        const { id } = req.query;

        // Fetch the character to get the picture path
        const [existingCharacter] = await pool.query("SELECT * FROM playable_characters WHERE id = ?", [id]);
        if (existingCharacter.length === 0) {
          return res.status(404).json({ message: "Character not found" });
        }

        const { picture } = existingCharacter[0];

        // Remove the file from the server
        if (picture) {
          const filePath = path.join(process.cwd(), "public", picture);
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("File deletion error:", err.message);
            } else {
              console.log(`File ${filePath} deleted successfully`);
            }
          });
        }

        // Delete the character from the database
        await pool.query("DELETE FROM playable_characters WHERE id = ?", [id]);
        res.status(200).json({ message: "Character and associated file deleted successfully" });
      } catch (error) {
        console.error("DELETE Error:", error.message);
        res.status(500).json({ message: "Database error", error: error.message });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}