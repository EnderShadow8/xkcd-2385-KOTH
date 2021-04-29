export function runGame(bots, n=1000) {
  // Total scores
  let scores = new arr(bots.length).fill(0)

  // Previous round's scores, intialised to random numbers
  let prev = bots.map(() => Math.random() * 100)

  for(let i = 0; i < n; i++) {
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
      scores[i] += Math.sqrt(
        curr[i] * 100 - Math.abs(avg * 0.8 - curr[i])
      )
    }
    prev = shuffle(curr)
  }
  return scores
}

// Helper functions
export function average(arr) {
  return sum(arr) / arr.length
}

export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}

function shuffle(arr) {
  var currentIndex = arr.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}
