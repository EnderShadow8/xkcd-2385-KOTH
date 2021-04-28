const bots = [
  // Bots go here
]

function main() {
  // Previous round's scores, intialised to random numbers
  let prev = bots.map(() => Math.random() * 100)
  for(let i = 0; i < 1000; i++) {
    // This round's scores
    let curr = []

    // Iterate through all bots' decisions
    for(let bot of bots) {
      curr.push(bot.run(prev))
    }

    // Calculate scores
    let avg = average(curr)
    for(let i = 0; i < bots.length; i++) {
      // Add geometric mean of both scores to total
      bots[i].total += Math.sqrt(
        curr[i],
        Math.abs(avg * 0.8 - curr[i])
      )
    }
    prev = curr
  }
}

// Helper functions
function average(arr) {
  return sum(arr) / arr.length
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}
