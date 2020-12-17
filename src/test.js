"use strict";



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }

            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

function readAge(_x) {
    return _readAge.apply(this, arguments);
} //async执行完后返回的就是一个promise

function _readAge() {
    _readAge = _asyncToGenerator( /*#__PURE__*/ regeneratorRuntime.mark(function _callee(filePath) {
        var name, age;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return fs.readFile(filePath, 'utf8');

                    case 2:
                        name = _context.sent;
                        _context.next = 5;
                        return fs.readFile('/Users/yinxia/highFunction/src/' + name, 'utf8');

                    case 5:
                        age = _context.sent;
                        return _context.abrupt("return", age);

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee);
    }));
    return _readAge.apply(this, arguments);
}

readAge('/Users/yinxia/highFunction/src/name.txt').then(function (data) {
    console.log(data);
}).catch(function (e) {
    console.log(e);
});