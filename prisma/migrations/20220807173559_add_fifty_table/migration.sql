-- CreateTable
CREATE TABLE "FiftyTime" (
    "id" SERIAL NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "hours" INTEGER NOT NULL DEFAULT 0,
    "minutes" INTEGER NOT NULL DEFAULT 0,
    "seconds" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "FiftyTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FiftyTime" ADD CONSTRAINT "FiftyTime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
