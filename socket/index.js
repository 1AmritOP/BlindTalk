import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
dotenv.config();

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });
const port = process.env.PORT || 5000;

const waitingQueue = [];
const activePairs = new Map();

io.on("connection", (socket) => {
  console.log("hello : ", socket.id);

  socket.on("start", () => {
    if (waitingQueue.includes(socket.id)) return;
    
    if (waitingQueue.length > 0) {
      const partner = waitingQueue.shift();
      const roomId = uuid();
      activePairs.set(socket.id, partner);
      activePairs.set(partner, socket.id);
      socket.emit("matched", { roomId });
      socket.to(partner).emit("matched", { roomId });
    } else {
      waitingQueue.push(socket.id);
      socket.emit("waiting")
    }
  });

  socket.on("next",()=>{
    handleLeave(socket.id)
  })

  socket.on("disconnect", () => {
    handleLeave(socket.id)
  });

  function handleLeave(id){
    const index= waitingQueue.indexOf(id)
    if (index !== -1) {
      waitingQueue.splice(index,1)
    }
    const partner= activePairs.get(id);
    if (partner) {
      io.to(partner).emit("partner_left");
      activePairs.delete(partner);
      activePairs.delete(id);
    }
  }
});

server.listen(port, () => {
  console.log("server is running on PORT : ", port);
});
