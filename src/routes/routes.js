import express from "express";
import {
  getMovies,
  saveFavorite,
  getFavorites,
  getHealtz,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/api/healtz", getHealtz);
router.get("/api/movies", getMovies);
router.post("/api/favorites", saveFavorite);
router.get("/api/favorites", getFavorites);

export default router;
