const express = require("express");
const app = express();
app.use(express.json());
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
const path = require("path");
let dataBase = null;
const initDbAndServer = async () => {
  const dbPath = path.join(__dirname, "/moviesData.db");
  try {
    dataBase = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The server has started @ 3000 ");
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

initDbAndServer();

const convertMovieName = (each) => {
  return {
    movieName: each.movie_name,
  };
};

//Get All Movies
app.get("/movies/", async (request, response) => {
  const fetchMovies = `select movie_name from movie;`;
  let res = await dataBase.all(fetchMovies);
  response.send(res.map((each) => convertMovieName(each)));
});

//Add a movie
app.post("/movies/", async (request, response) => {
  let { directorId, movieName, leadActor } = request.body;
  const addMovies = `insert into movie(director_id,movie_name,lead_actor) values(${directorId},'${movieName}','${leadActor}')`;
  let res = await dataBase.run(addMovies);
  response.send("Movie Successfully Added");
  console.log(request.body);
  console.log(res);
});

const convertMovieObj = (obj) => {
  return {
    movieId: obj.movie_name,
    directorId: obj.director_id,
    movieName: obj.movie_name,
    leadActor: obj.lead_actor,
  };
};

//Get particular movie
app.get("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;
  let fetchMovie = `select * from movie where movie_id = ${movieId};`;
  let res = await dataBase.get(fetchMovie);
  response.send(convertMovieObj(res));
});

//Update movie
app.put("/movies/:movieId", async (request, response) => {
  let { movieId } = request.params;
  let movieData = request.body;
  let { directorId, movieName, leadActor } = movieData;
  const updateMovies = `
  update movie set 
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  where movie_id = ${movieId};
  `;
  let res = await dataBase.run(updateMovies);

  console.log(res);
  response.send("Movie Successfully Updated");

  console.log(res);
});

//Delete a movie
app.delete("/movies/:movieId", async (response, request) => {
  let { movieId } = request.params;
  let deleteQuery = `delete from movie where movie_id = ${movieId};`;
  let res = await database.run(deleteQuery);
  response.send("Movie Removed");
});

const convertDirectorObj = (obj) => {
  return {
    directorId: obj.director_id,
    directorName: obj.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const fetchDirectors = `select * from director;`;
  let res = await dataBase.all(fetchDirectors);
  let out = res.map((each) => convertDirectorObj(each));
  response.send(out);
});

module.exports = app;
