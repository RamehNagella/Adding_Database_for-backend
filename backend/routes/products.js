const Router = require("express").Router;
const mongodb = require("mongodb");

const db = require("../db");
// const MongoClient = mongodb.MongoClient;
const Decimal128 = mongodb.Decimal128;
const ObjectId = mongodb.ObjectId;

const router = Router();

// const products = [
//   {
//     _id: "fasdlk1j",
//     name: "Stylish Backpack",
//     description:
//       "A stylish backpack for the modern women or men. It easily fits all your stuff.",
//     price: 79.99,
//     image: "http://localhost:3100/images/product-backpack.jpg"
//   },
//   {
//     _id: "asdgfs1",
//     name: "Lovely Earrings",
//     description:
//       "How could a man resist these lovely earrings? Right - he couldn't.",
//     price: 129.59,
//     image: "http://localhost:3100/images/product-earrings.jpg"
//   },
//   {
//     _id: "askjll13",
//     name: "Working MacBook",
//     description:
//       "Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!",
//     price: 1799,
//     image: "http://localhost:3100/images/product-macbook.jpg"
//   },
//   {
//     _id: "sfhjk1lj21",
//     name: "Red Purse",
//     description: "A red purse. What is special about? It is red!",
//     price: 159.89,
//     image: "http://localhost:3100/images/product-purse.jpg"
//   },
//   {
//     _id: "lkljlkk11",
//     name: "A T-Shirt",
//     description:
//       "Never be naked again! This T-Shirt can soon be yours. If you find that buy button.",
//     price: 39.99,
//     image: "http://localhost:3100/images/product-shirt.jpg"
//   },
//   {
//     _id: "sajlfjal11",
//     name: "Cheap Watch",
//     description: "It actually is not cheap. But a watch!",
//     price: 299.99,
//     image: "http://localhost:3100/images/product-watch.jpg"
//   }
// ];

// Get list of products products

router.get("/", (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  const queryPage = req.query.page;
  // console.log("!!!!", queryPage);
  const pageSize = 1;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }
  // res.json(resultProducts);

  // MongoClient.connect(
  //   "mongodb+srv://rameshnagella272:1RrzdBFXCh6Ir26J@cluster0.ulgnrjm.mongodb.net/shop?retryWrites=true&w=majority"
  // )
  //   .then((client) => {
  //     const products = [];
  //     console.log("connected!");
  //     client
  //       .db()

  const products = [];
  // console.log("top", products);
  db.getDb()
    .db()
    .collection("products")
    .find()
    .sort({ price: -1 })
    // .skip((queryPage - 1) * pageSize)
    // .limit(pageSize)
    // .toArray()
    .forEach((productDoc) => {
      // console.log("curserProd", productDoc);
      // return productDoc;
      productDoc.price = productDoc.price.toString();
      products.push(productDoc);
    })
    .then((result) => {
      console.log("fetchedProdResult", result);
      // client.close(); remove this clien().close() other wise u will get client not defined error
      res.status(200).json(products);
    })
    .catch((err) => {
      console.log(err);
      // client.close();
      res.status(500).json({ message: "An error occured!" });
    });
});
// .catch((err) => {
//   console.log(err);
//   res.status(500).json({ message: "An error occured!" });
// });
// });

// Get single product
router.get("/:id", (req, res, next) => {
  // const product = products.find((p) => p._id === req.params.id);
  // console.log("single>>>", product);
  // db.getDb()
  //   .db()
  //   .collection("products")
  //   .find()
  //   .toArray()
  //   .then((products) => {
  //     console.log("fetchedSingle", products);
  //     console.log("???", req.params.id);
  //     console.log(
  //       "//",
  //       products.find((p) => {
  //         p._id;
  //       })
  //     );

  db.getDb()
    .db()
    .collection("products")
    .findOne({ _id: new ObjectId(req.params.id) })
    .then((productDoc) => {
      productDoc.price = productDoc.price.toString();
      console.log("fetchedSingleProd", productDoc);
      res.status(200).json(productDoc);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occured." });
    });
});

// res.json(product);
// });

// Add new product
// Requires logged in user
router.post("", (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  // MongoClient.connect(
  //   "mongodb+srv://rameshnagella272:1RrzdBFXCh6Ir26J@cluster0.ulgnrjm.mongodb.net/shop?retryWrites=true&w=majority"
  // )
  //   .then((client) => {
  //     console.log("connected!");
  //     //creating db & collection
  //     client
  //       .db()

  db.getDb()
    .db()
    .collection("products")
    .insertOne(newProduct)
    .then((result) => {
      console.log("insertedProd", result);
      // client.close();
      res
        .status(201)
        .json({ message: "Product added", productId: result.insertedId });
    })
    .catch((err) => {
      console.log(err);
      // client.close();
      res.status(500).json({ message: "An error occured!" });
    });
});
// .catch((err) => {
//   console.log(err);
//   res.status(500).json({ message: "An error occured!" });
// });

// console.log(newProduct);
// res.status(201).json({ message: "Product added", productId: "DUMMY" });
// });

// Edit existing product
// Requires logged in user
router.patch("/:id", (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  // console.log(updatedProduct);
  // res.status(200).json({ message: "Product updated", productId: "DUMMY" });
  db.getDb()
    .db()
    .collection("products")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updatedProduct })
    .then((result) => {
      console.log("updatedResult", result);
      res
        .status(200)
        .json({ message: "Product updated", productId: req.params.id });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error occured." });
    });
});

// Delete a product
// Requires logged in user
router.delete("/:id", (req, res, next) => {
  // res.status(200).json({ message: "Product deleted" });
  db.getDb()
    .db()
    .collection("products")
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then((result) => {
      console.log("deletedResult", result);
      res.status(200).json({ message: "Product Deleted" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "An error Occured while deleting." });
    });
});

module.exports = router;
