const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Users Router
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { playlists: true },
  });
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// ✅ Playlists Router
app.get("/playlists", async (req, res) => {
  const playlists = await prisma.playlist.findMany();
  res.json(playlists);
});

app.post("/playlists", async (req, res) => {
  const { name, description, ownerId, trackIds } = req.body;
  if (!name || !ownerId) return res.status(400).json({ error: "Missing fields" });

  const playlist = await prisma.playlist.create({
    data: {
      name,
      description,
      ownerId,
      tracks: {
        create: trackIds.map(trackId => ({ trackId })),
      },
    },
  });

  res.status(201).json(playlist);
});

app.get("/playlists/:id", async (req, res) => {
  const playlist = await prisma.playlist.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { tracks: { include: { track: true } } },
  });
  playlist ? res.json(playlist) : res.status(404).json({ error: "Playlist not found" });
});

// Tracks Router
app.get("/tracks", async (req, res) => {
  const tracks = await prisma.track.findMany();
  res.json(tracks);
});

app.get("/tracks/:id", async (req, res) => {
  const track = await prisma.track.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  track ? res.json(track) : res.status(404).json({ error: "Track not found" });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
