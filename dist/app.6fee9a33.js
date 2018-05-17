// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({16:[function(require,module,exports) {
(function () {

    function SpeechRecognition() {
        var tntBtn = document.getElementById('tnt');

        // 显示录音按钮
        document.getElementById('start-tnt').onclick = function () {
            this.parentNode.removeChild(this);
            document.getElementById('tnt').style.display = 'block';
            document.getElementById('recording-instructions').innerText = '已开启 TNT 模式, 仅支持小部分现代浏览器, 请授权网页使用麦克风, 代码在本地环境运行, 不会上传您的任何信息';
        };

        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
        } catch (e) {
            console.error(e);
            tntBtn.parentNode.removeChild(tntBtn);
            alert('您的浏览器暂不支持语音识别');
        }

        var noteTextarea = document.getElementById('text');
        var instructions = document.getElementById('recording-instructions');
        var noteContent = '';

        recognition.continuous = true;

        recognition.onresult = function (event) {
            var current = event.resultIndex;

            // 获取识别后的内容
            var transcript = event.results[current][0].transcript;

            // 解决安卓设备的bug
            var mobileRepeatBug = current == 1 && transcript == event.results[0][0].transcript;

            if (!mobileRepeatBug) {
                noteContent += transcript;
                noteTextarea.innerText = noteContent;
            }
        };

        recognition.onstart = function (e) {
            instructions.innerText = '正在识别, 请讲话';
        };

        recognition.onerror = function (event) {
            if (event.error == 'no-speech') {
                instructions.innerText = '未检测到语音，请再试一次';
            };
        };

        document.getElementById('start-recording').addEventListener('click', function (e) {
            console.log('开始录音');
            recognition.start();
            if (noteContent.length) {
                noteContent += ' ';
            }
        });

        document.getElementById('stop-recording').addEventListener('click', function (e) {
            console.log('录音停止');
            recognition.stop();
            instructions.innerText = '语音识别暂停';
        });
    }
    SpeechRecognition();

    // 设置日期
    var d = new Date();
    var text = d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日，晴。和昨天一样没吃饭。一直在群里等人带我。  昨天说好今天带我的，现在他们又说今天要援交没有时间带我，还说不仅今天往后11号、12号都不会带我，居然还说以后都不带我了，简直不能忍一定要好好记下来';
    document.getElementById('text').innerText = text;

    // 上传本地图片
    var input = document.getElementById('file');
    input.addEventListener('change', function (e) {
        var files = input.files;
        if (files.length) {
            if (files[0].type.indexOf('gif') != -1) {
                alert('暂不支持GIF文件');
            } else {
                var url = blob = URL.createObjectURL(files[0]);
                getBase64(files[0]).then(function (data) {
                    document.getElementById('uploadImg').src = data;
                }).catch(function (err) {
                    alert('上传失败, 请尝试更换浏览器后重试');
                });
            }
        }
    }, false);

    // 切换图片
    document.querySelectorAll('.select-img img').forEach(function (el, index, list) {
        el.addEventListener('click', function (e) {
            var imgSrc = this.src;
            document.getElementById('uploadImg').src = imgSrc;
        }, false);
    });

    // 文件转base64
    function getBase64(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                return resolve(reader.result);
            };
            reader.onerror = function (error) {
                return reject(error);
            };
        });
    }

    // 切换class
    function ToggleClass(el, classname) {
        if (el.classList.contains(classname)) {
            el.classList.remove(classname);
        } else {
            el.classList.add(classname);
        }
    }

    // 生成canvas
    function newCanvas(el, callback) {
        html2canvas(el, {
            allowTaint: true,
            taintTest: false,
            width: el.offsetWidth,
            height: el.offsetHeight,
            scale: 2
        }).then(function (canvas) {
            document.getElementById('canvas').src = canvas.toDataURL("image/png");
            setTimeout(function () {
                window.scrollTo(0, document.body.scrollHeight);
            }, 300);
        }).catch(function (err) {
            alert('生成失败, 请尝试更换浏览器后重试' + err);
        });
    }

    // 上传图片
    document.getElementById('uploadImg').addEventListener('click', function (e) {
        input.click();
    }, false);

    // 居中
    document.getElementById('font-centering').addEventListener('click', function (e) {
        var el = this.parentNode.parentNode.querySelector('.main pre');
        ToggleClass(el, 'center');
    }, false);

    // 加粗
    document.getElementById('font-bold').addEventListener('click', function (e) {
        var el = this.parentNode.parentNode.querySelector('.main pre');
        ToggleClass(el, 'bold');
    }, false);

    // 下载
    document.getElementById('download').addEventListener('click', function (e) {
        var el = this.parentNode.parentNode.querySelector('.main');
        newCanvas(el, function (url) {
            var a = document.createElement('a');
            a.href = url;
            a.download = 'bqb.jpg';
            a.click();
        });
    }, false);
})();
},{}],35:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '2653' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
      // Clear the console after HMR
      console.clear();
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[35,16], null)
//# sourceMappingURL=app.6fee9a33.map