# online-linear-regression

### Description
[Linear regression](https://en.wikipedia.org/wiki/Linear_regression) is a beautiful algorithm that models relationship between two or more variables. The algorithm estimates linear weights ⍵<sub>0</sub>, ⍵<sub>1</sub> … ⍵<sub>n</sub> given data (<b>y</b>, <b>X</b>) and assumed model: 
> y = ⍵<sub>0</sub> + ⍵<sub>1</sub>x<sub>1</sub> + … + ⍵<sub>n</sub>x<sub>n</sub>&nbsp;
&nbsp;&nbsp;<small>(1)</small>

The classical approach for calculating <b>⍵</b> is minimizing the residual sum of squares:
> RSS(⍵) = ∑<sub>i=1..N</sub> (y<sub>i</sub> - f(<b>x<sub>i</sub></b>))<sup>2</sup> = (<b>y</b> − <b>X⍵</b>)<sup>T</sup>(<b>y</b> − <b>X⍵</b>)&nbsp;
&nbsp;&nbsp;<small>(2)</small>

After differentiating the RSS we find it extrema:
> <b>⍵</b>* = (<b>X</b><sup>T</sup><b>X</b>)<sup>−1</sup><b>X</b><sup>T</sup><b>y</b>&nbsp;
&nbsp;&nbsp;<small>(3)</small>

The formula is really great, however there are couple of problems with it from the computational point of view:
1. Matrix inverse is quite expensive procedure
2. We have to store all values of x and y
3. To update the model with new sample we need to iterate over all dataset

Instead of using the classical formula for ⍵ <i>(3)</i> the <b>online-linear-regression</b> is based on the recursive least squares algorithm. It stores only one n×n matrix P and two n-dimensional vectors K and ⍵, where n - number of weights.

> K<sub>i+1</sub> = P<sub>i</sub>x<sub>i+1</sub>(1 + x<sup>T</sup><sub>i+1</sub>P<sub>i</sub>x<sub>i+1</sub>)<sup>−1</sup><br>
> ⍵<sub>i+1</sub> = ⍵<sub>i</sub> + K<sub>i+1</sub>(y<sub>i+1</sub> - x<sup>T</sup><sub>i+1</sub>⍵)<br>
> P<sub>i+1</sub> = P<sub>i</sub> − K<sub>i+1</sub>x<sup>T</sup><sub>i+1</sub>P<sub>i</sub>


### Installation
```npm install online-linear-regression```

```javascript
const LinReg = require('online-linear-regression')
```

To use in browsers, bundle with [browserify](https://github.com/browserify/browserify)

### Usage
I've tried to make the function interface as simple as possible. However because of inner values and on-line nature it's still needed to initialize the function before usage:

```javascript
const LinReg = require('online-linear-regression')
const linreg = LinReg()
```

then just call ```linreg``` with 2 arguments (<b>x</b>, y) when training the model or one argument (<b>x</b>) when predicting ŷ.

```javascript
// Example of polynomial regression
for (let i = 0; i < 5; i += Math.random() * 0.5) {
  let noise = Math.random() * 10 - 5
  let y = 3 * i ** 2 - 2 * i ** 2 + 9 * i + 10 + noise
  linreg([i, i ** 2, i ** 3], y)
}

console.log(linreg([2, 4, 8])) // 43.22
```

### LSE

The problem of finding solutions for a system of independent equations when the number of equations is greater than the number of variables is known as <b>Least Squares Estimation</b>. In our case we have data (<b>X</b>, <b>y</b>) with <code>N</code> pairs of input/ouput values. Each input is a vector <b>x</b><sub>i</sub> of length <code>n-1</code>, output — scalar value of y<sub>i</sub>. We try to find weight vector <b>⍵</b> of length <code>n</code> with coefficients ⍵<sub>0</sub>,⍵<sub>1</sub>…⍵<sub>n</sub>. <br>If N > n (i.e. data length is bigger that number of input variables) it's impossible to find one unique solution for <b>⍵</b>. So we should use the LSE method.

> y<sub>0</sub> = ⍵<sub>0</sub> + ⍵<sub>1</sub>x<sub>01</sub> + … + ⍵<sub>n</sub>x<sub>0n</sub><br>
> y<sub>1</sub> = ⍵<sub>0</sub> + ⍵<sub>1</sub>x<sub>11</sub> + … + ⍵<sub>n</sub>x<sub>1n</sub><br>
> …<br>
> y<sub>N</sub> = ⍵<sub>0</sub> + ⍵<sub>1</sub>x<sub>N1</sub> + … + ⍵<sub>n</sub>x<sub>Nn</sub><br>

or in vector form:

> <b>y</b> = <b>X</b><b>⍵</b>

we are trying to find such <b>⍵</b> that minimizes the error function <i>(3)</i>. To do that let's find the function's derivative:

> RSS(⍵) = (<b>y</b> − <b>X⍵</b>)<sup>T</sup>(<b>y</b> − <b>X⍵</b>) = (<b>y</b><sup>T</sup> − <b>⍵<sup>T</sup>X<sup>T</sup></b>)(<b>y</b> − <b>X⍵</b>) = <b>y</b><sup>T</sup><b>y</b> - <b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>y</b> - <b>y</b><sup>T</sup><b>X⍵</b> + <b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>X⍵</b>

Understanding that <b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>y</b> is scalar and its transpose (<b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>y</b>)<sup>T</sup> = <b>y</b><sup>T</sup><b>X⍵</b> doesn't change its value:

> RSS(⍵) = <b>y</b><sup>T</sup><b>y</b> - 2<b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>y</b> + <b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>X⍵</b>

To differentiate the above formula, we use such math statements:

> <sup>∂</sup>/<sub>∂⍵</sub> (<b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>y</b>) = <b>X</b><sup>T</sup><b>y</b><br>
> <sup>∂</sup>/<sub>∂⍵</sub> (<b>⍵</b><sup>T</sup><b>X</b><sup>T</sup><b>X⍵</b>) = 2<b>X</b><sup>T</sup><b>X⍵</b>

Now differentiate RSS(⍵) and find a closed-form formula for <b>⍵</b> when <sup>∂RSS(⍵)</sup>/<sub>∂⍵</sub> equals to 0 (function extrema)

> <sup>∂</sup>/<sub>∂⍵</sub> RSS(⍵) = -2<b>X</b><sup>T</sup><b>y</b> + 2<b>X</b><sup>T</sup><b>X⍵</b> = 0<br>
> <b>⍵</b> = (<b>X</b><sup>T</sup><b>X</b>)<sup>−1</sup><b>X</b><sup>T</sup><b>y</b>

### RLSE
We are interested in a recursive algorithm for <b>⍵</b> such that when new data arrives it'd be possible to update weights without iterating over the dataset. Let's start from the formula (3) for <code>i+1</code> case:

> <b>⍵</b><sub>i+1</sub> = (<b>X</b><sup>T</sup><sub>i+1</sub><b>X</b><sub>i+1</sub>)<sup>−1</sup><b>X</b><sup>T</sup><sub>i+1</sub><b>y</b><sub>i+1</sub> = <b>P</b><sub>i+1</sub><b>X</b><sup>T</sup><sub>i+1</sub><b>y</b><sub>i+1</sub> &nbsp;&nbsp;&nbsp;<small>(4)</small>

Where:

> <b>P</b><sub>i+1</sub> = (<b>X</b><sup>T</sup><sub>i+1</sub><b>X</b><sub>i+1</sub>)<sup>−1</sup> = (<b>X</b><sup>T</sup><sub>i</sub><b>X</b><sub>i</sub> + <b>x</b><sub>i+1</sub><b>x</b><sup>T</sup><sub>i+1</sub>)<sup>−1</sup> = (<b>P</b><sub>i</sub> + <b>x</b><sub>i+1</sub><b>x</b><sup>T</sup><sub>i+1</sub>)<sup>−1</sup> &nbsp;&nbsp;&nbsp;<small>(5)</small>

Using [Woodbury matrix identity ](https://en.wikipedia.org/wiki/Woodbury_matrix_identity) we get rid of matrix inversion in (5):

> <b>P</b><sub>i+1</sub> = <b>P</b><sub>i</sub> - α<b>P</b><sub>i</sub><b>x</b><sub>i+1</sub><b>x</b><sup>T</sup><sub>i+1</sub><b>P</b><sub>i</sub>

α is a scalar value equal to

> α = (1 + <b>x</b><sup>T</sup><sub>i+1</sub><b>P</b><sub>i</sub><b>x</b><sub>i+1</sub>)<sup>-1</sup>
