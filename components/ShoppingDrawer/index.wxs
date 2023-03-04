// 获取当前操作
module.exports.getCount = function (ticketItem, userTickets) {
  // 遍历一下 获取 该条记录的 拥有数
  if (!userTickets || !userTickets.length || !ticketItem) {
    return 0
  }
  var count = 0
  for (var i = 0; i < userTickets.length; i++) {
    var item = userTickets[i]
    if (item.ticketId === ticketItem._id) {
      count++
    }
  }
  return count
}

// 剔除超神卡
module.exports.filterGodLike = function (tickList) {
  if (!tickList || !tickList.length) {
    return []
  }
  var result = []
  for (var i = 0; i < tickList.length; i++) {
    var item = tickList[i]
    if (item.type === 'godlike') {
      continue
    }
    result.push(item)
  }
  return result
}