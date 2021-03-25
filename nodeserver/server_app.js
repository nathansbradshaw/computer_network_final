const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

const users = [];
const connnections = [];
const PORT = 5000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

let client = 0;


io.on("connection", (socket) => {
  //------------------------------------------------------- New user connection
  connnections.push(socket);
  socket.username = "Anonymous-" + client++;
  users.push(socket.username);

  console.log("a user connected, " + socket.username);
  // Tell all clients that a client has connected to chat
  const usernames = JSON.stringify(users)
  socket.emit("your username", socket.username)
  io.emit("connection to chat", socket.username, usernames );
  

  //-------------------------------------------------------- handle disconnection
  socket.on("disconnect", () => {
    //Remove user from list if disconnected
    const index = users.indexOf(socket.username);
    if (index > -1) {
      users.splice(index, 1);
      console.log(users)
    }
    const usernames = JSON.stringify(users)
    // Tell everyone that a user disconnected
    io.emit("disconnection from chat", socket.username, usernames);
  });

  //-------------------------------------------------------- Chat, send back ack with Username and status
  socket.on("chat", (message, ack) => {
    ack({ username: socket.username,
    status: 'ok'});
    io.emit("chat", message, socket.username
    );
  });

  // ------------------------------------------------------- Change Username
  socket.on("change username", (message, ack) => {
    const index = users.indexOf(socket.username);
    if (index > -1) {
      users[index] = message;
    }
    const usernames = JSON.stringify(users)
    const oldname = socket.username
    socket.username = message
    ack({ username: socket.username,
      status: 'ok'});
    // Tell everyone except the user that changed their name, that there was a name change
    socket.broadcast.emit("change username report", (`${oldname} changed their name to ${socket.username}` ), usernames);
    // Tell users that we succesfully changed their name.
    socket.emit("change username report", (`Your name has been changed to ${socket.username}`), usernames)
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
