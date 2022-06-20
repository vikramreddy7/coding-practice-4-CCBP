const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializationDbAndDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializationDbAndDatabase();

//GET Players API
app.get("/players/", async (request, response) => {
  const getQuery = `
    SELECT
      *
    FROM
      cricket_team ;
    `;
  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
});

//POST player API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const postQuery = `
    INSERT INTO
      cricket_team(player_name,jersey_number,role)
    VALUES("${playerName}",${jerseyNumber},"${role}")
    ;`;
  const dbResponse = await db.run(postQuery);
  response.send("Player Added to Team");
});

//GET singlePlayer API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getSingleQuery = `
    SELECT * FROM
        cricket_team
    WHERE 
        player_id = ${playerId};`;
  const Player = await db.get(getSingleQuery);
  response.send(Player);
});

//PUT player API
app.put("/players/:playerId", (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const putQuery = `
  UPDATE 
    cricket_team
  SET player_name="${playerName}",jersey_number=${jerseyNumber},role="${role}"
  WHERE 
    player_id = ${playerId};`;
  const dbResponse = db.run(putQuery);
  response.send("Player Details Updated");
});

//DELETE player API
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
