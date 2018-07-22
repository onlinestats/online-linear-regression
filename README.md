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
  let y = 3 * i ** 2 - 2 * i ** 2 + 9 * i + 10 + Math.random() * 20 - 10
  lin([i, i ** 2, i ** 3], y)
}

console.log(lin([2, 4, 8])) // 43.22
```
