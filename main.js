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
  }
]

console.log(runGame(bots, 100))
