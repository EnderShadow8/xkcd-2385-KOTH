import {runGame, average, sum} from "./controller.js"

const bots = [
  {
    // Example bot
    // He assumes all other bots are greedy and choose 100
    // So he chooses 80
    name: "Simpleton", // Just for fun
    run() {
      return 80
    }
  },
  {
    // Example bot
    // He assumes everyone will choose the same scores as last round
    // So he chooses 80% of the average last round
    name: "LastRounder",
    own: 0, // Setting properties is allowed
    run(scores) {
      // The average of everyone else's score x 0.8
      this.own = (sum(scores) - this.own) / (scores.length - 1) * 0.8
      return this.own
    }
  },
  {
    name: "Calculus",
    isFirstTurn: true,
    run(scores) {
      let ret = this.isFirstTurn ? 70 : (100 + (average(scores)) * 0.8) / 2;
      this.isFirstTurn = false;
      return ret;
    }
  },
  {
    name: "Game Theory is stupid anyway",
    run: _ => 100
  },
  {
    name: "Max",
    max: "max",
    run:(max)=> Math.max(...max)
  },
  {
    name: "Copycat",
    run: (scores) => scores[0] || 0
  },
  {
    name: "SimpleWeighted",
    weights: [0.00127173,0.00308684,0.00533004,0.00794332,0.0108906,0.014147,0.017694,0.0215174,0.0256059,0.0299502,0.0345426,0.0393767,0.0444467,0.0497479,0.055276,0.0610272,0.0669984,0.0731864,0.0795887,0.0862028,0.0930265,0.100058,0.107295,0.114737,0.122381,0.130226,0.138272,0.146516,0.154958,0.163596,0.17243,0.181458,0.190681,0.200096,0.209704,0.219503,0.229493,0.239673,0.250043,0.260602,0.27135,0.282285,0.293409,0.304719,0.316216,0.327899,0.339768,0.351714,0.363722,0.37579,0.387915,0.400095,0.412327,0.424607,0.436934,0.449305,0.461717,0.474168,0.486655,0.499176,0.511728,0.524308,0.536915,0.549546,0.562198,0.57487,0.587558,0.60026,0.612975,0.625698,0.638429,0.651165,0.663904,0.676642,0.689378,0.70211,0.714834,0.72755,0.740253,0.752943,0.765616,0.77827,0.790903,0.803512,0.816095,0.82865,0.841174,0.853664,0.866118,0.878534,0.890908,0.903239,0.915524,0.92776,0.939945,0.952075,0.964149,0.976163,0.988114,1.],
    run() {
        let rand = Math.random();
        return 1+this.weights.findIndex(w => w >= rand);
    }
  },
  {
    name: "SimpleCalculus",
    run: _ => 250 / 3,
  },
  {
    name:"40",
    run:_=>40
  },
  {
    name: "Random_50_90", 
    run() {
      return 50 + Math.random() * 40
    }
  }
]

runGame(bots, 100, true)
