# API de FilmHub

## Descripción

La API de FilmHub proporciona una interfaz para gestionar datos de películas utilizando Prisma como ORM, PostgreSQL como base de datos y The Movie Database (TMDb) como fuente de datos de películas. Proyecto desarrollado para la carrera DSW - IES.

## Tecnologías Utilizadas

- **Prisma:** ORM para interactuar con la base de datos.
- **PostgreSQL:** Sistema de gestión de bases de datos.
- **The Movie Database (TMDb):** API externa para obtener información actualizada sobre películas.

## Métodos Disponibles

- `GET /api/movies`: Obtiene una lista de películas populares.
- `POST /api/favorites`: Marca una película como favorita.
- `GET /api/favorites`: Obtiene la lista de películas favoritas del usuario.
