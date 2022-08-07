-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonsCompleted" (
    "id" SERIAL NOT NULL,
    "watchedVideo" BOOLEAN NOT NULL,
    "readText" BOOLEAN NOT NULL,
    "completionDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "LessonsCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeworkCompleted" (
    "id" SERIAL NOT NULL,
    "lastCompletionDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "homeworkId" INTEGER NOT NULL,

    CONSTRAINT "HomeworkCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengesCompleted" (
    "id" SERIAL NOT NULL,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "challengeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChallengesCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LessonsCompleted_lessonId_userId_key" ON "LessonsCompleted"("lessonId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeworkCompleted_homeworkId_userId_key" ON "HomeworkCompleted"("homeworkId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengesCompleted_challengeId_userId_key" ON "ChallengesCompleted"("challengeId", "userId");

-- AddForeignKey
ALTER TABLE "LessonsCompleted" ADD CONSTRAINT "LessonsCompleted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonsCompleted" ADD CONSTRAINT "LessonsCompleted_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkCompleted" ADD CONSTRAINT "HomeworkCompleted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeworkCompleted" ADD CONSTRAINT "HomeworkCompleted_homeworkId_fkey" FOREIGN KEY ("homeworkId") REFERENCES "Homework"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengesCompleted" ADD CONSTRAINT "ChallengesCompleted_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengesCompleted" ADD CONSTRAINT "ChallengesCompleted_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
