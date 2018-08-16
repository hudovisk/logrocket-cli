'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.describe = exports.command = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var gatherFiles = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(paths) {
    var _this = this;

    var map;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            map = [];
            _context2.next = 3;
            return _promise2.default.all(paths.map(function (path) {
              var realPath = (0, _path.join)((0, _process.cwd)(), path);

              if ((0, _fs.statSync)(realPath).isFile()) {
                map.push({
                  path: realPath,
                  name: (0, _path.basename)(realPath)
                });

                return _promise2.default.resolve();
              }

              return new _promise2.default(function (resolve) {
                (0, _glob2.default)('**/*.{js,jsx,js.map}', { cwd: realPath }, function () {
                  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(err, files) {
                    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, file;

                    return _regenerator2.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 3;

                            for (_iterator = (0, _getIterator3.default)(files); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                              file = _step.value;

                              map.push({
                                path: (0, _path.join)(realPath, file),
                                name: file
                              });
                            }

                            _context.next = 11;
                            break;

                          case 7:
                            _context.prev = 7;
                            _context.t0 = _context['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = _context.t0;

                          case 11:
                            _context.prev = 11;
                            _context.prev = 12;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                              _iterator.return();
                            }

                          case 14:
                            _context.prev = 14;

                            if (!_didIteratorError) {
                              _context.next = 17;
                              break;
                            }

                            throw _iteratorError;

                          case 17:
                            return _context.finish(14);

                          case 18:
                            return _context.finish(11);

                          case 19:
                            resolve();

                          case 20:
                          case 'end':
                            return _context.stop();
                        }
                      }
                    }, _callee, _this, [[3, 7, 11, 19], [12,, 14, 18]]);
                  }));

                  return function (_x2, _x3) {
                    return _ref2.apply(this, arguments);
                  };
                }());
              });
            }));

          case 3:
            return _context2.abrupt('return', map);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function gatherFiles(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _path = require('path');

var _process = require('process');

var _fs = require('fs');

var _apiClient = require('../apiClient');

var _apiClient2 = _interopRequireDefault(_apiClient);

var _formatError = require('../formatError');

var _formatError2 = _interopRequireDefault(_formatError);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = exports.command = 'upload <paths..>';
var describe = exports.describe = 'Upload JavaScript sourcemaps for a release';
var builder = exports.builder = function builder(args) {
  args.usage('\nUsage: logrocket upload -r <release> <paths..>').option('r', {
    alias: 'release',
    type: 'string',
    describe: 'The release version for these files',
    demand: 'You must specify a release, use -r or --release'
  }).demand(1, 'Missing upload path: e.g. logrocket upload -r 1.2.3 dist/').option('gcs-token', { // for testing, pass the webhook token to get an immediate pending=no
    type: 'string',
    describe: false
  }).option('gcs-bucket', { // for testing, pass the webhook bucket to get an immediate pending=no
    type: 'string',
    describe: false
  }).implies({
    'gcs-token': 'gcs-bucket',
    'gcs-bucket': 'gcs-token'
  }).help('help');
};

var handler = exports.handler = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(args) {
    var paths, release, apikey, apihost, verbose, client, uploadFile, fileList, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, fileInfo;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            paths = args.paths, release = args.release, apikey = args.apikey, apihost = args.apihost, verbose = args.verbose;


            console.info('Preparing to upload sourcemaps for release ' + release + ' ...');
            console.info('Gathering file list...');

            client = (0, _apiClient2.default)({ apikey: apikey, apihost: apihost });
            _context4.next = 6;
            return client.checkStatus();

          case 6:

            if (args['gcs-token']) {
              client.setGCSData({
                gcsToken: args['gcs-token'],
                gcsBucket: args['gcs-bucket']
              });
            }

            uploadFile = function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref5) {
                var path = _ref5.path,
                    name = _ref5.name;
                var data, res;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        console.info('Uploading: ' + name);

                        data = {
                          release: release,
                          filepath: '*/' + name,
                          contents: (0, _fs.createReadStream)(path)
                        };
                        _context3.prev = 2;
                        _context3.next = 5;
                        return client.uploadFile(data);

                      case 5:
                        res = _context3.sent;

                        if (res.ok) {
                          _context3.next = 10;
                          break;
                        }

                        console.error('Failed to upload: ' + name);
                        _context3.next = 10;
                        return (0, _formatError2.default)(res, { verbose: verbose });

                      case 10:
                        _context3.next = 16;
                        break;

                      case 12:
                        _context3.prev = 12;
                        _context3.t0 = _context3['catch'](2);

                        console.error(_context3.t0.message);
                        process.exit(1);

                      case 16:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined, [[2, 12]]);
              }));

              return function uploadFile(_x5) {
                return _ref4.apply(this, arguments);
              };
            }();

            _context4.next = 10;
            return gatherFiles(paths);

          case 10:
            fileList = _context4.sent;


            console.info('Found ' + fileList.length + ' file' + (fileList.length === 1 ? '' : 's') + ' ...');

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context4.prev = 15;
            _iterator2 = (0, _getIterator3.default)(fileList);

          case 17:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context4.next = 24;
              break;
            }

            fileInfo = _step2.value;
            _context4.next = 21;
            return uploadFile(fileInfo);

          case 21:
            _iteratorNormalCompletion2 = true;
            _context4.next = 17;
            break;

          case 24:
            _context4.next = 30;
            break;

          case 26:
            _context4.prev = 26;
            _context4.t0 = _context4['catch'](15);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t0;

          case 30:
            _context4.prev = 30;
            _context4.prev = 31;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 33:
            _context4.prev = 33;

            if (!_didIteratorError2) {
              _context4.next = 36;
              break;
            }

            throw _iteratorError2;

          case 36:
            return _context4.finish(33);

          case 37:
            return _context4.finish(30);

          case 38:

            console.info('Success!');

          case 39:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[15, 26, 30, 38], [31,, 33, 37]]);
  }));

  return function handler(_x4) {
    return _ref3.apply(this, arguments);
  };
}();