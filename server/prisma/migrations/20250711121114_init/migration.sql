-- CreateTable
CREATE TABLE "sounds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 75,
    "access" TEXT NOT NULL DEFAULT 'ALL',
    "format" TEXT NOT NULL DEFAULT 'MP3',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "lastPlayed" DATETIME
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "flags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "commandCount" INTEGER NOT NULL DEFAULT 0,
    "lastSeen" DATETIME
);

-- CreateTable
CREATE TABLE "sound_plays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "soundId" TEXT NOT NULL,
    "userId" TEXT,
    "username" TEXT NOT NULL,
    "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sound_plays_soundId_fkey" FOREIGN KEY ("soundId") REFERENCES "sounds" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sound_plays_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "twitch_config" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'main',
    "username" TEXT,
    "oauth" TEXT,
    "channels" TEXT NOT NULL DEFAULT '[]',
    "connected" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalSounds" INTEGER NOT NULL DEFAULT 0,
    "totalUsers" INTEGER NOT NULL DEFAULT 0,
    "totalPlays" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "sounds_command_key" ON "sounds"("command");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
