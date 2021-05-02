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
    name:"40",
    run() {
      return 40
    }
  },
  {
    name: "Copycat",
    run: (scores) => scores[0] || 1
  },
  {
    name: "Calculus",
    isFirstTurn: true,
    run(scores) {
      let ret = this.isFirstTurn ? 70 : (100 + (average(scores)) * 0.8) / 2
      this.isFirstTurn = false
      return ret
    }
  },
  {
    name: "Max",
    max: "max",
    run:(max)=> Math.max(...max)
  },
  {
    name: "Game Theory is stupid anyway",
    run: _ => 100
  },
  // {
  //   name: "SimpleWeighted",
  //   weights: (E => {
  //     let csum = [...Array(101).keys()].map((s=>n=> s+=Math.sqrt(x*(100-Math.abs(4/5*E-x))))(0))
  //     return csum.map(x => 1 - x / csum[100])
  //   })(58.863975225),
  //   run() {
  //     let rand = Math.random()
  //     return 1+this.weights.findIndex(w => rand >= w)
  //   }
  // },
  {
    name: "Random_50_90",
    run() {
      return 50 + Math.random() * 40
    }
  },
  {
    name: "SimpleCalculus",
    run: _ => 250 / 3,
  },
  {
    name: "Everything so far",
    moves: [],
    run(scores){
      if(scores) {
        this.moves = this.moves.concat(scores)
        return this.moves.reduce((a, b)=>a+b)/this.moves.length
      }
      return 80
    }
  },
  {
    name: "Crb",
    run() {
      return 1
    }
  },
  {
    name: "Ans",
    run() {
      return 42
    }
  },
  {
    name: "FunnyNumber",
    run() {
      return 69
    }
  },
  {
    name: "Elevens",
    run() {
      return (Math.floor(Math.random() * (10 - 1) ) + 1) * 11
    }
  },
  {
    name: "90ies",
    run() {
      return 90
    }
  },
  {
    name: "MidHighPlusOne",
    run(scores) {
      let highScores = scores.filter(s => s >= average(scores) * 0.8).sort((a, b)=>a-b)
      return Math.min(highScores[Math.floor(highScores.length/2)]+1, 100) || 100
    }
  },
  {
    name: "7-ELEVEn",
    run() {
      return 77
    }
  },
  {
    name: "Optimise Mean",
    run(scores) {
      const avg = scores ? scores.reduce((a, b)=>a+b) / scores.length : 80
      return 0.4*avg+50
    }
  },
  {
    name: "LumberJack",
    scoresLog: [],
    upperQuartile(scores) {
      return scores.sort((a, b) => a - b)[Math.floor(scores.length*0.75)]
    },
    run(scores) {
      if(!scores)  {
        this.scoresLog.push(80);return 80
      }
      const upperQScore = this.upperQuartile(scores)
      this.scoresLog.push(upperQScore)
      this.scoresLog = this.scoresLog.slice(-4)

      const avgScoresLog = average(this.scoresLog)
      const top = this.scoresLog.map((score, index) => (score-avgScoresLog)*0.5*index)
      const bottom = this.scoresLog.map((score, index) => (index-scores.length)**2)
      const intercept = this.scoresLog[0]-(sum(top)/sum(bottom))
      const predicted = this.scoresLog.length*(sum(top)/sum(bottom))+intercept
      return Math.min(100, predicted)
    }
  },
  {
    name:"LetsMakeADeal",
    run() {
      return 90 + 1
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
      let idx_max=0
      for (let i=1; i<arr.length; i++) {
        if (arr[i]>arr[idx_max]) {
          idx_max=i
        }
      }
      return idx_max
    },


    // Main function
    run(cs_scores) {
      if (this.flag_first_turn) {
        this.flag_first_turn=false
        this.last_own=100
        return 100
      }

      // Number of bots
      let n=cs_scores.length
      // Sum of the previous cybersecurity scores of all other bots
      let total_others=cs_scores.reduce(function(a, b){
        return a+b
      }, 0)-this.last_own

      // We find all special points (edge, singular and stationary points) of the function compute_score

      // One singular point is the point where our output score becomes
      // equal to 0.8 times the average of all scores (including ours)
      let out_avg=0.8*total_others/(n-0.8)
      let score_avg=this.compute_score(out_avg, total_others, n)

      // 100 is an extreme point
      let out_100=100
      let score_100=this.compute_score(out_100, total_others, n)

      // If out_up>out_avg, there is a stationary point (derivative 0) at out_up
      let out_up=Math.min(100, (100*n+0.8*total_others)/(2*n-1.6))
      let score_up
      if (out_up<out_avg) {
        out_up=0
        score_up=0
      } else {
        score_up=this.compute_score(out_up, total_others, n)
      }

      // If out_down<out_avg, there is a stationary point (derivative 0) at out_down
      let out_down=Math.max(1, (100*n-0.8*total_others)/(2*n-1.6))
      let score_down
      if (out_down>out_avg) {
        out_down=0
        score_down=0
      } else {
        score_down=this.compute_score(out_down, total_others, n)
      }

      // find maximum score among the special points
      let extr_outputs=[out_100, out_up, out_avg, out_down]
      let extr_scores=[score_100, score_up, score_avg, score_down]

      let idx_max=this.index_of_max(extr_scores)

      this.last_own=extr_outputs[idx_max]
      return this.last_own

    }
  },
  {
    name: "ExponentialMovingAverage",
    prev: 80,
    run(scores) {
      return (scores && scores.length ? average(scores) : 80) * 0.225 + this.prev * 0.775
    },
  },
  {
  // Figure out which bot had the highest combined score last round
  // Then do what they did
    name: "FollowTheLeader",
    firstRound: true,
    findCombinedScore(cyberScore, avgCyberScore) {
      const gameTheoryScore = 100 - Math.abs(avgCyberScore * 0.8 - cyberScore)
      return Math.sqrt(cyberScore * gameTheoryScore)
    },
    run(scores) {
      if (this.firstRound) {
        this.firstRound = false
        return 60
      }

      const avg = average(scores)
      const combinedScores = scores.map((score) => this.findCombinedScore(score, avg))
      const combinedWinnerIndex = combinedScores.indexOf(Math.max(...combinedScores))
      return scores[combinedWinnerIndex]
    }
  },
  {
    name: "Chasing Ninety",
    myLastGuess: 84,
    numRounds: 0,
    run(scores) {
      this.numRounds++
      if (this.numRounds <= 1) {
        return this.myLastGuess
      }

      let avg = average(scores)
      let difference = this.myLastGuess - (avg * 0.9)
      let adjustment = difference / Math.log2(this.numRounds)
      this.myLastGuess = this.myLastGuess - adjustment
      return this.myLastGuess
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
      this.iteration++
      if (this.iteration == 1) {
        return 77
      }
      if (this.iteration == 2) {
        this.average2 = average(scores)
        this.minAverage = this.average2
        this.maxAverage = this.average2
        return 50 + this.average2 * 0.4
      }
      this.average1 = this.average2
      this.average2 = average(scores)
      let extrapolatedAverage = this.average2 + this.average2 - this.average1

      this.minAverage = Math.min(this.minAverage, this.average2)
      this.maxAverage = Math.max(this.maxAverage, this.average2)
      extrapolatedAverage = Math.max(extrapolatedAverage, this.minAverage)
      extrapolatedAverage = Math.min(extrapolatedAverage, this.maxAverage)

      return 50 + extrapolatedAverage * 0.4
    }
  },
  {
    name: "Near-stable",
    run: s => {
      return 50 + 0.4*s.reduce((a, b) => a + b, 0)/s.length
    }
  },
  {
    name: "The Thrasher",
    runcount: 0,
    run() {
      this.runcount += 1
      return this.runcount % 2 == 0 ? 82 : 0
    }
  },
  {
    name: "Histogrammer",
    bins: [...Array(101)].map(()=>0),
    rounds: 0,

    run(scores) {
      this.bins[Math.round(average(scores))]++
      this.rounds++

      return 50 + this.bins.reduce((t, p, n) => t + p * n, 0) * 2/5 / this.rounds
    }
  },
  {
    name: "Smartleton",
    round: 0,
    run(scores) {
      return this.round++ ? 80 : 78
    }
  },
  {
    name : "Squidward",
    log : [],
    delta : [],

    run(scores) {
      if(scores){
        let average_score = sum(scores) / scores.length
        this.log.push(average_score)
        if(this.log.length > 1){
          this.delta.push(this.log[this.log.length-1]-this.log[this.log.length - 2])
          let average_delta = sum(this.delta) / this.delta.length
          return (100 + average_score*0.8 + average_delta)/2
        } else if(this.log.length == 1){
          return (100 + average_score*0.8)/2
        }
      } else {
        return 90
      }
    }
  },
  {
    name: "Fourier",
    sin: [0, 0, 0, 0, 0, 0],
    cos: [0, 0, 0, 0, 0, 0],
    round: 0,

    run(scores) {
      let ave = average(scores)

      for (let i = 0; i < 6; i++) {
        this.sin[i] += ave * Math.sin(2*Math.PI * this.round / (i+1))
        this.cos[i] += ave * Math.cos(2*Math.PI * this.round / (i+1))
      }

      this.round++

      let next = this.sin.reduce((t, a, i) => t + a * Math.sin(2*Math.PI * this.round / (i+1)), 0)
             + this.cos.reduce((t, a, i) => t + a * Math.cos(2*Math.PI * this.round / (i+1)), 0)

      return 50 + 2/5 * Math.max(next, 0) / this.round
    }
  },
  {
    name: "Balanced Strategy",
    next: 0,
    run() {
      return this.next++ % 101
    }
  },
  {
    name: "Rude Random",
    run(scores) {
      if (!this.score) {
        this.score = Math.random() > 0.5 ? 1 : 100
      }
      return this.score
    }
  },
  {
    name: "Bandwagon",
    run: (scores) => {
      let counts = []
      for (let radius = 1; Math.max(...counts.slice(50)) * 20 < scores.length; radius++) {
        for (let i = 50; i <= 80; i++) {
          counts[i] = +scores.map((x) => Math.abs(x - i) <= radius).reduce((x, y) => x+y)
        }
      }
      return (counts.indexOf(Math.max(...counts.slice(50))) + 1 || 253 / 3) - 1
    }
  },
  {
    name: "Rebel",
    counts: Array(31).fill(0),
    run(scores) {
      scores.filter((x) => x <= 80 && x >= 50).forEach((x) => this.counts[x-50]++)
      return this.counts.lastIndexOf(Math.min(...this.counts)) + 50
    }
  },
  {
    name: "Fuzzy Eid",
    prev: NaN,
    map: new Array(100).map(()=>new Array(100).fill(0)),
    scale: (scalar, vec) => vec.map(x=>scalar*x),
    vec_plus(lhs, rhs) {
      let result = lhs.slice()
      for(let index=0; index<result.length; ++index) {
        result[index]+=rhs[index]
      }
      return result
    },
    wts:
    new Array(100).map((_, index) =>
      sum(new Array(100).map((_, avg) =>
        Math.exp(-Math.pow(avg - index, 2))
      ))
    ),
    run(scores) {
      if(isNaN(this.prev)) {
        return 250/3
      }
      const avg = Math.round(average(scores)) - 1
      ++this.map[prev][avg]
      this.prev = avg
      //prob dist=sum_recordings{e^-(recording - avg)^2*(prob dist inferred from record)}/(sum of e^-(recording - avg)^2)
      //wts[avg]=sum of e^-(recording - avg)^2
      const dist = this.scale(1/this.wts[avg], this.map.map((outpts, index) =>
        this.scale(Math.exp(-Math.pow(avg - index, 2)) / sum(outpts), outpts)).reduce(this.vec_plus))
      return 100 + 0.4*sum(dist.map((p, n)=>p*n))
    }
  },
  (() => {
    function *stateMachine() {
      let left = 1
      let right = 100

      yield 51

      let counter = 0

      while (true) {
        counter++

        const middle = left + (right - left) / 2

        if (counter % 10 === 0) {
          left = Math.max(1, Math.random() * 100)
          right = Math.max(1, Math.random() * 100)

          if (left > right) {
            [left, right] = [right, left]
          }
        }

        const scores = yield middle
        scores.sort((a, b) => a - b)

        let countLower = 0
        let countHigher = 0

        for (const score of scores) {
          if (score < middle) {
            countLower++
          }
        }
        for (const score of scores) {
          if (score > middle) {
            countHigher++
          }
        }

        if (countLower > countHigher) {
          right = middle
        } else {
          left = middle
        }
      }
    }

    const iterator = stateMachine()
    let score = iterator.next().value

    return {
      name: "USACO (Unofficial)",
      run: scores => {
        const oldScore = score
        score = iterator.next(scores).value
        return oldScore
      }
    }
  })(),
  {
    name: "AverageAverage",
    avgLog: [],
    isFirstRound: true,
    gmean(a, b) {
      return Math.sqrt(a * b)
    },
    scoreForAvg(avg) {
      let delta = 100
      let score = 100
      let newScore = 0
      while (delta > 0.05) {
        newScore = this.gmean(score, 100 - Math.abs((avg * 0.8) - score))
        delta = Math.abs(score - newScore)
        score = newScore
      }
      return score
    },
    run(scores) {
      if (this.isFirstRound) {
        this.isFirstRound = false
        return 73
      }
      this.avgLog.push(average(scores))
      let avgavg = average(this.avgLog)
      return this.scoreForAvg(avgavg)
    }
  },
  {
    name: "getRandomNumber",
    run() {
      return 4 // chosen by fair dice roll.
      // guaranteed to be random.
    }
  },
  {
    name: "iDontWannaFail",
    run: (scores) => {
      let sum = scores.reduce((a, b) => a + b, 0)
      let avg = (sum / scores.length) || 0
      let output = avg * 0.8 + Math.round(Math.random()*11)-5
      if (avg > 60) {
        if (output < 70) {
          output = Math.floor(Math.random() * 30) + 70
        }
      } else {
        if (avg > 25) {
          output = Math.round(Math.random() * avg / 1.5) + avg // Worst case is 49.
        } else {
          output = Math.round(3.75 * avg) // Decent results unless avg is very low
        }
      }
      if (output > 100) {
        output = 100
      }
      return output
    }
  },
  {
    name: "Greedy",
    run(scores){
      let max_index = (arr => arr.indexOf(Math.max.apply(Math, arr)))
      let point = (avg) => {
        return (s) => Math.sqrt(s*(100-Math.abs(0.8*avg-s)))
      }
      let goal = (scores) => {
        return (mine) => {
          let avg = average(scores.concat([mine]))
          return point(avg)(mine) - Math.max(...scores.map((v, i)=>point(avg)(v)))
        }
      }

      let avg = average(scores)
      let range = Array(101).fill().map((_, i)=>i)
      return range[max_index(range.map((v, i) => goal(scores)(v)))]
    }
  },
  {
    name: "Chain estimator",
    bin_n: 25,
    history_len: 2,
    avg_history: null,
    table: {},
    run(scores) {
      let weighted_mean = (values, weights) => {
        const result = values
          .map((value, i) => {
            const weight = weights[i]
            const sum = value * weight
            return [sum, weight]
          })
          .reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0])

        return result[0] / result[1]
      }
      let avg = average(scores)
      let bin_n = this.bin_n
      let bin_w = 100/bin_n

      if(this.avg_history === null){
        this.avg_history = Array(this.history_len).fill()
      }

      if(this.avg_history[0] === null){
        let out = 50 + 0.4*avg

        // updates history
        this.avg_history = this.avg_history.slice(1).concat([avg])

        return Math.min(Math.max(Math.round(out), 1), 100)
      }
      // gets the "bins"
      let bin = (v => Math.max(Math.ceil(v/bin_w)-1, 0))
      let bins = this.avg_history.map(bin)
      let bin_cur = bin(avg)

      // updates the table
      for (let state in this.table) {
        this.table[state] = this.table[state].map((v, i)=>v*0.95)
      }
      if(!(bins in this.table)){
        this.table[bins] = Array(bin_n).fill(1)
      }
      this.table[bins][bin_cur] += 1

      // estimates the avg
      let state = bins.slice(1).concat([bin_cur])
      let mids = Array(bin_n).fill().map((_, i) => (i+0.5)*bin_w)
      if(!(state in this.table)){
        this.table[state] = Array(bin_n).fill(0.1)
      }
      let avg_est = weighted_mean(mids, this.table[state].map((v, i)=>Math.pow(v, 5)))
      let out = 50 + 0.4*avg

      // updates history
      this.avg_history = this.avg_history.slice(1).concat([avg])

      return Math.min(Math.max(Math.round(out), 1), 100)

    }
  },
  {
    name: "That mean average Joe",
    Joe: [],
    run( scores ) {
      this.Joe.push(average(scores)) // like.no.one(ever(did));
      return average(this.Joe)*1.1111111111111111
    }
  },
  {
    name: "LuckyDiceKid",
    run(_scores) {
      let total = 0
      let values = []
      for (let i = 0; i < 7; i++) {
        let curr = Math.floor(Math.random() * 20) + 1
        values.push(curr)
        total += curr
      }
      values.sort((x, y) => (x - y))
      total -= (values[0] + values[1])
      return total
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
        this.position++

        if (this.position >= this.seed.length){
        // reset position back to the start
          this.position = 0
        }
      } while (this.seed[this.position] < "A" || this.seed[this.position] > "z")

      // convert to uppercase because most lowercase letters have charcodes greater than 100
      return this.position && this.seed[this.position].toUpperCase().charCodeAt()
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
      this.n_rounds++
      scores = scores.filter((x)=> 100 >= x && x > 0)
      let n_bots = scores.length
      if (n_bots == 1) {
        this.last_choice = 100
        return 100
      }
      let c = 1 - 0.4/n_bots
      for (let i = 0; i < n_bots; i++) {
        this.histogram_bins[Math.round(scores[i])]++
      }
      //THE SIMP DETECTOR
      let simps = []
      for (let i = 0; i < 101; i++) {
        if (this.histogram_bins[i] > this.n_rounds) {
          simps.push(i)
        }
      }

      //Idk this shouldn't happen but I'm not risking anything
      while (scores.length - simps.length - 1 <= 0) {
        simps.pop()
      }

      if (this.n_rounds == 1) {
        this.mark = Array(201)
        for (let i = 0; i < 201; i++) {
          this.mark[i] = Array(201)
          for (let j = 0; j < 201; j++) {
            this.mark[i][j] = 0
          }
        }
        for (let i = 0; i < 201; i++) {
          this.mark[i][i]++
        }
      }

      let simp_corrected_avg = (sum(scores) - this.last_choice - sum(simps)) / (scores.length - 1 - simps.length)
      let quantized_avg = Math.round(2*simp_corrected_avg)
      this.mark[Math.round(2*this.last_SCA)][quantized_avg]++
      this.last_SCA = simp_corrected_avg

      if (this.n_rounds == 1) {
        this.last_choice = 77
        return 77
      }

      this.linear_history.push(simp_corrected_avg)

      // Update weights based on who was right
      let linear_error  = Math.exp(-Math.abs(this.linear_prediction  - simp_corrected_avg))
      let mark_error    = Math.exp(-Math.abs(this.mark_prediction    - simp_corrected_avg))
      let copycat_error = Math.exp(-Math.abs(this.copycat_prediction - simp_corrected_avg))
      let total_errors = linear_error + mark_error + copycat_error
      this.linear_weight += linear_error / total_errors
      this.mark_weight += mark_error / total_errors
      this.copycat_weight += copycat_error / total_errors

      this.linear_weight  *= 0.99
      this.mark_weight    *= 0.99
      this.copycat_weight *= 0.99

      // Compute a markov chain prediction
      let x_half_filter = 8
      let y_half_filter = 1

      let probability_sum = 0
      let probability_moment = 0

      for (let option = 1; option < 201; option++) {
        for (let x = -x_half_filter; x <= x_half_filter; x++) {
          for (let y = -y_half_filter; y <= y_half_filter; y++) {
            let X = Math.max(Math.min(quantized_avg + x, 200), 0)
            let Y = Math.max(Math.min(option + y, 200), 0)
            let probability = this.mark[X][Y] * (Math.pow(2, -(X-quantized_avg)*(X-quantized_avg)-(Y-option)*(Y-option)))
            probability_sum += probability
            probability_moment += option / 2 * probability
          }
        }
      }

      this.mark_prediction = probability_moment / probability_sum

      for (let i = 0; i < 201; i++) {
        for (let j = 0; j < 201; j++) {
          this.mark[i][j] *= 0.999
        }
      }

      // Compute a linear regression
      if (this.linear_history.length > 3) {
        if (this.linear_history.length > 10) {
          this.linear_history.shift()
        }
        let x_avg = (this.linear_history.length - 1) / 2
        let y_avg = average(this.linear_history)
        let S_xx = 0
        let S_xy = 0
        for (let x = 0; x < this.linear_history.length; x++) {
          S_xx += (x - x_avg) ** 2
          S_xy += (x - x_avg) * (this.linear_history[x] - y_avg)
        }
        let b = S_xy / S_xx
        let a = y_avg - b * x_avg
        this.linear_prediction = a + b / this.linear_history.length
      } else {
        this.linear_prediction = simp_corrected_avg
      }

      // Compute what everyone else does
      let counts = []
      for (let radius = 1; Math.max(counts) < 0.05 * scores.length; radius++) {
        for (let i = 50; i <= 90; i++) {
          counts[i] = 0
          for (let j = 0; j < n_bots; j++) {
            if (Math.abs(scores[j] - i) <= radius) {
              counts[i]++
            }
          }
        }
      }
      this.copycat_prediction = (counts.indexOf(Math.max(counts.slice(50))) * c - 50) / 0.4 * n_bots/(n_bots-1)

      let expected_unsimp_average = (
        this.mark_prediction * this.mark_weight +
          this.linear_prediction * this.linear_weight +
          this.copycat_prediction * this.copycat_weight
      ) / (this.mark_weight + this.linear_weight + this.copycat_weight)

      let expected_average = (expected_unsimp_average * (n_bots - 1 - simps.length) + sum(simps)) / (n_bots - 1)

      // We don't want to give out bad values, now do we
      this.last_choice = Math.max(1, Math.min(100, (50 + 0.4 * expected_average * (n_bots-1)/n_bots)/c))
      return this.last_choice
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
  },
  {
    name: "The Fat",
    started:false,
    up_time:0,
    down_time:0,
    last_avg:70,
    last_var:0,
    false_num:0,  //////////////
    true_num:0,  //  nom nom  ////
    last_v:0,   /////////////////
    error:0,    //---------------0
    n:0,        // 00 0 00 00 00 0
    all_v:[],   // ||||||||||||||
    last_pred:0, // ---------------
    velocity_pred:0, ////////////////
    last_acceleration:0, ////////
    errors:[],
    run(scores){
      function minus_average(x){
        return Math.pow(x - average(scores), 2)/(scores.length-1)
      }
      function calc_variance(scores){
        let v = scores.map(minus_average)
        return Math.sqrt(sum(v))
      }
      let d = 0
      let velocity

      let var_drift
      let a = average(scores)

      if(this.n<2){
        if(this.n==0){
          a = 66
        }else{
          a = 71.5
        }
        velocity = average(scores) - this.last_avg//Get current velocity
        this.all_v.push(2.5)
        this.last_pred = a
        this.last_var = calc_variance(scores)
        this.last_avg = average(scores)
        this.error = average(scores) - this.last_pred
        this.velocity_pred = 0
        this.n +=1
      }else{
        velocity = average(scores) - this.last_avg//Get current velocity
        this.all_v.push(Math.abs(velocity))
        var_drift = calc_variance(scores) - this.last_var
        if(var_drift>0){
        //If variance positive, we go back
          this.velocity_pred = -0.3*(velocity-average(this.all_v)*2)//+this.last_acceleration;
        }else{
        //Otherwise we go forward
          this.velocity_pred = -0.3*(velocity+average(this.all_v)*2)//+this.last_acceleration;
        }
        this.error = average(scores) - this.last_pred


        a = a+this.velocity_pred
        this.last_pred = a
        this.errors.push(Math.abs(this.error))
        this.last_acceleration = velocity - this.last_v
        this.last_v = velocity
        this.last_var = calc_variance(scores)
        this.last_avg = average(scores)
      }
      let c = 0
      let min = 100000
      let min_idx = 0
      let min_signed = 0
      let x =0
      while(x<=100){
        x +=5
        c = x-(4*a)/5
        d = (-Math.abs(c) - (x*c)/Math.abs(c) + 100) / 2*Math.sqrt(x*(100-Math.abs(c)))
        if(Math.abs(d)<min){
          min = Math.abs(d)
          min_signed = d
          min_idx = x
        }
      }
      //If minimum is 0, perfect.
      if(min_signed==0){
      //pass
      }
      //If minimum is positive, means 0 hasn't been reached yet
      else if(min_signed>0){
        let x =min_idx
        let inc = 0
        while(inc<=5){
          x = min_idx + inc
          inc += 0.000001
          c = x-(4*a)/5
          d = (-Math.abs(c) - (x*c)/Math.abs(c) + 100) / 2*Math.sqrt(x*(100-Math.abs(c)))
          if(Math.abs(d)<min){
            min = Math.abs(d)
            min_signed = d
            min_idx = x
          }
        }
      }
      //If minimum is negative means we should go backwards
      else{
        let x =min_idx
        let inc = 0
        while(inc<=5){
          x = min_idx - inc
          inc += 0.000001
          c = x-(4*a)/5
          d = (-Math.abs(c) - (x*c)/Math.abs(c) + 100) / 2*Math.sqrt(x*(100-Math.abs(c)))
          if(Math.abs(d)<min){
            min = Math.abs(d)
            min_signed = d
            min_idx = x
          }
        }
      }
      return min_idx
    }
  },
  {
    name: "AverageAverageAverage",
    run: _ => 77.22599053004494
  },
  {
    name: "Overshoot (slightly)",
    historyAvg: [],
    rounds: 0,

    run(scores) {
      this.rounds++
      if (this.rounds == 1) {
        return 75.5
      }

      this.historyAvg.push(average(scores))
      this.historyAvg.sort((a, b) => a-b)
      let estimatedAvg = this.historyAvg[Math.ceil(this.historyAvg.length * 0.535)-1]
      let score = 50 + estimatedAvg * 2/5

      return score
    }
  },
  {
    name: "Grumpy Chaotic",
    mood: true,
    run() {
      this.mood=!this.mood
      return this.mood?100:1
    }
  },
  {
    name: "xXx_Markov_143_xXx",
    mark: null,
    n_rounds: 0,
    old_average: 50,
    run(scores) {
      this.n_rounds++
      let last_average = average(scores)
      scores = scores.filter((x)=> 100 >= x && x > 0)
      let evaluated_scores = scores.map((score) => [score, score * (100 - Math.abs(last_average * 0.8 - score))])
      evaluated_scores.sort((a, b) => a[1] - b[1])
      let smart_average = average(evaluated_scores.slice(Math.floor(evaluated_scores.length * 0.95)).map((a)=>a[0]))

      if (this.n_rounds == 1) {
        this.old_average = smart_average
        this.mark = Array(201)
        for (let i = 0; i < 201; i++) {
          this.mark[i] = Array(201)
          for (let j = 0; j < 201; j++) {
            this.mark[i][j] = 0
          }
        }
        for (let i = 0; i < 201; i++) {
          this.mark[i][i]++
        }
        return 77
      }

      let quantized_avg = Math.round(2*smart_average)
      this.mark[Math.round(2*this.old_average)][quantized_avg]++
      this.old_average = smart_average

      // Compute a markov chain prediction
      let x_half_filter = 5
      let y_half_filter = 1

      let probability_sum = 0
      let probability_moment = 0

      for (let option = 1; option < 201; option++) {
        for (let x = -x_half_filter; x <= x_half_filter; x++) {
          for (let y = -y_half_filter; y <= y_half_filter; y++) {
            let X = Math.max(Math.min(quantized_avg + x, 200), 0)
            let Y = Math.max(Math.min(option + y, 200), 0)
            let probability = this.mark[X][Y] * (Math.pow(2, -(X-quantized_avg)*(X-quantized_avg)-(Y-option)*(Y-option)))
            probability_sum += probability
            probability_moment += option / 2 * probability
          }
        }
      }

      for (let i = 0; i < 201; i++) {
        for (let j = 0; j < 201; j++) {
          this.mark[i][j] *= 0.999
        }
      }

      return probability_moment / probability_sum
    }
  },
  {
    name: "NaiveMeta",
    persitentScores: [],
    otherScores: [],
    lastAvg: 0,
    round: 0,
    sWeight:0.2,
    oWeight:1,
    run(scores) {
      this.round++
      if (this.round === 1) {
        return 75
      }
      if(this.round === 2){
        this.persitentScores = scores
      }
      let optimizer = 0
      let avg = average(scores)
      let optimalScoreLR = 50+ 0.4*avg
      let newPScores = []
      scores.forEach(s=>{
        let i = this.persitentScores.indexOf(s)
        if(i!==-1){
          this.persitentScores.splice(i, 1)
          newPScores.push(s)
        } else if( Math.abs(s - optimalScoreLR) <=12){
          optimizer++
        }
      })
      this.persitentScores = newPScores
      let pOptimalScore =  50+0.4*average(this.persitentScores)
      if (this.round === 2) {
        return optimalScoreLR
      }
      return ((pOptimalScore*this.persitentScores.length*this.sWeight) + (optimalScoreLR  * optimizer*this.oWeight))/(this.persitentScores.length*this.sWeight+optimizer*this.oWeight)
    }
  },
  // {
  //   name: "Impatience",
  //   optimal: average => 0.4*average + 50,
  //   run(scores) {
  //     const n = scores.length
  //     // rational actors who don't care about game theory
  //     // will output 100, to win the cybersecurity exam
  //     const m = scores.filter(v => v == 100).length

  //     // other bots are slow, so simulate them
  //     do {
  //       const average = scores.reduce((a, b)=>a+b) / n
  //       const optimal = this.optimal(average)
  //       // other bots take a while to get there
  //       scores = scores.map(v => v==100 ? 100 : 0.5*(v + optimal))
  //     } while ((new Set(scores)).size > ( 0?0 :3 ))

  //     scores = new Set(scores)
  //     scores.delete(100)
  //     if (scores.size > 0) {
  //       return Math.max.apply(Math, scores)
  //     }
  //     return 90

  //   }
  // },
  {
    name: "Equilibrium",
    equil: 83.333,
    first_round: true,
    run(scores) {
      if (this.first_round) {
        this.first_round = false
        return this.equil
      }
      let midpoint = (average(scores) + this.equil) / 2
      return (50 + 0.4*midpoint)

    }
  },
  {
    name: "The Root of the Problem",
    run(scores) {
      return scores.reduce((p, s) => p * s, 1) ** (1 / scores.length)
    }
  },
  // {
  //   name: "Goethmetic Meandian",
  //   run: scores => {
  //     let a = new Float64Array(scores)
  //     do {
  //       a.sort()
  //       a = [
  //         a.reduce((x, y) => x + y, 0) / a.length,
  //         Math.pow(a.reduce((x, y) => x * y, 1), 1 / a.length),
  //         a.length % 2 ? a[Math.floor(a.length / 2)] : (a[Math.floor(a.length / 2)] + a[Math.ceil(a.length / 2)]) / 2,
  //       ]
  //     } while (a[0] !== a[1] && a[1] !== a[2])
  //     return Math.min(100, Math.max(1, Math.round(a[0])))
  //   },
  // },
  {
    name: "offset prediction",
    ema: 69.5,
    p: 0.85,
    chain_len: 4,
    offsets: [],
    chains: [],
    n: 0,
    run(scores) {
      let avg = average(scores)
      this.offsets.push(avg-this.ema)
      this.ema = this.p*this.ema + (1-this.p)*avg
      let guess = this.ema
      if (this.n++ > this.chain_len) {
        let chain = this.offsets.slice(-this.chain_len-1, -1).map(Math.sign)
        let l = this.chains[chain]
        if (!l) {
          this.chains[chain]=l=[0, 0]
        }
        l[1]++
        l[0]+=this.offsets[this.n-1]
      }
      let l = this.chains[this.offsets.slice(-this.chain_len).map(Math.sign)]||[0, 1]
      guess += l[0]/l[1]
      return 50+0.4*guess
    }
  },
  {
    name: "LastMinute HistoryAnalyzer",
    avgs: Array(6).fill(63),
    diffs: Array(3).fill(1),
    run(prev){
      const prevAvg = average(prev)
      this.avgs.push(prevAvg)
      this.avgs.shift()
      this.diffs.push(this.avgs[this.avgs.length-1] - this.avgs[this.avgs.length-2])
      const diffs4 = this.diffs.shift()
      const diffs2 = this.diffs[1]
      const avg = average([diffs2, diffs4]) + prevAvg
      return (77.9 + (avg - 70) * 0.3)
    }
  },
  {
    name: "Golden",
    previousChoice: 0,
    first: true,
    goldenRatio: (Math.sqrt(5) + 1) / 2,
    weightedBest: 75.28679012885513,
    round: 0,
    goldenSectionSearch(f, min, max, tolerance = 1e-5) {
      while (max - min > tolerance) {
        let leftInterior = max - (max - min) / this.goldenRatio
        let rightInterior = min + (max - min) / this.goldenRatio

        if (f(leftInterior) < f(rightInterior)) {
          max = rightInterior
        } else {
          min = leftInterior
        }
      }
      return (min + max) / 2
    },
    run(choices) {
      if (this.first) {
        this.previousChoice = this.weightedBest
        this.first = false
        return this.weightedBest
      }
      const n = choices.length
      const i = choices.indexOf(this.previousChoice)
      const otherChoices = [...choices.slice(0, i), ...choices.slice(i + 1)]
      const sum = otherChoices.reduce((a, b) => a + b)

      function score(candidate) {
        const average = (sum + candidate) / n
        const gameTheory = 100 - Math.abs(average * 0.8 - candidate)
        const score = Math.sqrt(candidate * gameTheory)
        const otherScores = otherChoices.map(c => {
          const gameTheory = 100 - Math.abs(average * 0.8 - c)
          return Math.sqrt(c * gameTheory)
        })
        const best = Math.max(...otherScores)
        return best - score
      }

      const best = this.goldenSectionSearch(score, 1, 100)
      this.weightedBest = (this.weightedBest * this.round + best) / (this.round + 1)
      this.round++
      this.previousChoice = this.weightedBest
      return this.weightedBest
    }
  },
  {
    name: "The Skinny",
    last_avg:70,
    last_var:0,
    n:0,
    run(scores){
      function calc_variance(scores){
        return Math.sqrt(sum(scores.map(function(x){
          return Math.pow(x - average(scores), 2)/scores.length
        })))
      }
      let a = average(scores)
      let v= average(scores) - this.last_avg//Get current velocity
      this.velocity_pred = -0.3*(v+((calc_variance(scores) - this.last_var)>0?-1:1)*4.8)//+this.last_acceleration;
      a = a+this.velocity_pred
      this.last_var = calc_variance(scores)
      this.last_avg = average(scores)
      this.n++
      if(this.n<2){
        return this.n==0 ?76.5:78.7
      }
      return 50+a*2/5
    }
  }
]

let total = bots.map(() => 0)
for(let i = 0; i < 4; i++) {
  let tbots = clone(bots)
  const g = runGame(tbots)
  total = total.map((i, j) => i + g[j])
}

let results = bots.map((i, j) => [i, total[j]]).sort((a, b) => b[1] - a[1])
for(let i of results) {
  console.log(
    i[0].name,
    " ".repeat(30 - i[0].name.length),
    i[1]
  )
}

function clone(obj) {
  if (obj === null || typeof (obj) !== "object" || "isActiveClone" in obj) {
    return obj
  }

  if (obj instanceof Date) {
    var temp = new obj.constructor()
  } //or new Date(obj);
  else {
    var temp = obj.constructor()
  }

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj["isActiveClone"] = null
      temp[key] = clone(obj[key])
      delete obj["isActiveClone"]
    }
  }
  return temp
}
