import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const homeworkData = [
  { name: 'Superimposed Lines' },
  { name: 'Ghosted Lines' },
  { name: 'Ghosted Planes' },
  { name: 'Tables of Ellipses' },
  { name: 'Ellipses in Planes' },
  { name: 'Funnels' },
  { name: 'Plotted Perspective' },
  { name: 'Rough Perspective' },
  { name: 'Rotated Boxes' },
  { name: 'Organic Perspective' },
  { name: 'Organic Arrows' },
  { name: 'Organic Forms with Contour Lines' },
  { name: 'Leaves' },
  { name: 'Branches' },
  { name: 'Insects/Arachnids - Constructional' },
  { name: 'Insects/Arachnids - Detail' },
]

const lessonData = [
  { name: 'Getting Started', index: 0 },
  { name: 'Lines, Ellipses and Boxes', index: 1 },
  { name: 'Organic Forms, Dissections and Form Intersections', index: 2 },
  { name: 'Applying Construction to Plants', index: 3 },
  { name: 'Applying Construction to Insects and Arachnids', index: 4 },
  { name: 'Applying Construction to Animals', index: 5 },
  { name: 'Applying Construction to Everyday Objects', index: 6 },
  { name: 'Applying Construction to Animals', index: 7 },
]

const challengeData = [
  { name: '250 Box Challenge' },
  { name: '250 Cylinder Challenge' },
  { name: '25 Texture' },
  { name: '25 Wheel Challenge' },
  { name: '100 Treasure Chest Challenge' },
]

async function seed() {
  try {
    // Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster
    // @see: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany
    Promise.all(
      //
      // Change to match your data model and seeding needs
      //
      [
        db.homework.createMany({data: homeworkData}),
        db.lesson.createMany({data: lessonData}),
        db.challenge.createMany({data: challengeData})
      ]
    )
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}

seed();