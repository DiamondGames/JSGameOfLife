// Generated by CoffeeScript 1.6.3
/*
This file only contains little helper function that I probably shouldn't really need anyway.
If these can all be replaced by builtins, that's be great.
*/


(function() {
  var $, HSVtoRGB, background, border, buttonHeight, buttonWidth, canvas, computeNextGeneration, context, draw, drawCells, extendAges, getBinaryThingey, inc, makeCells, makeNewGrid, maxNeighborhoodSize, mouse, mouseX, mouseY, neighborhood, randomGrid, randomGridWithDimensions, rgb, rgba, root, rules, setHidden, setVisible, zero;

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

  neighborhood = [[false, false, false, false, false], [false, true, true, true, false], [false, true, false, true, false], [false, true, true, true, false], [false, false, false, false, false]];

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

  this.toggleRule = function(x, y) {
    return rules[x][y] = !rules[x][y];
  };

  this.toggleNeighborhood = function(x, y) {
    return neighborhood[x][y] = !neighborhood[x][y];
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
    var gridX, gridY, x, y, _i, _j, _k, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
    mouse.x = event.pageX;
    mouse.y = event.pageY;
    gridX = mouse.getGridX();
    gridY = mouse.getGridY();
    if (mouse.down[1]) {
      if (!root.userHasCreatedCells) {
        root.userHasCreatedCells = true;
        setHidden("#tutorialCreateCells");
        if (!root.userHasChangedRules) {
          setVisible("#tutorialChangeRules");
        }
      }
      for (x = _i = _ref = gridX - root.brushSize, _ref1 = gridX + 1 + root.brushSize; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; x = _ref <= _ref1 ? ++_i : --_i) {
        for (y = _j = _ref2 = gridY - root.brushSize, _ref3 = gridY + 1 + root.brushSize; _ref2 <= _ref3 ? _j < _ref3 : _j > _ref3; y = _ref2 <= _ref3 ? ++_j : --_j) {
          inc(ages, x, y);
        }
      }
    }
    if (mouse.down[3]) {
      root.userHasDeletedCells = true;
      _results = [];
      for (x = _k = _ref4 = gridX - root.brushSize, _ref5 = gridX + 1 + root.brushSize; _ref4 <= _ref5 ? _k < _ref5 : _k > _ref5; x = _ref4 <= _ref5 ? ++_k : --_k) {
        _results.push((function() {
          var _l, _ref6, _ref7, _results1;
          _results1 = [];
          for (y = _l = _ref6 = gridY - root.brushSize, _ref7 = gridY + 1 + root.brushSize; _ref6 <= _ref7 ? _l < _ref7 : _l > _ref7; y = _ref6 <= _ref7 ? ++_l : --_l) {
            _results1.push(zero(ages, x, y));
          }
          return _results1;
        })());
      }
      return _results;
    }
  };

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

  $(function() {
    var classes, deadClasses, liveClasses, numNeighbors, tableBody, x, y, _i, _j, _k, _l, _len, _len1, _m, _ref, _ref1, _ref2, _results, _results1;
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
      ($("#ruleTable")).append("<tr>\n	<td title=\"When this button is illuminated, dead cells with " + numNeighbors + " neighbors will come to life.\nWhen this button is dark, dead cells with " + numNeighbors + " neighbors will stay dead.\"\ntype=\"button\" class=\" " + deadClasses + " \" onclick=\"toggleRule(0, " + numNeighbors + ")\">" + numNeighbors + "</td>\n<td title=\"When this button is illuminated, live cells with " + numNeighbors + " neighbors will stay alive.\nWhen this button is dark, live cells with " + numNeighbors + " neighbors will die.\"\ntype=\"button\" class=\" " + liveClasses + " \" onclick=\"toggleRule(1, " + numNeighbors + ")\">" + numNeighbors + "</td>\n</tr>");
    }
    tableBody = $("#neighborhoodOptionsTable>tbody");
    _ref1 = (function() {
      _results = [];
      for (var _k = 0; 0 <= maxNeighborhoodSize ? _k < maxNeighborhoodSize : _k > maxNeighborhoodSize; 0 <= maxNeighborhoodSize ? _k++ : _k--){ _results.push(_k); }
      return _results;
    }).apply(this).reverse();
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      y = _ref1[_j];
      tableBody.append("<tr>");
      _ref2 = (function() {
        _results1 = [];
        for (var _m = 0; 0 <= maxNeighborhoodSize ? _m < maxNeighborhoodSize : _m > maxNeighborhoodSize; 0 <= maxNeighborhoodSize ? _m++ : _m--){ _results1.push(_m); }
        return _results1;
      }).apply(this).reverse();
      for (_l = 0, _len1 = _ref2.length; _l < _len1; _l++) {
        x = _ref2[_l];
        classes = "neighborhoodButton";
        if (neighborhood[x][y]) {
          classes += " down";
        }
        tableBody.append("<td type=\"button\" class=\" " + classes + " \" onclick=\"toggleNeighborhood( " + x + "," + y + " )\"></td>");
      }
      tableBody.append("</tr>");
    }
    ($(".neighborhoodButton")).click(function() {
      return ($(this)).toggleClass("down");
    });
    ($(".ruleButton")).click(function() {
      var time;
      ($(this)).toggleClass("down");
      if (!root.userHasChangedRules) {
        root.userHasChangedRules = true;
        setHidden("#tutorialChangeRules");
        time = 1000;
        setTimeout((function() {
          return setVisible("#tutorialLeftCol");
        }), time);
        setTimeout((function() {
          return setHidden("#tutorialLeftCol");
        }), time += 4000);
        setTimeout((function() {
          return setVisible("#tutorialRightCol");
        }), time);
        setTimeout((function() {
          return setHidden("#tutorialRightCol");
        }), time += 4000);
        setTimeout((function() {
          return setVisible("#tutorialRow");
        }), time);
        setTimeout((function() {
          return setHidden("#tutorialRow");
        }), time += 4000);
        setTimeout((function() {
          return setVisible("#tutorialMouseOver");
        }), time);
        return setTimeout((function() {
          return setHidden("#tutorialMouseOver");
        }), time += 4000);
      }
    });
    /*
    	($ "#ruleTableMinButton").click ->
    		($ this).toggleClass "down"
    		($ "#ruleTableDiv").slideToggle()
    */

    ($("#speedOptionsMinButton")).click(function() {
      ($(this)).toggleClass("down");
      return ($("#speedOptionsDiv")).slideToggle();
    });
    ($("#gridSizeOptionsMinButton")).click(function() {
      ($(this)).toggleClass("down");
      return ($("#gridSizeOptionsDiv")).slideToggle();
    });
    ($("#brushOptionsMinButton")).click(function() {
      ($(this)).toggleClass("down");
      return ($("#brushOptionsDiv")).slideToggle();
    });
    ($("#neighborhoodOptionsMinButton")).click(function() {
      ($(this)).toggleClass("down");
      return ($("#neighborhoodOptionsDiv")).slideToggle();
    });
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
    ($("#pauseButton")).click((function() {
      ($(this)).toggleClass("down");
      root.paused = !root.paused;
      if (root.paused) {
        return ($(this)).html("Play");
      } else {
        return ($(this)).html("Pause");
      }
    }));
    ($("#1x1")).click((function() {
      return root.brushSize = 0;
    }));
    ($("#2x2")).click((function() {
      return root.brushSize = .5;
    }));
    ($("#3x3")).click((function() {
      return root.brushSize = 1;
    }));
    ($("#5x5")).click((function() {
      return root.brushSize = 2;
    }));
    return ($("#9x9")).click((function() {
      return root.brushSize = 4;
    }));
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
    var x, y, _i, _ref, _results;
    _results = [];
    for (x = _i = 0, _ref = root.gridWidth; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (y = _j = 0, _ref1 = root.gridHeight; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  this.clearGrid = function() {
    var x, y, _i, _ref, _results;
    _results = [];
    for (x = _i = 0, _ref = root.gridWidth; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (y = _j = 0, _ref1 = root.gridHeight; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(root.ages[x][y] = 0);
        }
        return _results1;
      })());
    }
    return _results;
  };

  randomGridWithDimensions = function(width, height) {
    var x, y, _i, _results;
    console.log(root.gridWidth);
    _results = [];
    for (x = _i = 0; 0 <= width ? _i < width : _i > width; x = 0 <= width ? ++_i : --_i) {
      _results.push((function() {
        var _j, _results1;
        _results1 = [];
        for (y = _j = 0; 0 <= height ? _j < height : _j > height; y = 0 <= height ? ++_j : --_j) {
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
    var x, y, _i, _ref, _results;
    _results = [];
    for (x = _i = 0, _ref = root.gridWidth; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (y = _j = 0, _ref1 = root.gridHeight; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(root.ages[x][y] = Math.floor(Math.random() + 0.4));
        }
        return _results1;
      })());
    }
    return _results;
  };

  computeNextGeneration = function() {
    var dx, dy, numNeighbors, x, y, _i, _j, _k, _l, _m, _ref, _ref1, _ref2, _results;
    numNeighbors = makeNewGrid();
    for (x = _i = 0, _ref = root.gridWidth; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      for (y = _j = 0, _ref1 = root.gridHeight; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
        if (root.ages[x][y] !== 0) {
          for (dx = _k = 0; 0 <= maxNeighborhoodSize ? _k < maxNeighborhoodSize : _k > maxNeighborhoodSize; dx = 0 <= maxNeighborhoodSize ? ++_k : --_k) {
            for (dy = _l = 0; 0 <= maxNeighborhoodSize ? _l < maxNeighborhoodSize : _l > maxNeighborhoodSize; dy = 0 <= maxNeighborhoodSize ? ++_l : --_l) {
              if (neighborhood[dx][dy]) {
                inc(numNeighbors, x + dx - 2, y + dy - 2);
              }
            }
          }
        }
      }
    }
    _results = [];
    for (x = _m = 0, _ref2 = root.gridWidth; 0 <= _ref2 ? _m < _ref2 : _m > _ref2; x = 0 <= _ref2 ? ++_m : --_m) {
      _results.push((function() {
        var _n, _ref3, _results1;
        _results1 = [];
        for (y = _n = 0, _ref3 = root.gridHeight; 0 <= _ref3 ? _n < _ref3 : _n > _ref3; y = 0 <= _ref3 ? ++_n : --_n) {
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
    var age, hue, timeModifier, x, y, _i, _ref, _results;
    timeModifier = new Date().getTime() / 10000;
    _results = [];
    for (x = _i = 0, _ref = root.gridWidth; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (y = _j = 0, _ref1 = root.gridHeight; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
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

  maxNeighborhoodSize = 5;

  root.ages = randomGrid();

  root.brushSize = 2;

  root.helpShown = false;

  root.paused = false;

  context.font = "20px Georgia";

  draw();

}).call(this);
