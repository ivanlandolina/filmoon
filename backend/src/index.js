import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import moviesRouter from "./routes/movies.routes.js";

const app = express();

const origins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((s) => s.trim())
  : ["*"];

app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Healthcheck
app.get("/", (_req, res) => res.status(200).send("OK"));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/movies", moviesRouter);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Errore interno" });
});

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connesso");

    app.listen(PORT, () => {
      console.log(`Server on :${PORT}`);
    });
  } catch (e) {
    console.error("Errore connessione MongoDB", e);
    process.exit(1);
  }
}

start();
