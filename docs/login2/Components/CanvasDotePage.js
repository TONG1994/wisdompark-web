

import React from 'react';
let a,
  b;
function Dot(canvas) {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;

  this.vx = -0.5 + Math.random();
  this.vy = -0.5 + Math.random();

  this.radius = Math.random() * 2;

  this.color = new Color();
}
Dot.prototype = {
  draw: function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color.style;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }
};
function Color(min) {
  min = min || 0;
  this.colorValue = function (min) {
    return Math.floor(Math.random() * 255 + min);
  };
  this.createColorStyle = function (r, g, b) {
    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
  };
  this.r = this.colorValue(min);
  this.g = this.colorValue(min);
  this.b = this.colorValue(min);
  this.style = this.createColorStyle(this.r, this.g, this.b);
}

let CanvasDotePage = React.createClass({
  getInitialState: function () {
    return {
      mousePosition: {
        x: 30 * window.innerWidth / 100,
	            y: 30 * window.innerHeight / 100
      },
      dots: {
        nb: 190,
        distance: 100,
        d_radius: 80,
        array: []
      },
      canvas: {},
      ctx: {},

    };
  },

    // 第一次加载
  componentDidMount: function () {
    this.creatCanvas();
    window.addEventListener('resize',this.windowResize)
  },
  windowResize() {
    // this.creatCanvas()
  },
  creatCanvas(){
    let canvas = this.state.canvas;
    let ctx = this.state.ctx;
    let dots = this.state.dots;
  
    canvas = this.refs.canvasDote;
    ctx = canvas.getContext('2d');
  
    canvas.width = window.innerWidth-20;
    canvas.height = window.innerHeight-20;
    ctx.lineWidth = 0.3;
    ctx.strokeStyle = (new Color(150)).style;
    let dotsNomber = 190;
    if (canvas.width < 700) {
      dotsNomber = 80;
    } else if (canvas.width < 1000) {
      dotsNomber = 110;
    }
  
    dots.nb = dotsNomber;
  
    this.state.canvas = canvas;
    this.state.ctx = ctx;
    this.state.dots = dots;
  
    this.createDots();
    a = requestAnimationFrame(this.animateDots.bind(this, canvas, ctx, dots));
  },
  componentWillUnmount() {
    cancelAnimationFrame(a);
    cancelAnimationFrame(b);
    window.removeEventListener('resize',this.windowResize)
  },

  createColorStyle: function (r, g, b) {
    return 'rgba(' + r + ',' + g + ',' + b + ', 0.8)';
  },

  mixComponents: function (comp1, weight1, comp2, weight2) {
    return (comp1 * weight1 + comp2 * weight2) / (weight1 + weight2);
  },

  averageColorStyles: function (dot1, dot2) {
    let color1 = dot1.color,
      color2 = dot2.color;

    let r = this.mixComponents(color1.r, dot1.radius, color2.r, dot2.radius),
      g = this.mixComponents(color1.g, dot1.radius, color2.g, dot2.radius),
      b = this.mixComponents(color1.b, dot1.radius, color2.b, dot2.radius);
    return this.createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
  },


  createDots: function () {
    let dots = this.state.dots;
    let canvas = this.state.canvas;

    for (let i = 0; i < dots.nb; i++) {
      dots.array.push(new Dot(canvas));
    }
  },

  moveDots: function () {
    let canvas = this.state.canvas;
    let dots = this.state.dots;

    for (let i = 0; i < dots.nb; i++) {
      let dot = dots.array[i];

      if (dot.y < 0 || dot.y > canvas.height) {
        dot.vx = dot.vx;
        dot.vy = -dot.vy;
      } else if (dot.x < 0 || dot.x > canvas.width) {
        dot.vx = -dot.vx;
        dot.vy = dot.vy;
      }
      dot.x += dot.vx;
      dot.y += dot.vy;
    }
    this.setState({ canvas: canvas });
  },

  connectDots: function () {
    let dots = this.state.dots;
    let mousePosition = this.state.mousePosition;
    let ctx = this.state.ctx;

    for (let i = 0; i < dots.nb; i++) {
      for (let j = 0; j < dots.nb; j++) {
        let i_dot = dots.array[i];
        let j_dot = dots.array[j];

        if ((i_dot.x - j_dot.x) < dots.distance && (i_dot.y - j_dot.y) < dots.distance && (i_dot.x - j_dot.x) > -dots.distance && (i_dot.y - j_dot.y) > -dots.distance) {
          if ((i_dot.x - mousePosition.x) < dots.d_radius && (i_dot.y - mousePosition.y) < dots.d_radius && (i_dot.x - mousePosition.x) > -dots.d_radius && (i_dot.y - mousePosition.y) > -dots.d_radius) {
            ctx.beginPath();
            ctx.strokeStyle = this.averageColorStyles(i_dot, j_dot);
            ctx.moveTo(i_dot.x, i_dot.y);
            ctx.lineTo(j_dot.x, j_dot.y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }
    this.setState({ dots: dots });
  },

  drawDots: function (ctx, dots) {
    for (let i = 0; i < dots.nb; i++) {
      let dot = dots.array[i];
      dot.draw(ctx);
    }
    this.setState({ ctx: ctx });
  },

  animateDots: function (canvas, ctx, dots) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.moveDots();
    this.connectDots();
    this.drawDots(ctx, dots);

    b = requestAnimationFrame(this.animateDots.bind(this, canvas, ctx, dots));
  },


  onMouseMove: function (e) {
    this.state.mousePosition.x = e.pageX;
	    this.state.mousePosition.y = e.pageY;
    this.setState({ mousePosition: this.state.mousePosition });
  },

  onMouseLeave: function (e) {
    let canvas = this.state.canvas;

    this.state.mousePosition.x = canvas.width / 3;
	    this.state.mousePosition.y = canvas.height / 3;
    this.setState({ mousePosition: this.state.mousePosition });
  },

  render: function () {
    return (
      <div>
        <canvas ref="canvasDote" width="1000px" height="700px" style={{ position: 'absolute' }} onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave} />
      </div>
    );
  }
});

module.exports = CanvasDotePage;
