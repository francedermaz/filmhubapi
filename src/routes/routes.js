import express from "express";
import {
  getMovies,
  saveFavorite,
  getFavorites,
  getHealtz,
  getMovieById,
} from "../controllers/movieController.js";

const router = express.Router();

router.get("/api/healtz", getHealtz);
router.get("/api/movies", getMovies);
router.post("/api/favorites", saveFavorite);
router.get("/api/favorites", getFavorites);
router.get("/api/movies/:id", getMovieById);

export default router;
