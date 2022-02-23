const { Model, raw } = require("objection");

class Update extends Model {
  static get tableName() {
    return "updates";
  }
}

Update.findForAdmin = function() {
  return this.query();
};

Update.findRoadMap = function(page = 1) {
  return this.query()
    .where({ completed: false })
    .orderBy("datetime", "ASC")
    .offset(page * 50 - 50)
    .limit(50);
};

Update.findChangeLog = function(page = 1) {
  return this.query()
    .where({ completed: true })
    .orderBy("datetime", "DESC")
    .offset(page * 50 - 50)
    .limit(50);
};

Update.toggleCompleted = async function(id) {
  return this.transaction(async trx => {
    const update = await this.query(trx).findOne({ id });
    await update.$query().patchAndFetch({ completed: raw("NOT completed") });

    return update;
  });
};

Update.findForAdmin = function() {
  return this.query();
};

Update.findById = function(id) {
  return this.query().findById(id);
};

Update.findByIdAdmin = function(id) {
  return this.query().findById(id);
};

Update.deleteByAdmin = function(id) {
  return this.query().deleteById(id);
};

Update.createByAdmin = function(body) {
  var { title, content, version, datetime, completed } = body;
  return this.query().insert({
    title,
    content,
    version,
    datetime,
    completed
  });
};

Update.editByAdmin = function(body) {
  var { id, title, content, version, datetime, completed } = body;
  return this.query()
    .update({
      title,
      content,
      version,
      datetime,
      completed
    })
    .where("id", id);
};

module.exports = Update;
