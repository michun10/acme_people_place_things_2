const express = require("express");
var bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

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
    const displayDropDown = (items) => {
      return items
        .map((item) => {
          return `<option value = ${item.id}>${item.name}</option>`;
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
      <h2>Souvenir Purchases</h2>
            <h3>Create a new Souvenir Purchase by selecting a Person, the Place they purchased the souvenir, and the Thing they bought</h3>
      <form method="POST" action="/">
      <select name="personId">
         ${displayDropDown(people)}
      </select>
        <select name="placeId">
          ${displayDropDown(places)}
      </select>
    <select name="thingId">
      ${displayDropDown(things)} 
      </select>
      <button>Create</button>
      </form>
      <ul>
      ${souvenirs
        .map((souvenir) => {
          return `<li>${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}</li>
          <form method="POST" action="/${souvenir.id}?_method=DELETE"><button>Delete</button></form>
          `;
        })
        .join("")}
      </ul>
  </body>
  </html>
  `;
    res.send(html);
  } catch (er) {
    next(er);
  }
});

app.post("/", async (req, res, next) => {
  try {
    await Souvenir.create({
      personId: req.body.personId,
      placeId: req.body.placeId,
      thingId: req.body.thingId,
    });
    res.redirect("/");
  } catch (er) {
    next(er);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    await Souvenir.destroy({
      where: { id: req.params.id },
    });
    res.redirect("/");
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
