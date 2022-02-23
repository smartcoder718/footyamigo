const { Model, raw } = require("objection");

class PageVideo extends Model {
  static get tableName() {
    return "page_videos";
  }
}

PageVideo.findByLocation = function (location) {
  return this.query().findOne({ location });
};

PageVideo.findAllByLocation = function (location) {
  return this.query().where({ location });
};

PageVideo.findOne = function (id) {
  return this.query().findOne({ id });
};

PageVideo.findForAdmin = function () {
  return this.query();
};

PageVideo.deleteByAdmin = function (id) {
  return this.query().deleteById(id);
};

PageVideo.createByAdmin = function (body) {
  var { id, title, location, video_url } = body;
  return this.query().upsertGraph({
    id,
    title,
    location,
    video_url,
  });
};

module.exports = PageVideo;
