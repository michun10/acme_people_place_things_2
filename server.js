const express = require("express");
const app = express();

const { People, Place, Thing, Souvenir, conn } = require("./db");

app.get("/", async (req, res, next) => {
  try {
    const people = await People.findAll();
    const places = await Place.findAll();
    const things = await Thing.findAll();
    const souvenirs = await Souvenir.findAll({
      include: [People, Place, Thing],
    });

    const displayItems = (items) => {
      return items
        .map((item) => {
          return `<li>${item.name}</li>`;
        })
        .join("");
    };

    const html = `
  <html>
  <head>
  </head>
  <body>
    <h1>Acme People, Places and Things</h1>
    <h2>People</h2>
    <ul>
    ${displayItems(people)}
    </ul>
        <h2>Places</h2>
    <ul>
    ${displayItems(places)}
      </ul>
          <h2>Things</h2>
    <ul>
    ${displayItems(things)}
      </ul>
     
  </body>
  </html>
  `;
    res.send(html);
  } catch (er) {
    next(er);
  }
});

const syncAndSeed = async () => {
  try {
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
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch {
    console.error();
  }
};

syncAndSeed();
