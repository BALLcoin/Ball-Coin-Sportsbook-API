import http from 'http';
import {Server} from 'socket.io';

import config from '../config';
import createUpdateUser from './createUpdateUser';
import Message from '../models/Message';

interface IHandshakeQuery {
  roomId: string;
}

interface IMessageParams {
  authToken: string;
  body: string;
}

// Creates the server
const server = http.createServer();
const io = new Server(server, {
  cors: {origin: '*'},
});

// Sets up the socket.io endpoints
io.on('connection', async (socket) => {
  // Join a conversation
  const roomId = socket.handshake.query.roomId as string;
  socket.join(roomId);

  // Emits the message history
  const messages = await Message.find({roomId})
    .sort({date: 1})
    .populate('user');
  socket.emit('chatHistory', messages);

  socket.on('message', async ({authToken, body}: IMessageParams) => {
    const {_id: uid} = await createUpdateUser(authToken);

    const message = new Message({
      user: uid,
      date: new Date(),
      roomId,
      body: body,
    });

    await message.save();
    await message.populate('user').execPopulate();

    io.to(roomId).emit('message', message);
  });
});

// Gets the port and starts the server
const port = process.env.CHAT_SERVER_PORT || config.chatServer.port;

const startChatServer = () => {
  server.listen(port, () => {
    console.log(`Explorer Socket Server running on port ${port}`);
  });
};

export default startChatServer;
