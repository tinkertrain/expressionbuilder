'use strict';

var objectAssign = require('../utils/objectAssign');

var contentObjectProto = {
  set: function set() {
    if (arguments.length > 1) {
      this.obj[arguments[0]] = arguments[1];
    } else if (arguments.length === 1) {
      objectAssign(this.obj, this.obj, arguments[0]);
    }
    return this;
  },
  get: function get() {
    return this.obj;
  }
};

/**
 * Create a content object that will be later uploaded to Fuse
 * @param {String} objectType Content type as described in the content schema for this object type
 * @return {ContentObject}
 */
function createContentObject(objectType) {
  var contentObject = Object.create(contentObjectProto);
  contentObject.obj = {
    'fuse:type': objectType
  };
  return contentObject;
}

module.exports = createContentObject;