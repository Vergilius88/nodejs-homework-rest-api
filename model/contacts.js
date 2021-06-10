const db = require("./db");
const { v4: uuid } = require("uuid");

const getListContacts = async () => {
  return db.get("contacts").value();
};

const getContactById = async (id) => {
  return db.get("contacts").find({ id }).value();
};

const removeContact = async (id) => {
  const [record] = db.get("contacts").remove({ id }).write();

  return record;
};

const addContact = async (body) => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  db.get("contacts").push(record).write();
  return record;
};

const updateContact = async (id, body) => {
  const record = db.get("contacts").find({ id }).assign(body).value();
  db.write();

  return record.id ? record : null;
};

module.exports = {
  getListContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
