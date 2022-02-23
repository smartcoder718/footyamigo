function base5(x, base = 5) {
  x = x ? x - 1 : x
  return Math.floor(x / base);
}

function getSum(array) {
  var sum = 0;
  array.forEach(value => {
    sum += value
  });
  return sum
}

function getPer(value, total) {
  return Math.round((value * 10000 / total)) / 100
}

function timingsMaker(for_data, against_data, total_data) {
  if(typeof for_data=="string") {
    console.log(for_data, against_data, total_data)
    for_data  = JSON.parse(for_data)
    against_data  = JSON.parse(against_data)
    total_data  = JSON.parse(total_data)
  }
  var data = {
    "for": for_data,
    "against": against_data,
    "total": total_data
  }
  var teams = ["for", "against", "total"]
  var halves = ["first", "second"]

  timings = {
    "total": {
      "first": [
      ],
      "second": [
      ],
      "all": [
      ]
    },
    "for": {
      "first": [
      ],
      "second": [
      ],
      "all": [
      ]
    },
    "against": {
      "first": [
      ],
      "second": [
      ],
      "all": [

      ]
    },
    "total_per": {
      "first": [

      ],
      "second": [

      ],
      "all": [

      ]
    },
    "for_per": {
      "first": [

      ],
      "second": [
      ],
      "all": [

      ]
    },
    "against_per": {
      "first": [

      ],
      "second": [

      ],
      "all": [

      ]
    }
  }

  teams.forEach(team => {
    timings[team]["all"] = new Array(18).fill(0);
    data[team].forEach(corner => {
      timings[team]["all"][base5(corner)]++
    })
    timings[team]["first"] = timings[team]["all"].slice(0, 9)
    timings[team]["second"] = timings[team]["all"].slice(9, 18)
    let totals = {
      "first": getSum(timings[team]["first"]),
      "second": getSum(timings[team]["second"]),
      "all": getSum(timings[team]["all"])
    }
    halves.forEach(half => {
      timings[team][half].forEach(val => {
        var per = getPer(val, totals[half])
        timings[team + "_per"][half].push(per)
        timings[team + "_per"]["all"].push(per)
      })
    })
    
  })

  return timings
}

module.exports = timingsMaker