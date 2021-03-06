(function() {
  define([], function() {
    return !(function(context, definition) {
      if ('function' === typeof require && typeof exports === typeof 'module') {
        return module.exports = definition;
      }
      return context['async'] = definition;
    })(this, (function() {
      var A, _callback, _static;
      A = function async() {
      if (typeof this.serial === 'undefined') {
        var a = new A(), k;
        for (k in arguments[0]) {
          a[k](arguments[0][k]);
        }
        return a;
      }
      this.a = [];
      this._reset();
      this.beginning_results = [].slice.call(arguments, 0);
    };;
      A.prototype._reset = function() {
        this.beginning_results = [];
        this.beginning_length = 0;
        this.processing = false;
        return this.processed = 0;
      };
      A.prototype._apply = function(args) {
        if (this.a.length) {
          return (args[0] ? this.a.splice(0, this.a.length)[0] : this.a[this.a.length - 1]).apply({}, args);
        }
      };
      A.prototype._next = function(parallel) {
        var _this = this;
        return function() {
          _this.processed++;
          if (arguments[0]) {
            return _this._apply(arguments);
          }
          _this.afterEach_callback.apply(_this._next(!_this.afterEach_callback.length), arguments);
          if (!parallel || _this.processed === _this.beginning_length) {
            while (_this._apply(arguments) && parallel) {}
          }
        };
      };
      A.prototype._push = function(args, parallel) {
        var dont_end, key, task, _fn,
          _this = this;
        task = args[0];
        '[object Function]' === Object.prototype.toString.call(task) && (dont_end = task = [task]);
        _fn = function(cb, parallel) {
          _this.beginning_length++;
          return _this.a.push(function() {
            var next;
            _this.a.pop();
            _this.beforeEach_callback.apply(_this._next(!_this.beforeEach_callback.length), arguments);
            args = Array.prototype.slice.apply(arguments).slice(1);
            cb.apply((next = _this._next(parallel)), args.concat(next));
            return parallel && (1 === _this.a.length || !!_this._apply(arguments));
          });
        };
        for (key in task) {
          _fn(task[key], parallel === null ? !task[key].length : parallel);
        }
        return (dont_end ? this : this.end(typeof args[1] === 'function' ? args[1] : function() {}));
      };
      A.prototype.end = A.prototype["finally"] = A.prototype.ensure = A.prototype.afterAll = A.prototype.after = A.prototype.complete = A.prototype.done = A.prototype.go = function(cb) {
        var _this = this;
        if (this.processing) {
          return;
        }
        this.processing = true;
        this.a.push(function() {
          _this.a.pop();
          if (arguments[0]) {
            _this.error_callback.apply(_this._next(!_this.error_callback.length), arguments);
          } else {
            _this.success_callback.apply(_this._next(!_this.success_callback.length), arguments);
          }
          if (typeof cb === 'function') {
            cb.apply(null, arguments);
          }
          return _this._reset();
        });
        this.a.reverse();
        (this.begin_callback = this.begin_callback || function() {}) && (this.beforeAll_callback = this.beforeAll_callback || function() {}) && (this.beforeEach_callback = this.beforeEach_callback || function() {}) && (this.afterEach_callback = this.afterEach_callback || function() {}) && (this.error_callback = this.error_callback || function() {}) && (this.success_callback = this.success_callback || function() {});
        this.beforeAll_callback.apply(this._next(!this.beforeAll_callback.length), arguments);
        this._apply([null].concat(this.beginning_results));
        return this;
      };
      A.prototype.serial = A.prototype.series = A.prototype.blocking = A.prototype.waterfall = function() {
        return this._push(arguments, false);
      };
      A.prototype.parallel = A.prototype.nonblocking = function() {
        return this._push(arguments, true);
      };
      A.prototype["do"] = A.prototype.then = A.prototype["try"] = A.prototype.begin = A.prototype.start = A.prototype.auto = function() {
        return this._push(arguments, null);
      };
      A.prototype["new"] = A.prototype.flow = A.prototype["with"] = function() {
        this.beginning_results = [].slice.call(arguments, 0);
        return this;
      };
      (_callback = function(func) {
        return function(cb) {
          this[func + '_callback'] = cb;
          return this;
        };
      }) && (A.prototype.beforeAll = A.prototype.before = _callback('beforeAll')) && (A.prototype.beforeEach = _callback('beforeEach')) && (A.prototype.afterEach = A.prototype.between = A.prototype.inbetween = _callback('afterEach')) && (A.prototype.error = A.prototype["catch"] = A.prototype.rescue = _callback('error')) && (A.prototype.success = A.prototype["else"] = _callback('success'));
      (_static = function(func) {
        return function() {
          var b;
          return (b = new A)[func].apply(b, arguments);
        };
      }) && (A.serial = A.series = A.blocking = A.waterfall = _static('serial')) && (A.parallel = A.nonblocking = _static('parallel')) && (A["do"] = A.then = A["try"] = A.begin = A.start = A.auto = _static('do')) && (A.end = A["finally"] = A.ensure = A.afterAll = A.after = A.complete = A.done = A.go = _static('end')) && (A["new"] = A.flow = A["with"] = _static('new')) && (A.beforeAll = A.before = _static('beforeAll')) && (A.beforeEach = _static('beforeEach')) && (A.afterEach = A.between = A.inbetween = _static('afterEach')) && (A.error = A["catch"] = A.rescue = _static('error')) && (A.success = A["else"] = _static('success'));
      A.q = {};
      A.nextTickGroup = A.push = function(g, f) {
        A.q[g] = A.q[g] || new A;
        A.q[g].serial(f).go();
        return A;
      };
      A.whilst = function(test, iterator, cb) {
        var _this = this;
        return (test() && iterator(function(err) {
          return (!!err && cb(err)) || _this.whilst(test, iterator, cb);
        })) || cb();
      };
      A.delay = function(ms, f) {
        return setTimeout(f, ms);
      };
      return A;
    })());
  });

}).call(this);
