import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Firebase Service Account Key
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Service account file not found:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("🔥 Firebase Initialized Successfully");

const app = express();
app.use(express.json());
app.use(cors());

// Endpoint to send notification
app.post("/send", async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ error: "Missing fcmToken" });
    }

    const message = {
      notification: {
        title: "User Notification",
        body: "This is a Test Notification",
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
