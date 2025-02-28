const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
      { name: "Charlie", email: "charlie@example.com" },
      { name: "David", email: "david@example.com" },
      { name: "Eve", email: "eve@example.com" },
    ],
  });

  const tracks = await prisma.track.createMany({
    data: [
      { title: "Song A", artist: "Artist 1" },
      { title: "Song B", artist: "Artist 2" },
      { title: "Song C", artist: "Artist 3" },
      { title: "Song D", artist: "Artist 4" },
      { title: "Song E", artist: "Artist 5" },
      { title: "Song F", artist: "Artist 6" },
      { title: "Song G", artist: "Artist 7" },
      { title: "Song H", artist: "Artist 8" },
      { title: "Song I", artist: "Artist 9" },
      { title: "Song J", artist: "Artist 10" },
      { title: "Song K", artist: "Artist 11" },
      { title: "Song L", artist: "Artist 12" },
      { title: "Song M", artist: "Artist 13" },
      { title: "Song N", artist: "Artist 14" },
      { title: "Song O", artist: "Artist 15" },
      { title: "Song P", artist: "Artist 16" },
      { title: "Song Q", artist: "Artist 17" },
      { title: "Song R", artist: "Artist 18" },
      { title: "Song S", artist: "Artist 19" },
      { title: "Song T", artist: "Artist 20" },
    ],
  });

  const allUsers = await prisma.user.findMany();
  const allTracks = await prisma.track.findMany();

  for (let i = 0; i < 10; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const playlist = await prisma.playlist.create({
      data: {
        name: `Playlist ${i + 1}`,
        description: `Description for Playlist ${i + 1}`,
        ownerId: randomUser.id,
      },
    });

    const shuffledTracks = allTracks.sort(() => 0.5 - Math.random()).slice(0, 8);
    for (const track of shuffledTracks) {
      await prisma.playlistTrack.create({
        data: {
          playlistId: playlist.id,
          trackId: track.id,
        },
      });
    }
  }

  console.log("Database seeded with users, tracks, and playlists.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
