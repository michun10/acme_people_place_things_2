const Sequelize = require("sequelize");
const { STRING } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_people_places_things"
);

const People = conn.define("person", {
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
});

const Place = conn.define("place", {
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
});

const Thing = conn.define("thing", {
  name: {
    type: STRING,
    unique: true,
    allowNull: false,
  },
});

const Souvenir = conn.define("souvenir", {});

Souvenir.belongsTo(People);
Souvenir.belongsTo(Thing);
Souvenir.belongsTo(Place);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  await Promise.all([
    People.create({ name: "moe" }),
    People.create({ name: "larry" }),
    People.create({ name: "lucy" }),
    People.create({ name: "ethyl" }),
    Place.create({ name: "paris" }),
    Place.create({ name: "nyc" }),
    Place.create({ name: "chicago" }),
    Place.create({ name: "london" }),
    Thing.create({ name: "hat" }),
    Thing.create({ name: "bag" }),
    Thing.create({ name: "shirt" }),
    Thing.create({ name: "cup" }),
    Souvenir.create({ personId: 1, thingId: 1, placeId: 2 }),
    Souvenir.create({ personId: 1, thingId: 2, placeId: 1 }),
    Souvenir.create({ personId: 3, thingId: 3, placeId: 4 }),
  ]);
};

module.exports = { People, Place, Thing, Souvenir, conn, syncAndSeed };
