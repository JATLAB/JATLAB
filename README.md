#zhihengcao/jatlab
JATLAB: Use your browser as Scientific Calculator [http://jatlab.github.io/jatlab/](http://jatlab.github.io/jatlab/)

## Motivation
I believe a lot of people from Engineering background like myself have used MATLAB since their school years, not just for official projects, but also frequently as a quick calculator. 
Unfortunately, with each new version of MATLAB the software has become more and more bloated with unwanted features, more memory / resource usage and longer load times. Also, a MATLAB license has become more expensive and restrictive, and as a result it is not as widely available as before. 
Finding myself having have to use much lessor alternatives like the calculator app, an idea came to me.

## Features
With JATLAB, from modern Desktop web browsers (Chrome,Edge,etc) load [http://jatlab.github.io/jatlab/](http://jatlab.github.io/jatlab/) then press F12 key to open Developer Console to instantly do over ~95% of things you used to do in MATLAB: 

- All Javascript math functions available in Math.* can be used *without* typing `Math.` in front, such as:
	- `sin`,`cos`,`tan`,`exp`,`log10`,`log`,`sqrt`,...
	- All these functions are extended to accept 1D array as input and returns array
	- MATLAB statistic functions such as `rms`,`mean`,`abs`, `sum`. 
- Most commonly used MATLAB features are availble:
	- Plotting: `plot`,`figure`,`close`,`holdon`,`holdoff`,`legend`,`semilogx`,`semilogy`,`loglog`
	- Some 3D Plotting: `contour`,`heatmap`
	- Saving and loading CSV files: `csvread`,`csvwrite`
	- FFT/complex numbers: `fft`,`ifft`,`angle`,`abs`,`real`,`imag`. Complex numbers are in the 2-element array *[real_part, imag_part]*. 
	- `linspace`,`ode23`

MATLAB is vast, but I hope over time people will contribute their expertise to this project to expand these features. 

## Examples
