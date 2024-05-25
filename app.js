const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const path = require("path");
const dbPath = path.join(__dirname, "userData.db");

let db = null;
const connectionservertoDatabse = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("port is running at 3000");
    });
  } catch (e) {
    console.log(e.message);
  }
};

connectionservertoDatabse();

app.get("/", (request, response) => {
  response.send("hii raju");
});

// adding user details with post request

app.post("/register", async (request, response) => {
  const userData = request.body;
  const { username, name, password, gender, location } = userData;

  const userGetquery = `SELECT * FROM user
    WHERE username ='${username}';`;

  const dbResponse = await db.get(userGetquery);
  response.send(dbResponse);

  if (dbResponse !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    checkingPasswordLength = len(password) < 5;
    if (checkingPasswordLength === true) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const hashedPassword = bcrypt.hash(request.body.password, 10);
      const resteruserQuery = `INSERT INTO user(username,name,password,gender,location)
            VALUES('${username}','${name}','${hashedPassword}','${gender}','${location}');`;

      await db.run(resteruserQuery);
      response.status(200);
      response.send("User created successfully");
    }
  }
});
