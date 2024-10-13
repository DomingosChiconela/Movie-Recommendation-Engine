import {db} from "../src/utils/db.server"



const main = async () => {
  const genres = [
    "ACTION",
    "ADVENTURE",
    "COMEDY",
    "DRAMA",
    "HORROR",
    "SCIFI",
    "ROMANCE",
    "DOCUMENTARY",
    "ANIMATION",
    "FANTASY",
    "THRILLER",
    "MYSTERY",
    "MUSICAL",
    "BIOGRAPHY",
    "HISTORICAL",
    "SPORT",
    "WAR",
    "WESTERN",
    "FAMILY",
    "CRIME",
    "NOIR",
    "SUPERHERO",
  ];

 
  await Promise.all(
    genres.map(async (name) => {
      const existing = await db.gender.findUnique({ where: { name } });
      if (!existing) {
        return db.gender.create({ data: { name } });
      }
    })
  );

  console.log("Genres seeded successfully.");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
