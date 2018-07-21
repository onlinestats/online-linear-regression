const lin = require('linear-algebra')()
const Matrix = lin.Matrix

function LinReg (N) {
  let P = Matrix.scalar(N, 100)
  let w = Matrix.zero(N, 1)
  let K

  return function (x, y) {
    if (arguments.length === 2) {
      console.log('---')
      let xT = new Matrix([1, ...x])
      K = P.dot(xT.trans()).mulEach(1 / (parseFloat(xT.dot(P).dot(xT.trans()).data) + 1))
      w = w.plus(K.mulEach(y - parseFloat(xT.dot(w).data)))
      P = P.minus(K.dot(xT).dot(P))
    } else if (arguments.length === 1) {
      return parseFloat(w.data[0]) + x.reduce((acc, xVal, xIndex) => acc + parseFloat(w.data[1 + xIndex]) * xVal, 0)
    }
  }
}

module.exports = LinReg
