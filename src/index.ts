import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import routor from "./routes/router";
dotenv.config();


const MONGODB_URI =
  "mongodb+srv://gokul:UPw3fCb6kDmF5CsE@cluster0.klfb9oe.mongodb.net/ott?retryWrites=true&w=majority";
mongoose.connect(MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

dotenv.config();
const connectToMongoDB = mongoose.connection;

connectToMongoDB.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

connectToMongoDB.once("open", () => {
  console.log("Connected to MongoDB");
});
const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api", routor);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
