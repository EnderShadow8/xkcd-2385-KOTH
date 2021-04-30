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
  },
  {
    name: "Sam",
    flag_first_turn: true,
    last_own: 100,
    
    // Helper function that calculates the score based on the own CS score,
    // the sum of the other bots' scores, and the number of bots
    compute_score(cs_score, total_others, n_bots) {
        return cs_score*(100-Math.abs(cs_score-0.8*(cs_score+total_others)/n_bots))        
    },
    

    // Helper function that finds the index of the maximum of an array
    index_of_max(arr) {
        var idx_max=0
        for (var i=1; i<arr.length; i++) {
            if (arr[i]>arr[idx_max]) idx_max=i
        }
        return idx_max
    },
        
        
    // Main function
    run(cs_scores) {
        if (this.flag_first_turn) {
            this.flag_first_turn=false
            this.last_own=100
            return 100;
        }
        
        // Number of bots
        var n=cs_scores.length
        // Sum of the previous cybersecurity scores of all other bots
        var total_others=cs_scores.reduce(function(a,b){return a+b},0)-this.last_own
            
            // We find all special points (edge, singular and stationary points) of the function compute_score
                
        // One singular point is the point where our output score becomes
        // equal to 0.8 times the average of all scores (including ours)
        var out_avg=0.8*total_others/(n-0.8)
        var score_avg=this.compute_score(out_avg, total_others, n)       
        
        // 100 is an extreme point
        var out_100=100
        var score_100=this.compute_score(out_100, total_others, n)
        
        // If out_up>out_avg, there is a stationary point (derivative 0) at out_up
        var out_up=Math.min(100, (100*n+0.8*total_others)/(2*n-1.6))
        var score_up
        if (out_up<out_avg) {
            out_up=0   
            score_up=0
        } else {
            score_up=this.compute_score(out_up, total_others, n)
        }
        
        // If out_down<out_avg, there is a stationary point (derivative 0) at out_down
        var out_down=Math.max(1, (100*n-0.8*total_others)/(2*n-1.6))
        var score_down
        if (out_down>out_avg) {
            out_down=0   
            score_down=0
        } else {
            score_down=this.compute_score(out_down, total_others, n) 
        }
        
        // find maximum score among the special points
        var extr_outputs=[out_100, out_up, out_avg, out_down]
        var extr_scores=[score_100, score_up, score_avg, score_down]
        
        var idx_max=this.index_of_max(extr_scores)
        
        this.last_own=extr_outputs[idx_max]
        return this.last_own
    }
  },
  {
    name: "Crb",
    run() { return 1 }
  },
  {
    name: "MidHighPlusOne",
    run(scores) {
        let highScores = scores.filter(s => s >= average(scores) * 0.8).sort((a,b)=>a-b);
        return Math.min(highScores[Math.floor(highScores.length/2)]+1, 100) || 100
    }
  },
  {
    name: "FunnyNumber",
    run() { return 69 }
  },
  {
    // Figure out which bot had the highest combined score last round
    // Then do what they did
    name: "FollowTheLeader",
    firstRound: true,
    findCombinedScore(cyberScore, avgCyberScore) {
      const gameTheoryScore = 100 - Math.abs(avgCyberScore * 0.8 - cyberScore)
      return Math.sqrt(cyberScore * gameTheoryScore);
    },
    run(scores) {
      if (this.firstRound) {
        this.firstRound = false;
        return 60;
      }
  
      const avg = average(scores);
      const combinedScores = scores.map((score) => this.findCombinedScore(score, avg));
      const combinedWinnerIndex = combinedScores.indexOf(Math.max(...combinedScores));
      return scores[combinedWinnerIndex]
    }
  },
  {
    name: "Ans",
    run() { return 42 }
  },
  {
    name: "Everything so far",
    moves: [],
    run(scores){
      if(scores) {
        this.moves = this.moves.concat(scores);
        return this.moves.reduce((a,b)=>a+b)/this.moves.length;
      } 
      return 80;
    }
  },
  {
    name: "Histogrammer",
    bins: [...Array(101)].map(()=>0),
    rounds: 0,
    
    run(scores) {
      this.bins[Math.round(average(scores))]++
      this.rounds++
      
      return 50 + this.bins.reduce((t,p,n) => t + p * n, 0) * 2/5 / this.rounds
    }
  },
  {
    name: "Linear Extrapolator",
    iteration: 0,
    average1: 0,
    average2: 0,
    minAverage: 0,
    maxAverage: 0,
    run(scores) {
        this.iteration++;
        if (this.iteration == 1) {
            return 77;
        }
        if (this.iteration == 2) {
            this.average2 = average(scores);
            this.minAverage = this.average2;
            this.maxAverage = this.average2;
            return 50 + this.average2 * 0.4;
        }
        this.average1 = this.average2;
        this.average2 = average(scores);
        let extrapolatedAverage = this.average2 + this.average2 - this.average1;

        this.minAverage = Math.min(this.minAverage, this.average2);
        this.maxAverage = Math.max(this.maxAverage, this.average2);
        extrapolatedAverage = Math.max(extrapolatedAverage, this.minAverage);
        extrapolatedAverage = Math.min(extrapolatedAverage, this.maxAverage);

        return 50 + extrapolatedAverage * 0.4;
    }
  },
  {
    name:"LetsMakeADeal",
    run() {return 90 + 1}
  },
  {
    name: "Optimise Mean",
    run(scores) {
      const avg = scores ? scores.reduce((a,b)=>a+b) / scores.length : 80;
      return .4*avg+50;
    }
  },
  {
    name: "Chasing Ninety",
    myLastGuess: 84,
    numRounds: 0,
    run(scores) {
        this.numRounds++;
        if (this.numRounds <= 1) {
            return this.myLastGuess;
        }

        let avg = average(scores);
        let difference = this.myLastGuess - (avg * 0.9);
        let adjustment = difference / Math.log2(this.numRounds);
        this.myLastGuess = this.myLastGuess - adjustment;
        return this.myLastGuess;
    }
  },
  {
    name: "Smartleton",
    round: 0,
    run(scores) { return this.round++ ? 80 : 78 }
  },
  {
    name: "90ies",
    run() {return 90}
  },
  {
    name: "The Thrasher",
    runcount: 0,
    run() {
      this.runcount += 1;
      return this.runcount % 2 == 0 ? 82 : 0;
    }
  },
  {
    name : "Squidward",
    log : [],
    delta : [],
    
    run(scores) {
      if(scores){
        let average_score = sum(scores) / scores.length;
        this.log.push(average_score)
        if(this.log.length > 1){ 
          this.delta.push(this.log[this.log.length-1]-this.log[this.log.length - 2])
          let average_delta = sum(this.delta) / this.delta.length;
          return (100 + average_score*.8 + average_delta)/2
        } else if(this.log.length == 1){
          return (100 + average_score*.8)/2
        }
      } else {
        return 90
      }
    }
  },
  {
    name: 'ExponentialMovingAverage',
    prev: 80,
    run(scores) { return (scores && scores.length ? average(scores) : 80) * 0.225 + this.prev * 0.775 },
  },
  {
    name: "7-ELEVEn",
    run() { return 77 }
  },
  // {
  //   name: "LumberJack",
  //   scoresLog: [],
  //   run(scores) {
  //       if(!scores)  {this.scoresLog.push(80);return 80;}
  //       const avgScore = average(scores);
  //       this.scoresLog.push(avgScore);
  //       const avgScoresLog = average(this.scoresLog)
  //       const top = this.scoresLog.map((score, index) => (score-avgScoresLog)*0.5*index);
  //       const bottom = this.scoresLog.map(score=> (score-avgScoresLog)**2)
  //       return Math.max(80, this.scoresLog.length*(sum(top)/sum(bottom)));
  //   }
  // },
  {
    name: "Elevens",
    run() { return (Math.floor(Math.random() * (10 - 1) ) + 1) * 11; }
  },
  {
    name: "Near-stable",
    run: s => {
      return 50 + 0.4*s.reduce((a, b) => a + b, 0)/s.length;
    }
  }
]

runGame(bots)
