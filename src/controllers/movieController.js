import prisma from "../../prisma/prismaClient.js";
import axios from "axios";

const API_KEY = process.env.API_KEY;

const mapMovieResponse = (movie, isFavorite = false) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
  poster_path: movie.poster_path,
  isFavorite: isFavorite,
});

export const getMovies = async (req, res) => {
  const language = req.query.language || "en-US";
  const region = req.query.region || "US";

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular`,
      {
        params: {
          api_key: API_KEY,
          language: language,
          region: region,
        },
      }
    );

    const favoriteMovies = await prisma.favorite.findMany({
      select: {
        movieId: true,
      },
    });

    const favoriteMovieIds = new Set(favoriteMovies.map((fav) => fav.movieId));

    const mappedMovies = response.data.results
      .filter((movie) => !movie.adult)
      .map((movie) => mapMovieResponse(movie, favoriteMovieIds.has(movie.id)));

    res.json(mappedMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener películas" });
  }
};

export const getMovieById = async (req, res) => {
  const { id } = req.params;
  const language = req.query.language || "en-US";
  const region = req.query.region || "US";

  try {
    const movieId = parseInt(id, 10);

    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        params: {
          api_key: API_KEY,
          language: language,
          region: region,
        },
      }
    );

    if (movieResponse.status !== 200) {
      return res.status(404).json({ error: "Película no encontrada en TMDB" });
    }
    const favoriteMovie = await prisma.favorite.findFirst({
      where: { movieId: movieId },
    });

    const isFavorite = !!favoriteMovie;

    const mappedMovie = mapMovieResponse(movieResponse.data, isFavorite);
    res.json(mappedMovie);
  } catch (error) {
    console.error(error);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "Película no encontrada en TMDB" });
    }

    res.status(500).json({ error: "Error al obtener la película" });
  }
};

export const saveFavorite = async (req, res) => {
  const { movieId } = req.body;
  try {
    const existingFavorite = await prisma.favorite.findFirst({
      where: { movieId: movieId },
    });

    if (existingFavorite) {
      return res
        .status(400)
        .json({ error: "La película ya está en la lista de favoritas" });
    }

    const favorite = await prisma.favorite.create({
      data: {
        movieId,
      },
    });
    res.json(favorite);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar favorita" });
  }
};

export const getFavorites = async (req, res) => {
  const language = req.query.language || "en-US";
  const region = req.query.region || "US";

  try {
    const favorites = await prisma.favorite.findMany();

    const favoriteMovies = [];

    for (const favorite of favorites) {
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${favorite.movieId}`,
        {
          params: {
            api_key: API_KEY,
            language: language,
            region: region,
          },
        }
      );

      favoriteMovies.push(mapMovieResponse(movieResponse.data, true));
    }

    res.json(favoriteMovies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener favoritas" });
  }
};

export const getHealtz = (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is running" });
};
