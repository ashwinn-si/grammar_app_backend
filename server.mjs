import express from 'express'
import env from 'dotenv';
import { connectionDB } from "./src/config/dbConnect.mjs"
import { createDefaultUser, createTableDB } from './src/config/dbHelper.mjs';
import appRouter from "./src/index.mjs"
import morgan from 'morgan';
import helmet from 'helmet';
env.config();

const app = express();
const PORT = parseInt(process.env.PORT) || 50000

app.use(morgan("dev"))
app.use(helmet())
app.use(express.json())

app.use("/api", appRouter)

app.listen(PORT, async () => {
  console.log(`PORT RUNNING IN PORT ${PORT}`);
  await connectionDB();
  await createTableDB();
  await createDefaultUser();
})