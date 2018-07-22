const lin = require('linear-algebra')()
const Matrix = lin.Matrix

function LinReg () {
  let P
  let w
  let K
  let N = 0

  return function (x, y) {
    if (x && typeof x === 'number') {
      x = [x]
    }
    if (arguments.length === 2) {
      // Training
      if (!N) {
        // Initialize P and weights with the first sample
        N = x.length + 1
        P = Matrix.scalar(N, 100)
        w = Matrix.zero(N, 1)
      }
      let xT = new Matrix([1, ...x])
      K = P.dot(xT.trans()).mulEach(1 / (parseFloat(xT.dot(P).dot(xT.trans()).data) + 1))
      w = w.plus(K.mulEach(y - parseFloat(xT.dot(w).data)))
      P = P.minus(K.dot(xT).dot(P))
    } else if (arguments.length === 1) {
      // Predicting
      return parseFloat(w.data[0]) + x.reduce((acc, xVal, xIndex) => acc + parseFloat(w.data[1 + xIndex]) * xVal, 0)
    } else {
      // Return weights
      return w.data
    }
  }
}

module.exports = LinReg
