// 合格次数
module.exports.avgScore = function (allDoneSubject) {
  if (allDoneSubject.length === 0) return 0;
  var score = 0;
  for (var i = 0; i < allDoneSubject.length; i++) {
    var item = allDoneSubject[i]
    score += item.score;
  }
  return allDoneSubject.length ? (1 * (score / allDoneSubject.length)).toFixed(2) : 0
}

// 获取通过率
module.exports.getRatioData = function (allDoneSubject) {
  var times = allDoneSubject.length
  if (times === 0) {
    return {
      class: 'low',
      text: '非常低'
    }
  }
  if (times < 2) {
    return {
      class: 'low',
      text: '低'
    }
  }
  var avg = 0
  if (allDoneSubject.length === 0) {
    avg = 0;
  } else {

    var score = 0;
    for (var i = 0; i < allDoneSubject.length; i++) {
      var item = allDoneSubject[i]
      score += item.score;
    }
    avg = allDoneSubject.length ? (1 * (score / allDoneSubject.length)).toFixed(2) : 0
  }

  if (avg > 94) {
    return {
      class: 'ok',
      text: '95%'
    }
  }
  if (avg > 89 && avg < 95) {
    return {
      class: 'ok',
      text: '85%'
    }
  }
  if (avg > 85 && avg < 90) {
    return {
      class: 'warn',
      text: '70%'
    }
  }
  if (avg > 80 && avg < 85) {
    return {
      class: 'low',
      text: '60%'
    }
  }
  return {
    class: 'low',
    text: '30%'
  }
}


// 合格次数
module.exports.passTimes = function (isDoneMoniPool) {
  if (!isDoneMoniPool || !isDoneMoniPool.length) {
    return '-'
  }
  var count = 0
  for (var i = 0; i < isDoneMoniPool.length; i++) {
    var item = isDoneMoniPool[i]
    if (item.score > 89) {
      count++
    }
  }
  return count
}

/**
 * 保留小数
 */
module.exports.fixed = function (text) {
  if (!text) {
    return 0
  }
  return Number(text).toFixed(2)
}