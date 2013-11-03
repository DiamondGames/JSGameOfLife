// Generated by CoffeeScript 1.6.3
/*
This is Game Of Life
Author Rafael Cosman
This code is Maddy approved.
*/


(function() {
  var HSVtoRGB, advanceTutorial, ages, background, buttonHeight, buttonWidth, canvas, circle, context, createTutorialBox, draw, fillRect, getBinaryThingey, gridHeight, gridSpacing, gridWidth, inc, makeNewGrid, mouseDown, mouseDownCount, randomGrid, randomizeGrid, rgb, rgba, rules, translate, tutorial, tutorialLevel, zero;

  canvas = document.getElementById("myCanvas");

  context = canvas.getContext("2d");

  translate = function(x, y) {
    return context.translate(x, y);
  };

  fillRect = function(width, height) {
    return context.fillRect(0, 0, width, height);
  };

  circle = function(radius) {
    return context.arc(0, 0, radius, 0, 2 * Math.PI, false);
  };

  background = function() {
    var bigNum;
    bigNum = 100000;
    return context.fillRect(-bigNum, -bigNum, 2 * bigNum, 2 * bigNum);
  };

  makeNewGrid = function() {
    var x, y, _i, _results;
    _results = [];
    for (x = _i = 0; 0 <= gridWidth ? _i < gridWidth : _i > gridWidth; x = 0 <= gridWidth ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (y = _j = 0; 0 <= gridHeight ? _j < gridHeight : _j > gridHeight; y = 0 <= gridHeight ? ++_j : --_j) {
          _results1.push(0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  randomizeGrid = function() {
    var ages;
    return ages = randomGrid;
  };

  randomGrid = function() {
    var x, y, _i, _results;
    _results = [];
    for (x = _i = 0; 0 <= gridWidth ? _i < gridWidth : _i > gridWidth; x = 0 <= gridWidth ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (y = _j = 0; 0 <= gridHeight ? _j < gridHeight : _j > gridHeight; y = 0 <= gridHeight ? ++_j : --_j) {
          _results1.push(Math.floor(Math.random() + .4));
        }
        return _results1;
      })());
    }
    return _results;
  };

  getBinaryThingey = function(num) {
    if (num === 0) {
      return 0;
    } else {
      return 1;
    }
  };

  inc = function(arr, x, y) {
    if (x >= 0 && y >= 0 && x < arr.length && y < arr[0].length) {
      return arr[x][y]++;
    }
  };

  zero = function(arr, x, y) {
    if (x >= 0 && y >= 0 && x < arr.length && y < arr[0].length) {
      return arr[x][y] = 0;
    }
  };

  rgb = function(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  rgba = function(r, g, b, a) {
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  };

  HSVtoRGB = function(h, s, v) {
    var b, f, g, i, p, q, r, t;
    r = void 0;
    g = void 0;
    b = void 0;
    i = void 0;
    f = void 0;
    p = void 0;
    q = void 0;
    t = void 0;
    if (h && s === undefined && v === undefined) {
      s = h.s;
      v = h.v;
      h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
    }
    return rgb(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
  };

  draw = function() {
    var age, ageTillLoop, border, numNeighbors, x, y, _i, _j, _k, _l, _m, _n, _o, _p, _ref, _ref1;
    numNeighbors = makeNewGrid();
    for (x = _i = 0; 0 <= gridWidth ? _i < gridWidth : _i > gridWidth; x = 0 <= gridWidth ? ++_i : --_i) {
      for (y = _j = 0; 0 <= gridHeight ? _j < gridHeight : _j > gridHeight; y = 0 <= gridHeight ? ++_j : --_j) {
        if (ages[x][y] !== 0) {
          inc(numNeighbors, x - 1, y - 1);
          inc(numNeighbors, x - 1, y);
          inc(numNeighbors, x - 1, y + 1);
          inc(numNeighbors, x, y - 1);
          inc(numNeighbors, x, y + 1);
          inc(numNeighbors, x + 1, y - 1);
          inc(numNeighbors, x + 1, y);
          inc(numNeighbors, x + 1, y + 1);
        }
      }
    }
    for (x = _k = 0; 0 <= gridWidth ? _k < gridWidth : _k > gridWidth; x = 0 <= gridWidth ? ++_k : --_k) {
      for (y = _l = 0; 0 <= gridHeight ? _l < gridHeight : _l > gridHeight; y = 0 <= gridHeight ? ++_l : --_l) {
        if (rules[getBinaryThingey(ages[x][y])][numNeighbors[x][y]]) {
          ages[x][y]++;
        } else {
          ages[x][y] = 0;
        }
      }
    }
    context.fillStyle = rgb(0, 0, 0);
    background();
    for (x = _m = 0; 0 <= gridWidth ? _m < gridWidth : _m > gridWidth; x = 0 <= gridWidth ? ++_m : --_m) {
      for (y = _n = 0; 0 <= gridHeight ? _n < gridHeight : _n > gridHeight; y = 0 <= gridHeight ? ++_n : --_n) {
        age = ages[x][y];
        if (age !== 0) {
          ageTillLoop = 50;
          context.fillStyle = HSVtoRGB(age % ageTillLoop / ageTillLoop, 1, 1);
          border = 3;
          context.fillRect(gridSpacing * x, gridSpacing * y, gridSpacing - border, gridSpacing - border);
        }
      }
    }
    setTimeout(draw, 0);
    for (x = _o = 0, _ref = 1 + 1; 0 <= _ref ? _o < _ref : _o > _ref; x = 0 <= _ref ? ++_o : --_o) {
      for (y = _p = 0, _ref1 = 8 + 1; 0 <= _ref1 ? _p < _ref1 : _p > _ref1; y = 0 <= _ref1 ? ++_p : --_p) {
        if (rules[x][y]) {
          context.fillStyle = rgba(255, 255, 255, .6);
        } else {
          context.fillStyle = rgba(0, 0, 0, .5);
        }
        context.fillRect(buttonWidth * x, buttonHeight * y, buttonWidth, buttonHeight);
      }
    }
    context.save();
    tutorial();
    return context.restore();
  };

  tutorial = function() {
    switch (tutorialLevel) {
      case 0:
        break;
      case 1:
        context.translate(canvas.width - 250, 70);
        context.fillStyle = rgb(100, 100, 100);
        context.fillRect(-10, -20, 200, 50);
        context.fillStyle = rgb(255, 255, 255);
        context.fillText("Left-click and drag", 0, 0);
        return context.fillText("to create new cells", 0, 20);
      case 2:
        break;
      case 3:
        context.fillStyle = rgb(255, 255, 255);
        return context.fillText("Click on these buttons to change the rules", 200, 500);
      case 4:
    }
  };

  createTutorialBox = function() {
    context.fillStyle = "#FFFFFF";
    return context.fillRect(100, 100, 100, 100);
  };

  advanceTutorial = function() {
    return tutorialLevel++;
  };

  tutorialLevel = 0;

  setTimeout(advanceTutorial, 0);

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  buttonWidth = 50;

  buttonHeight = canvas.height / 9;

  gridSpacing = 15;

  gridWidth = canvas.width / gridSpacing;

  gridHeight = canvas.width / gridSpacing;

  ages = randomGrid();

  rules = [[false, false, false, true, false, false, false, false, false], [false, false, true, true, false, false, false, false, false]];

  context.font = "20px Georgia";

  draw();

  mouseDown = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  mouseDownCount = 0;

  document.body.onmousedown = function(event) {
    var buttonGridX, buttonGridY;
    ++mouseDown[event.button];
    ++mouseDownCount;
    if (event.button === 0) {
      if (event.clientX < 2 * buttonWidth) {
        buttonGridX = Math.floor(event.clientX / buttonWidth);
        buttonGridY = Math.floor(event.clientY / buttonHeight);
        return rules[buttonGridX][buttonGridY] = !rules[buttonGridX][buttonGridY];
      }
    }
  };

  document.body.onmouseup = function(event) {
    --mouseDown[event.button];
    return --mouseDownCount;
  };

  document.body.onmousemove = function(event) {
    var d, gridX, gridY, x, y, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
    d = 2;
    if (mouseDown[0]) {
      if (tutorialLevel === 1) {
        tutorialLevel++;
        setTimeOut(advanceTutorial, 0);
      }
      gridX = Math.floor(event.clientX / gridSpacing);
      gridY = Math.floor(event.clientY / gridSpacing);
      for (x = _i = _ref = gridX - d, _ref1 = gridX + 1 + d; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; x = _ref <= _ref1 ? ++_i : --_i) {
        for (y = _j = _ref2 = gridY - d, _ref3 = gridY + 1 + d; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; y = _ref2 <= _ref3 ? ++_j : --_j) {
          inc(ages, x, y);
        }
      }
    }
    if (mouseDown[2]) {
      gridX = Math.floor(event.clientX / gridSpacing);
      gridY = Math.floor(event.clientY / gridSpacing);
      _results = [];
      for (x = _k = _ref4 = gridX - d, _ref5 = gridX + 1 + d; _ref4 <= _ref5 ? _k < _ref5 : _k > _ref5; x = _ref4 <= _ref5 ? ++_k : --_k) {
        _results.push((function() {
          var _l, _ref6, _ref7, _results1;
          _results1 = [];
          for (y = _l = _ref6 = gridY - d, _ref7 = gridY + 1 + d; _ref6 <= _ref7 ? _l < _ref7 : _l > _ref7; y = _ref6 <= _ref7 ? ++_l : --_l) {
            _results1.push(zero(ages, x, y));
          }
          return _results1;
        })());
      }
      return _results;
    }
  };

}).call(this);
