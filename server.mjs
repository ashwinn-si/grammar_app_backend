import express from 'express'
import env from 'dotenv';
import { connectionDB } from "./src/config/dbConnect.mjs"
import { createDefaultUser, createTableDB } from './src/config/dbHelper.mjs';
env.config();

const app = express();
const PORT = parseInt(process.env.PORT) || 50000


app.listen(PORT, async () => {
  console.log(`PORT RUNNING IN PORT ${PORT}`);
  await connectionDB();
  await createTableDB();
  await createDefaultUser();
})