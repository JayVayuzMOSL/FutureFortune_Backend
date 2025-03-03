import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import express from 'express';
import cors from 'cors';
import fs from 'fs';

// Load service account key
const serviceAccount = JSON.parse(fs.readFileSync('./src/futurefortunetasks-firebase-adminsdk-fbsvc-664ef0a5a8.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'futurefortunetasks'
});

const app = express();
app.use(express.json());
app.use(cors());

app.post("/send", async (req, res) => {
  const { fcmToken } = req.body;

  const message = {
    notification: {
      title: "Test Notification",
      body: "This is a test notification"
    },
    token: fcmToken,
  };

  try {
    const response = await getMessaging().send(message);
    res.status(200).json({ message: "Successfully sent", response });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server started on port 3000"));
