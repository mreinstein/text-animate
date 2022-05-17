(function () {
  'use strict';

  function scaleAlpha (color, amount) {
    return 'rgba(' + color.join(',') + ',' + amount + ')'
  }

  function animateHeader (el, opts={}) {
    const options = JSON.parse(JSON.stringify(opts));
    el.innerHTML = '<span>' + el.innerText + '</span>';
    const span =  el.querySelector('span');
    span.style.color = 'rgb(' + options.color.join(',') + ')';
    span.style.backgroundColor = '';
    span.style.fontSize = 'inherit';

    let accum = 0;  // milliseconds in the accumulator
    let finished = false;


    // @param int dt time elapsed in milliseconds
    const step = function (dt) {
      accum += dt;
      if (finished || accum < options.delay)
        return

      const actual = accum - options.delay;
      finished = actual >= options.duration;

      span.style.backgroundColor = finished ? '' : scaleAlpha(options.color, 1 - actual/options.duration);
    };


    return { step }
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var alea = createCommonjsModule(function (module, exports) {
  (function (root, factory) {
    {
        module.exports = factory();
    }
  }(commonjsGlobal, function () {

    // From http://baagoe.com/en/RandomMusings/javascript/

    // importState to sync generator states
    Alea.importState = function(i){
      var random = new Alea();
      random.importState(i);
      return random;
    };

    return Alea;

    function Alea() {
      return (function(args) {
        // Johannes Baagøe <baagoe@baagoe.com>, 2010
        var s0 = 0;
        var s1 = 0;
        var s2 = 0;
        var c = 1;

        if (args.length == 0) {
          args = [+new Date];
        }
        var mash = Mash();
        s0 = mash(' ');
        s1 = mash(' ');
        s2 = mash(' ');

        for (var i = 0; i < args.length; i++) {
          s0 -= mash(args[i]);
          if (s0 < 0) {
            s0 += 1;
          }
          s1 -= mash(args[i]);
          if (s1 < 0) {
            s1 += 1;
          }
          s2 -= mash(args[i]);
          if (s2 < 0) {
            s2 += 1;
          }
        }
        mash = null;

        var random = function() {
          var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
          s0 = s1;
          s1 = s2;
          return s2 = t - (c = t | 0);
        };
        random.next = random;
        random.uint32 = function() {
          return random() * 0x100000000; // 2^32
        };
        random.fract53 = function() {
          return random() + 
            (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
        };
        random.version = 'Alea 0.9';
        random.args = args;

        // my own additions to sync state between two generators
        random.exportState = function(){
          return [s0, s1, s2, c];
        };
        random.importState = function(i){
          s0 = +i[0] || 0;
          s1 = +i[1] || 0;
          s2 = +i[2] || 0;
          c = +i[3] || 0;
        };
   
        return random;

      } (Array.prototype.slice.call(arguments)));
    }

    function Mash() {
      var n = 0xefc8249d;

      var mash = function(data) {
        data = data.toString();
        for (var i = 0; i < data.length; i++) {
          n += data.charCodeAt(i);
          var h = 0.02519603282416938 * n;
          n = h >>> 0;
          h -= n;
          h *= n;
          n = h >>> 0;
          h -= n;
          n += h * 0x100000000; // 2^32
        }
        return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
      };

      mash.version = 'Mash 0.9';
      return mash;
    }
  }));
  });

  var charming = function (element, options) {
    options = options || {};
    element.normalize();
    var splitRegex = options.splitRegex;

    var tagName = options.tagName || 'span';
    var classPrefix = options.classPrefix != null ? options.classPrefix : 'char';
    var count = 1;

    function inject (element) {
      var parentNode = element.parentNode;
      var string = element.nodeValue;
      var split = splitRegex ? string.split(splitRegex) : string;
      var length = split.length;
      var i = -1;
      while (++i < length) {
        var node = document.createElement(tagName);
        if (classPrefix) {
          node.className = classPrefix + count;
          count++;
        }
        node.appendChild(document.createTextNode(split[i]));
        node.setAttribute('aria-hidden', 'true');
        parentNode.insertBefore(node, element);
      }
      if (string.trim() !== '') {
        parentNode.setAttribute('aria-label', string);
      }
      parentNode.removeChild(element);
    }
  (function traverse (element) {
      // `element` is itself a text node.
      if (element.nodeType === 3) {
        return inject(element)
      }

      // `element` has a single child text node.
      var childNodes = Array.prototype.slice.call(element.childNodes); // static array of nodes
      var length = childNodes.length;
      if (length === 1 && childNodes[0].nodeType === 3) {
        return inject(childNodes[0])
      }

      // `element` has more than one child node.
      var i = -1;
      while (++i < length) {
        traverse(childNodes[i]);
      }
    })(element);
  };

  // TODO: investigate varying the etchSpeed slightly each frame
  function animate1 (el, opts={}) {
    const options = JSON.parse(JSON.stringify(opts));

    let spans;
    let index = 0;  // index of currently etched character
    let accum = 0;  // ms in the accumulator
    const delay = (options.delay ? options.delay : 0);

    const defaultSeed = options.randSeed || Math.random();
    const rng = new alea(defaultSeed);

    let etchWidth = (rng() > 0.5) ? 1 : 2;

    const _etch = function (i) {
      if (i >= spans.length)
        return

      if (spans[i].innerText === ' ') {
        spans[i].style.backgroundColor = '';
        return
      }
      spans[i].style.color = options.etchFGColor;
      spans[i].style.backgroundColor = options.etchBGColor;
    };


    const _done = function (i) {
      if (i >= spans.length)
        return

      spans[i].style.color = ''; //'initial'
      spans[i].style.backgroundColor = options.targetBGColor;
    };


    const setText = function (text) {
      _setup(text);
      accum = delay;
    };


    const _setup = function (text) {
      charming(el);
      index = 0;
      spans = el.querySelectorAll('span');

      const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
      for (let i=0; i < spans.length; i++)
        spans[i].style.color = pageBgColor;
    };


    // @param int dt time elapsed in milliseconds
    const step = function (dt) {
      accum += dt;

      if (accum < delay)
        return

      let actual = accum - delay;

      while (actual >= options.etchSpeed) {
        _done(index);
        if (etchWidth > 1)
          _done(index + 1);
        index += etchWidth;

        if (index >= spans.length)
          return

        etchWidth = (rng() > 0.5) ? 1 : 2;
        _etch(index);  // set current index to etching
        if (etchWidth > 1)
          _etch(index+1);

        actual -= options.etchSpeed;
        accum -= options.etchSpeed;
      }
    };

    _setup(el.innerText);

    return { setText, step }
  }

  function animationController () {
    const items = [ ];

    let lastTime = Date.now();


    const add = function (item) {
      items.push(item);
    };


    const remove = function (item) {
      for(let i=0; i < items.length; i++)
        if (items[i] === item)
          return items.splice(i, 1)
    };


    const start = function () {
      requestAnimationFrame(_step);
    };


    const _step = function () {
      const now = Date.now();
      const dt = now - lastTime;
      lastTime = now;
      for (let i=0; i < items.length; i++)
        items[i].step(dt);

      requestAnimationFrame(_step);
    };


    return { add, remove, start }
  }

  const anim = animationController();

  const seed = Math.random(); // enables consistent randomness for this session

  const p5 = {
    color: [ 0, 0, 0 ],  // [ r, g, b ]
    duration: 300,
    delay: 200,      // milliseconds to wait before animation starts
    seed
  };

  const headers = document.querySelectorAll('h1,h2');

  for (let i=0; i < headers.length; i++) {
    p5.delay = 120 + Math.floor(50 * Math.random());
    p5.duration = 250 + Math.floor(100 * Math.random());
    anim.add(animateHeader(headers[i], p5));
  }

  const p3 = {
    etchSpeed: 10 + Math.round(Math.random() * 4), // milliseconds/character
    targetBGColor: 'rgb(255,255,255)',
    targetFGColor: 'rgb(40, 40, 40)',
    etchBGColor:   'rgb(62, 62, 62)',
    etchFGColor:   'rgb(255,20,147)',
    seed
  };

  const lis = document.querySelectorAll('li,p');
  for (let i=0; i < lis.length; i++)
    anim.add(animate1(lis[i], p3));

  anim.start();

}());
