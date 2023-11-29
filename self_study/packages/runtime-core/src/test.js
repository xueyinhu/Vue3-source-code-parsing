let arr = [2, 3, 1, 5, 6, 8, 7, 9, 4]

function getSequence(arr) {
  let len = arr.length
  const result = [0]
  let sat, end, mid
  let p = arr.slice(0)
  for (let i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI != 0) {
      let resultLastIndex = result[result.length - 1]
      if (arr[resultLastIndex] < arrI) {
        p[i] = resultLastIndex
        result.push(i)
        continue
      }
      sat = 0
      end = result.length - 1
      while (sat < end) {
        mid = ((sat + end) / 2) | 0
        if (arr[result[mid]] < arrI) {
          sat = mid + 1
        } else {
          end = mid
        }
      }
      if (arrI < arr[result[sat]]) {
        if (sat > 0) {
          p[i] = result[sat - 1]
        }
        result[sat] = i
      }
    }
  }
  let rlen = result.length
  let last = result[rlen - 1]
  while (rlen --) {
    result[rlen] = last
    last = p[last]
  }
  return result
}

console.log(getSequence(arr));

