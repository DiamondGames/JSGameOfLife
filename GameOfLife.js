// Generated by CoffeeScript 1.6.3
/*
This file only contains little helper function that I probably shouldn't really need anyway.
If these can all be replaced by builtins, that's be great.
*/


(function() {
  var $, HSVtoRGB, background, border, buttonHeight, buttonWidth, canvas, computeNextGeneration, context, deadClasses, draw, drawCells, extendAges, getBinaryThingey, inc, liveClasses, makeCells, makeNewGrid, mouse, mouseX, mouseY, numNeighbors, randomGrid, randomGridWithDimensions, rgb, rgba, root, rules, setHidden, setVisible, zero, _i, _ref;

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

  /* --------------------------------------------
       Begin io.coffee
  --------------------------------------------
  */


  /*
  This file contains everything that uses JQuery
  */


  $ = jQuery;

  rules = [[false, false, false, true, false, false, false, false, false], [false, false, true, true, false, false, false, false, false]];

  ($("#ruleTable")).append("<tr>\n	<th title=\"This column determines how dead cells can come to life\" style=\"height:30px;\" class=\"tableHeader\">Dead</th>\n	<th title=\"This column determines how live cells can stay alive\" style=\"height:30px;\" class=\"tableHeader\">Alive</th>\n</tr>");

  for (numNeighbors = _i = 0, _ref = 8 + 1; 0 <= _ref ? _i < _ref : _i > _ref; numNeighbors = 0 <= _ref ? ++_i : --_i) {
    deadClasses = "ruleButton";
    if (rules[0][numNeighbors]) {
      deadClasses += " down";
    }
    liveClasses = "ruleButton";
    if (rules[1][numNeighbors]) {
      liveClasses += " down";
    }
    ($("#ruleTable")).append("<tr>\n	<td title=\"When this button is illuminated, dead cells with " + numNeighbors + " neighbors will come to life.\nWhen this button is dark, dead cells with " + numNeighbors + " neighbors will stay dead.\" type=\"button\" class=\" " + deadClasses + " \" onclick=\"toggleRule(0, " + numNeighbors + ")\">" + numNeighbors + "</td>\n<td title=\"When this button is illuminated, live cells with " + numNeighbors + " neighbors will stay alive.\nWhen this button is dark, live cells with " + numNeighbors + " neighbors will die.\" type=\"button\" class=\" " + liveClasses + " \" onclick=\"toggleRule(1, " + numNeighbors + ")\">" + numNeighbors + "</td>\n</tr>");
  }

  /*
  jQueryKey should be a string like
  #myID
  */


  setVisible = function(jQueryKey) {
    ($(jQueryKey)).css({
      visibility: "visible",
      opacity: 0
    });
    return ($(jQueryKey)).animate({
      opacity: 1.0
    });
  };

  setHidden = function(jQueryKey) {
    return ($(jQueryKey)).animate({
      opacity: 0
    }, (function() {
      return ($(jQueryKey)).css({
        visibility: "hidden"
      });
    }));
  };

  this.help = function() {
    root.helpShown = !root.helpShown;
    root.paused = root.helpShown;
    if (root.helpShown) {
      return setVisible(".helpBox");
    } else {
      return setHidden(".helpBox");
    }
  };

  this.pause = function() {
    root.paused = !root.paused;
    return ($("#pauseButton")).html("Play");
  };

  this.toggleRule = function(x, y) {
    return rules[x][y] = !rules[x][y];
  };

  this.moreCells = function() {
    root.gridSpacing *= .9;
    border *= .9;
    root.gridWidth = canvas.width / gridSpacing;
    root.gridHeight = canvas.width / gridSpacing;
    return extendAges();
  };

  this.fewerCells = function() {
    root.gridSpacing /= .9;
    border /= .9;
    root.gridWidth = canvas.width / gridSpacing;
    return root.gridHeight = canvas.width / gridSpacing;
  };

  mouse = {
    x: 0,
    y: 0,
    down: [false, false, false, false, false, false, false, false, false],
    getX: function() {
      return this.x;
    },
    getY: function() {
      return this.y;
    },
    getButtonX: function() {
      return Math.floor(this.x / buttonWidth);
    },
    getButtonY: function() {
      return Math.floor(this.y / buttonHeight);
    },
    getGridX: function() {
      return Math.floor(this.x / gridSpacing);
    },
    getGridY: function() {
      return Math.floor(this.y / gridSpacing);
    },
    distanceTo: function(otherX, otherY) {
      return Math.sqrt(Math.pow(otherX - this.x, 2) + Math.pow(otherY - this.y, 2));
    }
  };

  makeCells = function(event) {
    var d, gridX, gridY, x, y, _j, _k, _l, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _results;
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    gridX = mouse.getGridX();
    gridY = mouse.getGridY();
    d = 2;
    if (mouse.down[1]) {
      if (!root.userHasCreatedCells) {
        root.userHasCreatedCells = true;
        setHidden("#tutorialCreateCells");
        if (!root.userHasChangedRules) {
          setVisible("#tutorialChangeRules");
        }
      }
      for (x = _j = _ref1 = gridX - d, _ref2 = gridX + 1 + d; _ref1 <= _ref2 ? _j < _ref2 : _j > _ref2; x = _ref1 <= _ref2 ? ++_j : --_j) {
        for (y = _k = _ref3 = gridY - d, _ref4 = gridY + 1 + d; _ref3 <= _ref4 ? _k < _ref4 : _k > _ref4; y = _ref3 <= _ref4 ? ++_k : --_k) {
          inc(ages, x, y);
        }
      }
    }
    if (mouse.down[3]) {
      root.userHasDeletedCells = true;
      _results = [];
      for (x = _l = _ref5 = gridX - d, _ref6 = gridX + 1 + d; _ref5 <= _ref6 ? _l < _ref6 : _l > _ref6; x = _ref5 <= _ref6 ? ++_l : --_l) {
        _results.push((function() {
          var _m, _ref7, _ref8, _results1;
          _results1 = [];
          for (y = _m = _ref7 = gridY - d, _ref8 = gridY + 1 + d; _ref7 <= _ref8 ? _m < _ref8 : _m > _ref8; y = _ref7 <= _ref8 ? ++_m : --_m) {
            _results1.push(zero(ages, x, y));
          }
          return _results1;
        })());
      }
      return _results;
    }
  };

  $("#myCanvas").mousedown(function(event) {
    mouse.down[event.which] = true;
    return makeCells(event);
  });

  $("#myCanvas").mouseup(function(event) {
    mouse.down[event.which] = false;
    if (root.help) {
      root.help = false;
      return root.paused = false;
    }
  });

  $("#myCanvas").mousemove(function(event) {
    return makeCells(event);
  });

  extendAges = function() {
    return root.ages = randomGrid();
  };

  $(window).resize(function() {
    var buttonHeight, buttonWidth;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buttonWidth = 50;
    buttonHeight = canvas.height / 9;
    root.gridWidth = canvas.width / gridSpacing;
    root.gridHeight = canvas.width / gridSpacing;
    return extendAges();
  });

  ($(".ruleButton")).click(function() {
    ($(this)).toggleClass("down");
    if (!root.userHasChangedRules) {
      root.userHasChangedRules = true;
      setHidden("#tutorialChangeRules");
      setTimeout((function() {
        return setVisible("#tutorialLeftCol");
      }), 1000);
      setTimeout((function() {
        return setHidden("#tutorialLeftCol");
      }), 5000);
      setTimeout((function() {
        return setVisible("#tutorialRightCol");
      }), 5000);
      return setTimeout((function() {
        return setHidden("#tutorialRightCol");
      }), 9000);
    }
  });

  ($("#ruleTableMinButton")).click(function() {
    ($(this)).toggleClass("down");
    return ($("#ruleTableDiv")).slideToggle();
  });

  ($("#speedOptionsMinButton")).click(function() {
    ($(this)).toggleClass("down");
    return ($("#speedOptionsDiv")).slideToggle();
  });

  ($("#gridSizeOptionsMinButton")).click(function() {
    ($(this)).toggleClass("down");
    return ($("#gridSizeOptionsDiv")).slideToggle();
  });

  /* --------------------------------------------
       Begin GameOfLife.coffee
  --------------------------------------------
  */


  /*
  This is Game Of Life
  Author Rafael Cosman
  This code is Maddy approved.
  */


  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  canvas = document.getElementById("myCanvas");

  context = canvas.getContext("2d");

  this.setDelay = function(newDelay) {
    return root.delay = newDelay;
  };

  background = function() {
    var bigNum;
    bigNum = 100000;
    return context.fillRect(-bigNum, -bigNum, 2 * bigNum, 2 * bigNum);
  };

  makeNewGrid = function() {
    var x, y, _j, _ref1, _results;
    _results = [];
    for (x = _j = 0, _ref1 = root.gridWidth; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
      _results.push((function() {
        var _k, _ref2, _results1;
        _results1 = [];
        for (y = _k = 0, _ref2 = root.gridHeight; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
          _results1.push(0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  this.clearGrid = function() {
    var x, y, _j, _ref1, _results;
    _results = [];
    for (x = _j = 0, _ref1 = root.gridWidth; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
      _results.push((function() {
        var _k, _ref2, _results1;
        _results1 = [];
        for (y = _k = 0, _ref2 = root.gridHeight; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
          _results1.push(root.ages[x][y] = 0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  randomGridWithDimensions = function(width, height) {
    var x, y, _j, _results;
    console.log(root.gridWidth);
    _results = [];
    for (x = _j = 0; 0 <= width ? _j < width : _j > width; x = 0 <= width ? ++_j : --_j) {
      _results.push((function() {
        var _k, _results1;
        _results1 = [];
        for (y = _k = 0; 0 <= height ? _k < height : _k > height; y = 0 <= height ? ++_k : --_k) {
          _results1.push(Math.floor(Math.random() + 0.4));
        }
        return _results1;
      })());
    }
    return _results;
  };

  randomGrid = function() {
    return randomGridWithDimensions(root.gridWidth, root.gridHeight);
  };

  this.randomizeGrid = function() {
    var x, y, _j, _ref1, _results;
    _results = [];
    for (x = _j = 0, _ref1 = root.gridWidth; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
      _results.push((function() {
        var _k, _ref2, _results1;
        _results1 = [];
        for (y = _k = 0, _ref2 = root.gridHeight; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
          _results1.push(root.ages[x][y] = Math.floor(Math.random() + 0.4));
        }
        return _results1;
      })());
    }
    return _results;
  };

  computeNextGeneration = function() {
    var x, y, _j, _k, _l, _ref1, _ref2, _ref3, _results;
    numNeighbors = makeNewGrid();
    for (x = _j = 0, _ref1 = root.gridWidth; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
      for (y = _k = 0, _ref2 = root.gridHeight; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
        if (root.ages[x][y] !== 0) {
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
    _results = [];
    for (x = _l = 0, _ref3 = root.gridWidth; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; x = 0 <= _ref3 ? ++_l : --_l) {
      _results.push((function() {
        var _m, _ref4, _results1;
        _results1 = [];
        for (y = _m = 0, _ref4 = root.gridHeight; 0 <= _ref4 ? _m < _ref4 : _m > _ref4; y = 0 <= _ref4 ? ++_m : --_m) {
          if (rules[getBinaryThingey(root.ages[x][y])][numNeighbors[x][y]]) {
            _results1.push(root.ages[x][y]++);
          } else {
            _results1.push(root.ages[x][y] = 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  drawCells = function() {
    var age, hue, timeModifier, x, y, _j, _ref1, _results;
    timeModifier = new Date().getTime() / 10000;
    _results = [];
    for (x = _j = 0, _ref1 = root.gridWidth; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
      _results.push((function() {
        var _k, _ref2, _results1;
        _results1 = [];
        for (y = _k = 0, _ref2 = root.gridHeight; 0 <= _ref2 ? _k < _ref2 : _k > _ref2; y = 0 <= _ref2 ? ++_k : --_k) {
          age = root.ages[x][y];
          if (age !== 0) {
            hue = Math.sqrt(age);
            hue *= 0.2;
            context.fillStyle = HSVtoRGB((hue + timeModifier) % 1, 1, 1);
            _results1.push(context.fillRect(root.gridSpacing * x, root.gridSpacing * y, root.gridSpacing - border, root.gridSpacing - border));
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      })());
    }
    return _results;
  };

  draw = function() {
    if (!root.paused) {
      computeNextGeneration();
    }
    context.fillStyle = rgb(0, 0, 0);
    background();
    drawCells();
    if (root.ages[mouse.getGridX()][mouse.getGridY()] !== 0) {
      context.fillStyle = rgba(255, 255, 255, 0.7);
      context.fillRect(mouse.getGridX() * root.gridSpacing, mouse.getGridY() * root.gridSpacing, root.gridSpacing - border, root.gridSpacing - border);
    }
    return setTimeout(draw, root.delay);
  };

  root.delay = 0;

  root.userHasCreatedCells = false;

  root.userHasChangedRules = false;

  root.userHasDeletedCells = false;

  setTimeout((function() {
    return setVisible("#tutorialCreateCells");
  }), 1000);

  canvas.width = window.innerWidth;

  canvas.height = window.innerHeight;

  buttonWidth = 50;

  buttonHeight = canvas.height / 9;

  root.gridSpacing = 15;

  border = root.gridSpacing * .2;

  root.gridWidth = canvas.width / root.gridSpacing;

  root.gridHeight = canvas.width / root.gridSpacing;

  mouseX = 0;

  mouseY = 0;

  root.ages = randomGrid();

  root.helpShown = false;

  root.paused = false;

  context.font = "20px Georgia";

  draw();

}).call(this);
