import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getNoticesFromElectre } from "./electre.mjs";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

const allowedOriginsStr = process.env.ALLOWED_ORIGINS_ARRAY || "[]"

const allowedOriginsJSON = JSON.parse(allowedOriginsStr);

// Define an array of allowed origins
const allowedOrigins = Array.isArray(allowedOriginsJSON) ? allowedOriginsJSON : [];

console.log(allowedOrigins)

// const allowedOrigins = [
//   'http://localhost:8080',
//   'https://studio-paon.scenari.eu',
//   'https://studio-paon-int.scenari.ovh',
// ];

// Enable CORS for all routes with allowed origins
app.use(cors({
  origin: (origin, callback) => {
    // Check if the request's origin is in the list of allowed origins
    const isAllowed = allowedOrigins.includes(origin);
    callback(null, isAllowed);
  }
}));

// Endpoint to get notices from Electre using POST request
app.post('/getNoticesFromElectre', async (req, res) => {
  try {
    const { eanArray } = req.body;

    // Check if eanArray exists in the request and is an array
    if (!Array.isArray(eanArray)) {
      return res.status(400).json({ error: 'Invalid input. eanArray should be an array.' });
    }

    const notices = await getNoticesFromElectre(eanArray);
    res.json(notices);
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve notices from Electre.' });
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
