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
  },
  {
    name: "Fourier",
    sin: [0,0,0,0,0,0],
    cos: [0,0,0,0,0,0],
    round: 0,
    
    run(scores) {
      let ave = average(scores)
      
      for (let i = 0; i < 6; i++) {
        this.sin[i] += ave * Math.sin(2*Math.PI * this.round / (i+1))
        this.cos[i] += ave * Math.cos(2*Math.PI * this.round / (i+1))
      }
      
      this.round++
      
      let next = this.sin.reduce((t,a,i) => t + a * Math.sin(2*Math.PI * this.round / (i+1)),0)
               + this.cos.reduce((t,a,i) => t + a * Math.cos(2*Math.PI * this.round / (i+1)),0)
      
      return 50 + 2/5 * Math.max(next,0) / this.round
    }
  },
  {
    name: "Balanced Strategy",
    next: 0,
    run() { return this.next++ % 101 }
  },
  {
    name: "Rude Random",
    run(scores) {
      if (!this.score) {
        this.score = Math.random() > 0.5 ? 1 : 100;
      }
      return this.score;
    }
  },
  {
    name: "Bandwagon",
    run: (scores) => {
        let counts = [];
        for (let radius = 1; Math.max(...counts.slice(50)) * 20 < scores.length; radius++) {
            for (let i = 50; i <= 80; i++) {
                counts[i] = +scores.map((x) => Math.abs(x - i) <= radius).reduce((x,y) => x+y);
            }
        }
        return (counts.indexOf(Math.max(...counts.slice(50))) + 1 || 253 / 3) - 1;
    }
  },
  {
    name: "Rebel",
    counts: Array(31).fill(0),
    run(scores) {
        scores.filter((x) => x <= 80 && x >= 50).forEach((x) => this.counts[x-50]++);
        return this.counts.lastIndexOf(Math.min(...this.counts)) + 50;
    }
  },
  {
    name: "Fuzzy Eid",
    prev: NaN,
    map: new Array(100).map(()=>new Array(100).fill(0)),
    scale: (scalar, vec) => vec.map(x=>scalar*x),
    vec_plus(lhs, rhs) {
      let result = lhs.slice();
      for(var index=0; index<result.length; ++index) result[index]+=rhs[index];
      return result
    },
    wts:
      new Array(100).map((_, index) => 
        sum(new Array(100).map((_, avg) => 
          Math.exp(-Math.pow(avg - index,2))
        ))
      ),
    run(scores) {
      if(isNaN(this.prev)) return 250/3;
      const avg = Math.round(average(scores)) - 1;
      ++this.map[prev][avg];
      this.prev = avg;
      //prob dist=sum_recordings{e^-(recording - avg)^2*(prob dist inferred from record)}/(sum of e^-(recording - avg)^2)
      //wts[avg]=sum of e^-(recording - avg)^2
      const dist = this.scale(1/this.wts[avg], this.map.map((outpts, index) => 
        this.scale(Math.exp(-Math.pow(avg - index,2)) / sum(outpts), outpts)).reduce(this.vec_plus));
      return 100 + 0.4*sum(dist.map((p,n)=>p*n))
    }
  },
  (() => {
    function *stateMachine() {
        let left = 1;
        let right = 100;
        
        yield 51;
        
        let counter = 0;
        
        while (true) {
            counter++;
        
            const middle = left + (right - left) / 2;
            
            if (counter % 10 === 0) {
                left = Math.max(1, Math.random() * 100);
                right = Math.max(1, Math.random() * 100);
                
                if (left > right) [left, right] = [right, left];
            }
            
            const scores = yield middle;
            scores.sort((a, b) => a - b);
            
            let countLower = 0;
            let countHigher = 0;
            
            for (const score of scores) if (score < middle) countLower++;
            for (const score of scores) if (score > middle) countHigher++;
            
            if (countLower > countHigher) {
                right = middle;
            } else {
                left = middle;
            }
        }
    };
    
    const iterator = stateMachine();
    let score = iterator.next().value;

    return {
        name: "USACO (Unofficial)",
        run: scores => {
            const oldScore = score;
            score = iterator.next(scores).value;
            return oldScore;
        }
    };
  })(),
  {
    name: "AverageAverage",
    avgLog: [],
    isFirstRound: true,
    gmean(a, b) {
      return Math.sqrt(a * b);
    },
    scoreForAvg(avg) {
      let delta = 100;
      let score = 100;
      let newScore = 0;
      while (delta > 0.05) {
        newScore = this.gmean(score, 100 - Math.abs((avg * 0.8) - score));
        delta = Math.abs(score - newScore);
        score = newScore;
      }
      return score;
    },
    run(scores) {
      if (this.isFirstRound) {
        this.isFirstRound = false;
        return 73;
      }
      this.avgLog.push(average(scores));
      let avgavg = average(this.avgLog);
      return this.scoreForAvg(avgavg);
    }
  },
  {
    name: "getRandomNumber",
    run() {
        return 4 // chosen by fair dice roll.
                 // guaranteed to be random.
    }
  },
  // {
  //   name: "iDontWannaFail",
  //   run: (scores) => {
  //       let sum = scores.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
  //       let avg = (sum / scores.length) || 0;
  //       let output = avg * 0.8 + Math.round(Math.random()*11)-5;
  //       if (avg > 60) {
  //           if (output < 70) {
  //               output = Math.floor(Math.random * 30) + 70;
  //           }
  //       }
  //       else {
  //           if (avg > 25) {
  //               output = Math.round(Math.random * avg / 1.5) + avg; // Worst case is 49.
  //           }
  //           else {
  //               output = Math.round(3.75 * avg); // Decent results unless avg is very low
  //           }
  //       }
  //       if (output > 100) {
  //           output = 100;
  //       }
  //       return output;
  //   }
  // },
  {
    name: "Greedy",
    run(scores){
      var max_index = (arr => arr.indexOf(Math.max.apply(Math, arr)));
      var point = (avg) => {
        return (s) => Math.sqrt(s*(100-Math.abs(0.8*avg-s)))
      }
      var goal = (scores) => {
        return (mine) => {
          var avg = average(scores.concat([mine]));
          return point(avg)(mine) - Math.max(...scores.map((v,i)=>point(avg)(v)));
        }
      } 
  
      var avg = average(scores);
      var range = Array(101).fill().map((_,i)=>i);
      return range[max_index(range.map((v,i) => goal(scores)(v)))];
    }
  },
  {
    name: "Chain estimator",
    bin_n: 25,
    history_len: 2,
    avg_history: null,
    table: {},
    run(scores) {
      var weighted_mean = (values, weights) => {
        const result = values
          .map((value, i) => {
            const weight = weights[i]
            const sum = value * weight
            return [sum, weight]
          })
          .reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0])
      
        return result[0] / result[1]
      };
      
      var avg = average(scores);
      var bin_n = this.bin_n;
      var bin_w = 100/bin_n;
  
      if(this.avg_history === null){
        this.avg_history = Array(this.history_len).fill();
      }
  
      if(this.avg_history[0] === null){
        var out = 50 + 0.4*avg;
  
        // updates history
        this.avg_history = this.avg_history.slice(1).concat([avg])
  
        return Math.min(Math.max(Math.round(out),1),100);
      }else{
        // gets the "bins"
        var bin = (v => Math.max(Math.ceil(v/bin_w)-1, 0));
        var bins = this.avg_history.map(bin);
        var bin_cur = bin(avg);
  
        // updates the table
        for (state in this.table) {
          this.table[state] = this.table[state].map((v,i)=>v*0.95);
        }
        if(!(bins in this.table)){
          this.table[bins] = Array(bin_n).fill(1);
        }
        this.table[bins][bin_cur] += 1;
        
        // estimates the avg
        var state = bins.slice(1).concat([bin_cur]);
        var mids = Array(bin_n).fill().map((_,i) => (i+.5)*bin_w);
        if(!(state in this.table)){
          this.table[state] = Array(bin_n).fill(.1);
        }
        var avg_est = weighted_mean(mids, this.table[state].map((v,i)=>Math.pow(v,5)));
        var out = 50 + 0.4*avg;
  
        // updates history
        this.avg_history = this.avg_history.slice(1).concat([avg])
  
        return Math.min(Math.max(Math.round(out),1),100);
      }
    }
  },
  {
    name: "That mean average Joe",
    Joe: [],
    run( scores ) {
      this.Joe.push(average(scores)); // like.no.one(ever(did));
      return average(this.Joe)*1.1111111111111111;
    }
  },
  {
    name: "LuckyDiceKid",
    run(_scores) {
      let total = 0;
      let values = [];
      for (let i = 0; i < 7; i++) {
        let curr = Math.floor(Math.random() * 20) + 1;
        values.push(curr);
        total += curr;
      }
      values.sort((x, y) => (x - y));
      total -= (values[0] + values[1]);
      return total;
    }
  },
  {
    name: "Rick",
    seed: `We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinking of
You wouldn't get this from any\``,
    position: -1,

    run() { 
      // increment position until a letter is found
      do {
        this.position++;

        if (this.position >= this.seed.length){
          // reset position back to the start
          this.position = 0;
        }
      } while (this.seed[this.position] < 'A' || this.seed[this.position] > 'z');

      // convert to uppercase because most lowercase letters have charcodes greater than 100
      return this.position && this.seed[this.position].toUpperCase().charCodeAt();
    }
  },
  {
    name: "IQbot_0.4 the terasentient xd",
    histogram_bins: [...Array(101)].map(()=>0),
    mark: null,
    linear_history: [],
    last_choice: 0,
    n_rounds: 0,
    last_SCA: 0,
    mark_weight: 20,
    mark_prediction: 0,
    linear_weight: 20,
    linear_prediction: 0,
    copycat_weight: 0,
    copycat_prediction: 0,
    run(scores) {
        this.n_rounds++;
        scores = scores.filter((x)=> 100 >= x && x > 0);
        let n_bots = scores.length;
        let c = 1 - 0.4/n_bots
        for (let i = 0; i < n_bots; i++) {
            this.histogram_bins[Math.round(scores[i])]++;
        }
        //THE SIMP DETECTOR
        let simps = [];
        for (let i = 0; i < 101; i++) {
            if (this.histogram_bins[i] > this.n_rounds) {
                simps.push(i);
            }
        }

        //Idk this shouldn't happen but I'm not risking anything
        while (scores.length - simps.length - 1 <= 0) simps.pop();

        if (this.n_rounds == 1) {
            this.mark = Array(201);
            for (let i = 0; i < 201; i++) {
                this.mark[i] = Array(201);
                for (let j = 0; j < 201; j++) {
                    this.mark[i][j] = 0;
                }
            }
            for (let i = 0; i < 201; i++) {
                this.mark[i][i]++;
            }
        }

        let simp_corrected_avg = (sum(scores) - this.last_choice - sum(simps)) / (scores.length - 1 - simps.length);
        let quantized_avg = Math.round(2*simp_corrected_avg);
        this.mark[Math.round(2*this.last_SCA)][quantized_avg]++;
        this.last_SCA = simp_corrected_avg;

        if (this.n_rounds == 1) {
            this.last_choice = 77;
            return 77;
        }
        
        this.linear_history.push(simp_corrected_avg);

        // Update weights based on who was right
        let linear_error  = Math.exp(-Math.abs(this.linear_prediction  - simp_corrected_avg));
        let mark_error    = Math.exp(-Math.abs(this.mark_prediction    - simp_corrected_avg));
        let copycat_error = Math.exp(-Math.abs(this.copycat_prediction - simp_corrected_avg));
        let total_errors = linear_error + mark_error + copycat_error;
        this.linear_weight += linear_error / total_errors;
        this.mark_weight += mark_error / total_errors;
        this.copycat_weight += copycat_error / total_errors;

        this.linear_weight  *= 0.99;
        this.mark_weight    *= 0.99;
        this.copycat_weight *= 0.99;
        
        // Compute a markov chain prediction
        let x_half_filter = 8;
        let y_half_filter = 1;
        
        let probability_sum = 0;
        let probability_moment = 0;

        for (let option = 1; option < 201; option++) {
            for (let x = -x_half_filter; x <= x_half_filter; x++) {
                for (let y = -y_half_filter; y <= y_half_filter; y++) {
                    let X = Math.max(Math.min(quantized_avg + x, 200), 0);
                    let Y = Math.max(Math.min(option + y, 200), 0);
                    let probability = this.mark[X][Y] * (Math.pow(2, -(X-quantized_avg)*(X-quantized_avg)-(Y-option)*(Y-option)));
                    probability_sum += probability;
                    probability_moment += option / 2 * probability;
                }
            }
        }

        this.mark_prediction = probability_moment / probability_sum;
        
        for (let i = 0; i < 201; i++) {
            for (let j = 0; j < 201; j++) {
                this.mark[i][j] *= 0.999
            }
        }

        // Compute a linear regression
        if (this.linear_history.length > 3) {
            if (this.linear_history.length > 10) {
                this.linear_history.shift();
            }
            let x_avg = (this.linear_history.length - 1) / 2
            let y_avg = average(this.linear_history);
            let S_xx = 0;
            let S_xy = 0;
            for (let x = 0; x < this.linear_history.length; x++) {
                S_xx += (x - x_avg) ** 2;
                S_xy += (x - x_avg) * (this.linear_history[x] - y_avg);
            }
            let b = S_xy / S_xx
            let a = y_avg - b * x_avg;
            this.linear_prediction = a + b / this.linear_history.length;
        } else {
            this.linear_prediction = simp_corrected_avg;
        }

        // Compute what everyone else does
        let counts = [];
        for (let radius = 1; Math.max(counts) < 0.05 * scores.length; radius++) {
            for (let i = 50; i <= 90; i++) {
                counts[i] = 0;
                for (let j = 0; j < n_bots; j++) if (Math.abs(scores[j] - i) <= radius) counts[i]++;
            }
        }
        this.copycat_prediction = (counts.indexOf(Math.max(counts.slice(50))) * c - 50) / 0.4 * n_bots/(n_bots-1);

        let expected_unsimp_average = (
            this.mark_prediction * this.mark_weight + 
            this.linear_prediction * this.linear_weight + 
            this.copycat_prediction * this.copycat_weight
        ) / (this.mark_weight + this.linear_weight + this.copycat_weight);

        let expected_average = (expected_unsimp_average * (n_bots - 1 - simps.length) + sum(simps)) / (n_bots - 1);

        // We don't want to give out bad values, now do we
        this.last_choice = Math.max(1, Math.min(100, (50 + 0.4 * expected_average * (n_bots-1)/n_bots)/c));
        return this.last_choice;
    }
  },
  {
    name: "WouldaShoulda",
    ownLast: 0,
    isFirst: true,
    run(scores) {
      if (this.isFirst) {
        this.isFirst = false
        this.ownLast = 80
      } else {
        let count = scores.length
        let otherAvg = (sum(scores) - this.ownLast) / (count - 1)
        this.ownLast = (80 * count + otherAvg * count - otherAvg) / (2 * count - 1)
      }
      return this.ownLast
    }
  }
]

runGame(bots)
