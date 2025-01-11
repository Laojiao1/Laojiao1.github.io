"use strict";

function updateCoords(e) {
    pointerX = (e.clientX || e.touches[0].clientX) - canvasEl.getBoundingClientRect().left;
    pointerY = e.clientY || e.touches[0].clientY - canvasEl.getBoundingClientRect().top;
}

function setParticuleDirection(e) {
    var t = anime.random(0, 360) * Math.PI / 180;
    var a = anime.random(50, 180);
    var n = [-1, 1][anime.random(0, 1)] * a;
    return { x: e.x + n * Math.cos(t), y: e.y + n * Math.sin(t) };
}

function createParticule(e, t) {
    var a = {};
    a.x = e;
    a.y = t;
    a.color = colors[anime.random(0, colors.length - 1)];
    a.radius = anime.random(16, 32);
    a.endPos = setParticuleDirection(a);
    a.draw = function() {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = a.color;
        ctx.fill();
    };
    return a;
}

function createCircle(e, t) {
    var a = {};
    a.x = e;
    a.y = t;
    a.color = "#F00";
    a.radius = 0.1;
    a.alpha = 0.5;
    a.lineWidth = 6;
    a.draw = function() {
        ctx.globalAlpha = a.alpha;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = a.lineWidth;
        ctx.strokeStyle = a.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
    };
    return a;
}

function renderParticule(e) {
    for (var t = 0; t < e.animatables.length; t++) {
        e.animatables[t].target.draw();
    }
}

function animateParticules(e, t) {
    var a = createCircle(e, t);
    var n = [];
    for (var i = 0; i < numberOfParticules; i++) {
        n.push(createParticule(e, t));
    }
    anime.timeline()
        .add({
            targets: n,
            x: function(e) { return e.endPos.x; },
            y: function(e) { return e.endPos.y; },
            radius: 0.1,
            duration: anime.random(1200, 1800),
            easing: "easeOutExpo",
            update: renderParticule
        })
        .add({
            targets: a,
            radius: anime.random(80, 160),
            lineWidth: 0,
            alpha: { value: 0, easing: "linear", duration: anime.random(600, 800) },
            duration: anime.random(1200, 1800),
            easing: "easeOutExpo",
            update: renderParticule,
            offset: 0
        });
}

function debounce(e, t) {
    var a;
    return function() {
        var n = this, i = arguments;
        clearTimeout(a);
        a = setTimeout(function() {
            e.apply(n, i);
        }, t);
    };
}

var canvasEl = document.querySelector(".fireworks");
if (canvasEl) {
    var ctx = canvasEl.getContext("2d");
    var numberOfParticules = 30;
    var pointerX = 0, pointerY = 0;
    var tap = "mousedown";
    var colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];

    var setCanvasSize = debounce(function() {
        canvasEl.width = 2 * window.innerWidth;
        canvasEl.height = 2 * window.innerHeight;
        canvasEl.style.width = window.innerWidth + "px";
        canvasEl.style.height = window.innerHeight + "px";
        canvasEl.getContext("2d").scale(2, 2);
    }, 500);

    var render = anime({
        duration: 1 / 0,
        update: function() {
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        }
    });

    document.addEventListener(tap, function(e) {
        if (e.target.id !== "sidebar" && e.target.id !== "toggle-sidebar" &&
            e.target.nodeName !== "A" && e.target.nodeName !== "IMG") {
            render.play();
            updateCoords(e);
            animateParticules(pointerX, pointerY);
        }
    }, false);

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize, false);
}
