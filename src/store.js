import { action, computed, decorate, observable } from "mobx";
import { random, takeRight } from "lodash";

const rad = (a) => a * (Math.PI / 180);

class Line {
  depth = 0;
  rotation = 0;
  growth = 0;

  parent = null;
  children = [];

  constructor(p = {}) {
    this.store = p.store;
    this.depth = p.depth || this.depth;
    this.rotation = p.rotation || this.rotation;
    this.growth = p.growth || this.growth;
  }

  get root() {
    return this.depth === 0;
  }

  get leaf() {
    return this.children.length === 0;
  }

  get angle() {
    if (this.root) return 0;

    return this.parent.angle + rad(this.rotation);
  }

  get length() {
    if (this.root) return this.growth;

    return this.parent.length * (1 - 0.002 * this.growth);
  }

  get color() {
    return [
      "#5e4800",
      "#5e4800",
      "#594903",
      "#594f03",
      "#595903",
      "#46910d",
      "#46910d",
      "#24770d",
      "#24770d",
      "#24770d",
      "#24770d",
      "#24770d",
      "#24770d",
    ][this.depth];
  }

  get thickness() {
    return [5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1][this.depth];
  }

  get points() {
    if (this.root) {
      return [
        this.store.midX,
        this.store.minY,
        this.store.midX,
        this.store.minY + this.length,
      ];
    }

    var px = this.parent.points[2];
    var py = this.parent.points[3];
    var nx = -Math.sin(this.angle) * this.length + px;
    var ny = +Math.cos(this.angle) * this.length + py;

    return [px, py, nx, ny];
  }

  get pointsInv() {
    return [
      this.points[0],
      this.store.maxY - this.points[1],
      this.points[2],
      this.store.maxY - this.points[3],
    ];
  }
}

decorate(Line, {
  parent: observable,
  depth: observable,
  children: observable,
  growth: observable,
  points: computed,
  leaf: computed,
  angle: computed,
  length: computed,
  root: computed,
  pointsInv: computed,
  color: computed,
});

class Store {
  lines = [];
  depth = 11;
  growth = 135;
  rotation = 20;

  minX = 0;
  maxX = 0;
  minY = 0;
  maxY = 0;

  get midX() {
    return (this.maxX - this.minX) / 2;
  }

  get midY() {
    return (this.maxY - this.minY) / 2;
  }

  constructor() {
    this.resize();
    this.regen();
  }

  resize = () => {
    this.minX = 0;
    this.maxX = window.innerWidth;
    this.minY = 0;
    this.maxY = window.innerHeight;
  };

  regenKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      this.growth += 5;
      this.regen();
    }

    if (e.key === "ArrowDown") {
      this.growth -= 5;
      this.regen();
    }

    if (e.key === "ArrowRight") {
      this.rotation += 1;
      this.regen();
    }

    if (e.key === "ArrowLeft") {
      this.rotation -= 1;
      this.regen();
    }

    if (e.key === "=" && this.depth < 14) {
      this.depth += 1;
      this.regen();
    }

    if (e.key === "-" && this.depth > 1) {
      this.depth -= 1;
      this.regen();
    }
  };

  regen = (depth, rotation, growth) => {
    this.lines = [
      new Line({ store: this, depth: 0, growth: this.growth, rotation: 0 }),
    ];

    new Array(this.depth - 1).fill(0).forEach((x, i) => {
      this.lines
        .filter((l) => l.leaf)
        .forEach((l) => {
          const nll = new Line({
            store: this,
            depth: i + 1,
            rotation: this.rotation,
            growth: this.growth,
          });
          const nlr = new Line({
            store: this,
            depth: i + 1,
            rotation: -this.rotation,
            growth: this.growth,
          });

          nll.parent = l;
          nlr.parent = l;

          l.children.push(nll);
          l.children.push(nlr);

          this.lines.push(nll);
          this.lines.push(nlr);
        });
    });
  };
}

decorate(Store, {
  depth: observable,
  growth: observable,
  lines: observable,
  maxX: observable,
  maxY: observable,
  midX: computed,
  midY: computed,
  minX: observable,
  minY: observable,
  regen: action,
  regenKeyDown: action,
  resize: action,
  rotation: observable,
});

export default new Store();
