const mongodb = require("mongodb");
const { useCallback } = require("react");

const MongoClient = mongodb.MongoClient;

const mongodbUrl =
  "mongodb+srv://rameshnagella272:1RrzdBFXCh6Ir26J@cluster0.ulgnrjm.mongodb.net/shop?retryWrites=true&w=majority";

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("Database is already initialized");
    return callback(null, _db);
  }
  MongoClient.connect(mongodbUrl)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Database not initialized");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
