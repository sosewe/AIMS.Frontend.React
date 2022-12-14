Object.defineProperty(exports, "__esModule", { value: true });
exports.Guid = void 0;
var Guid = /** @class */ (function () {
  function Guid(value) {
    this.value = this.empty;
    if (value) {
      if (Guid.isValid(value)) {
        this.value = value;
      }
    }
  }
  Object.defineProperty(Guid, "empty", {
    get: function () {
      return "00000000-0000-0000-0000-000000000000";
    },
    enumerable: false,
    configurable: true,
  });
  Object.defineProperty(Guid.prototype, "empty", {
    get: function () {
      return Guid.empty;
    },
    enumerable: false,
    configurable: true,
  });
  Guid.newGuid = function () {
    return new Guid(
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:no-bitwise
        var r = (Math.random() * 16) | 0;
        // tslint:disable-next-line:triple-equals no-bitwise
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
    );
  };
  Guid.isValid = function (str) {
    var validRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return validRegex.test(str);
  };
  Guid.prototype.toString = function () {
    return this.value;
  };
  Guid.prototype.toJSON = function () {
    return this.value;
  };
  return Guid;
})();
exports.Guid = Guid;
