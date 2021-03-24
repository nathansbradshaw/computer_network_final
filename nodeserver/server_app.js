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
  console.log("a user connected, " + socket.username);
  // Tell client that he is connected
  socket.emit("connection", (username, ack) => {
    console.log('Sending username')
    ack({ status: "ok" });
    username({ username: socket.username });
  });
  //-------------------------------------------------------- handle disconnection
  socket.on("disconnect", () => {
    //Remove user from list if disconnected
    const index = connnections.indexOf(socket.username);
    if (index > -1) {
      connnections.splice(index, 1);
      console.log(connnections)
    }
    console.log("user disconnected");
  });
  //-------------------------------------------------------- Chat, send back ack with Username and status
  socket.on("chat", (message, ack,) => {
    ack({ username: socket.username,
    status: 'ok'});
    io.emit("chat", message, socket.username
    );
  });
  // ------------------------------------------------------- Change Username
  socket.on("change username", (message, ack) => {
    const oldname = socket.username
    socket.username = message
    ack({ username: socket.username,
      status: 'ok'});
    io.emit("change username report", (`${oldname} changed their name to ${socket.username}` ));
  });
});

http.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
