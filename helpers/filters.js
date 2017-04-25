module.exports.filterBy = function (field, value) {
  return function (elem) {
      return elem[field] == value;
  }
};