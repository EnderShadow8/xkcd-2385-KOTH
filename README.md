# xkcd-2385-KOTH

Submit here on codegolf.

![xkcd](https://imgs.xkcd.com/comics/final_exam.png)

_For those of you also taking Game Theory, your grade in that class will be based on how close your grade on this exam is to 80% of the average._

This challenge, inspired by the xkcd comic above, is where bots must try to maximise their grades for two subjects: Cybersecurity and Game Theory.

## Mechanics

All of the bots presumably have adequate hacking skills to change their own score to whatever they desire within the range of 0-100. This may or may not be due to the fact that [the school security systems are rubbish.](https://xkcd.com/327/)

Each round, the bots will receive last round's cybersecurity scores in no particular order in an array as input. This is to help make informed decisions about their opponents.

## Scoring

The final score for each round is the [geometric mean](https://en.wikipedia.org/wiki/Geometric_mean) of the two individual scores:

- The Cybersecurity score is simply the raw score outputted by the bot.
- The Game Theory score is equal to `100 - abs(avg * 0.8 - score)` where `avg` is the average Cybersecurity score and `score` is the bot's Cybersecurity score.

Using the geometric mean rather than the arithmetic mean is to penalise any strategies that neglect one score to maximise the other.

The score for each round is added to a total score. The bot with the highest total score at the end of the game wins!

## Specifications

Your bot must be an object that has a `run` method that takes an array of numbers as input and returns a number between 1 and 100 inclusive.

## Other rules

- Storing data in your bot's properties is allowed, and encouraged!
- Using `Math.random` is allowed.
- Using the helper functions `sum` and `average` are allowed.
- Trying to access any variables outside your bot's properties is forbidden.
- [Standard loopholes apply.](https://codegolf.meta.stackexchange.com/questions/1061/loopholes-that-are-forbidden-by-default)

## Example bots

```js
{
  // Example bot
  // He assumes all other bots are greedy and choose 100
  // So he chooses 80
  name: "Simpleton", // Just for fun
  run() {
    return 80
  }
}
```

```js
{
  // Example bot
  // He assumes everyone will choose the same scores as last round
  // So he chooses 80% of the average last round
  name: "LastRounder",
  own: 100, // Setting properties is allowed
  run(scores) {
    // The average of everyone else's score x 0.8
    this.own = (sum(scores) - this.own) / (scores.length - 1) * 0.8
    return this.own
  }
}
```

## Submissions are due by 11:59pm UTC on Saturday 8 May, but I might be lenient depending on when I'm next online.

If I haven't posted the results yet, submissions are stil open.
