import * as HighCharts from 'highcharts';
import 'highcharts/modules/contour';
import 'highcharts/modules/heatmap';
import 'highcharts/modules/exporting';

//ContourModule(HighCharts);
import * as FFT from 'fourier-transform';

//const isPowerOfTwo = num => num > 0 && (num & (num - 1)) === 0;
export function fft(x) {
	let [re,imag]=FFT.fft(x) as [Float64Array,Float64Array];
	let ret=[];
	for (let i = 0; i < re.length; i++) ret.push([re[i],imag[i]]);
	return ret;
}

// input: a list of real number or a list of complex numbers or vector in the form [real,imag], which results in a list of complex number or vector
export function abs(aoa:number[]|number[][]|number){
	if(!Array.isArray(aoa))return Math.abs(aoa as number);
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(cn=>Math.sqrt(cn.reduce( (p,c)=>p+c*c, 0  ) ));
	else{
		let c= aoa as number[]; return Math.sqrt( c.reduce((p,c)=>p+c*c, 0) );
	}
}
function add_scalar_to_vector(s,v){
	if(Array.isArray(v[0])){
		return v.map((vu)=>vu.map((vuu)=>vuu+s));
	}else
		return v.map((vu)=>vu+s);		
}
function add_vector_to_vector(v1,v2){
	if(Array.isArray(v1[0])){
		return v1.map((vu,i)=>vu.map((vuu,j)=>vuu+v2[i][j]));
	}else
		return v1.map((vu,i)=>vu+v2[i]);		
}
export function add(a,b){
	let isa_a=Array.isArray(a), isa_b=Array.isArray(b);
	if(!isa_a && !isa_b)return a+b;
	if(!isa_a && isa_b)return add_scalar_to_vector(a,b);
	if(isa_a && !isa_b)return add_scalar_to_vector(b,a);
	return add_vector_to_vector(a,b);
}
function scale_vector(s,v){
	if(Array.isArray(v[0])){
		return v.map((vu)=>vu.map((vuu)=>vuu*s));
	}else
		return v.map((vu)=>vu*s);		
}
function scale_vector_elementwise(v1,v2){
	if(Array.isArray(v1[0])){
		return v1.map((vu,i)=>vu.map((vuu,j)=>vuu*v2[i][j]));
	}else
		return v1.map((vu,i)=>vu*v2[i]);		
}
export function scale(a,b){
	let isa_a=Array.isArray(a), isa_b=Array.isArray(b);
	if(!isa_a && !isa_b)return a*b;
	if(!isa_a && isa_b)return scale_vector(a,b);
	if(isa_a && !isa_b)return scale_vector(b,a);
	return scale_vector_elementwise(a,b);
}
export function dot(a,b){
	return scale(a,b).reduce((p,c)=>p+c);
}
export function transpose(matrix){
	if(!Array.isArray(matrix[0])) {
		console.error('input to transpose() needs to be array of array. A single array is always column vector'); return;
	}
	return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));	
}
export function mcat(matrixLeft,matrixRight){
	const rowsA = matrixLeft.length;
  const colsA = matrixLeft[0].length;
  const rowsB = matrixRight.length;
  const colsB = matrixRight[0].length;

  if (colsA !== rowsB) {
    console.error("Cannot multiply: Columns of A must match Rows of B."); return;
  }
  const result = Array.from({ length: rowsA }, () => new Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        result[i][j] += matrixLeft[i][k] * matrixRight[k][j];
      }
    }
  }
  return result;
}
export function mapply(matrix, vectorRight){
	return matrix.map(row=>dot(row,vectorRight));
}
export function sample1D_cell_centered(vector:number[], at_x:number, boundary_value:number){
	let w=vector.length;
	// at_x: 0.5~w-0.5, at_y: 0.5~h-0.5
	if(at_x<0){return 2*boundary_value-vector[Math.floor(-at_x)];}
	if(at_x>w){return 2*boundary_value-vector[Math.floor(2*w-at_x)];}
	return vector[Math.floor(at_x)];
}
export function sample2D_cell_centered(aoa:number[][], at_x:number,at_y:number, boundary_value:number){
	let w=aoa[0].length; let h=aoa.length;
	// at_x: 0.5~w-0.5, at_y: 0.5~h-0.5
	if(at_x<0){return 2*boundary_value-aoa[Math.floor(at_y)][Math.floor(-at_x)];}
	if(at_x>w){return 2*boundary_value-aoa[Math.floor(at_y)][Math.floor(2*w-at_x)];}
	if(at_y<0) {return 2*boundary_value-aoa[Math.floor(-at_y)][Math.floor(at_x)];}
	if(at_y>h) {return 2*boundary_value-aoa[Math.floor(2*h-at_y)][Math.floor(at_x)];}
	return aoa[Math.floor(at_y)][Math.floor(at_x)];
}

export function max(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>c.reduce((p,c)=>Math.max(p,c)) ).reduce((p,c)=>Math.max(p,c)) ;
	else{
		let c= aoa as number[]; return c.reduce((p,c)=>Math.max(p,c));
	}
}
export function min(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>c.reduce((p,c)=>Math.min(p,c)) ).reduce((p,c)=>Math.min(p,c)) ;
	else{
		let c= aoa as number[]; return c.reduce((p,c)=>Math.min(p,c));
	}
}

// input: a list of real number or a list of complex numbers in the form [real,imag], result is single scalar in all cases
export function rms(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return Math.sqrt((aoa as number[][]).map(c=>c.reduce((p,c)=>p+c*c,0 ) ).reduce((p,c)=>p+c*c,0)/aoa.length/(aoa[0] as number[]).length  );
	else{
		let c= aoa as number[]; return Math.sqrt( c.reduce((p,c)=>p+c*c,0)/c.length );
	}
}

// input: a list of real number or a list of complex numbers in the form [real,imag], result is single scalar in all cases
export function mean(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>c.reduce((p,c)=>p+c) ).reduce((p,c)=>p+c)/aoa.length/(aoa[0] as number[]).length ;
	else{
		let c= aoa as number[]; return c.reduce((p,c)=>p+c)/c.length;
	}
}

// input: a list of real number or a list of complex numbers in the form [real,imag], which results a single complex number
export function sum(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).reduce((p,c)=> p.map((pu,i)=>pu+c[i]) );  // array of [r,i]
	else{
		let c= aoa as number[]; return c.reduce((p,c)=>p+c);		// real array
	}
}

export function angle(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>Math.atan2(c[1],c[0]));
	else{
		let c= aoa as number[]; return Math.atan2(c[1],c[0]);
	}
}
export function real(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>c[0]);
	else{		let c= aoa as number[]; return c[0];	}
}
export function imag(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>c[1]);
	else{		let c= aoa as number[]; return c[1];	}
}
HighCharts.setOptions({
	credits:{enabled:false},
	accessibility: {enabled: false},
	chart: {zooming: {type: 'xy'}, animation: false,  }, 
	plotOptions: { 
		series: { animation: false } ,
		scatter: { lineWidth: 2, marker: { radius: 4 } }
	}
 });

const hcOptions : HighCharts.Options = { 
	title:{text:null}, 
	yAxis: { title: { text: null }}, 
	exporting: {enabled: false},
	};
let chart : HighCharts.Chart = HighCharts.chart('chart_1',hcOptions);

const charts:HighCharts.Chart[]=[];  charts[1]=chart;
var currentFigure=1;
export function figure(num:number|null){
	currentFigure=num??currentFigure+1;
	chart = charts[currentFigure];
	if(!chart) {
		const div=document.createElement('div');
		div.id='chart_'+currentFigure;
		div.style.height='400px'; // Set a height for the chart
		div.style.marginBottom='20px'; // Add some spacing
		document.body.appendChild(div);
		chart=HighCharts.chart(div,hcOptions);
		charts[currentFigure]=chart;
		div.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}else{
		chart.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}
export function close(num){	
	num=num??currentFigure;
	if(currentFigure==1)return;
	charts[num].destroy();	
	document.getElementById('chart_'+num).remove();
	delete charts[num];
	figure(num-1);	
}
export function gridon(){
	chart.update({ xAxis: { gridLineWidth: 1 }, yAxis: { gridLineWidth: 1 }});
}
export function gridoff(){
	chart.update({ xAxis: { gridLineWidth: 0 }, yAxis: { gridLineWidth: 0 }});
}
export function axis(limits:number[]){
	chart.xAxis[0].setExtremes(limits[0], limits[1]);
	chart.yAxis[0].setExtremes(limits[2], limits[3]);
}
export function cplot(){
	document.getElementById("helpText")?.remove();
	while (chart.series.length > 0) {
	   chart.series[0].remove(false); // pass false to avoid continuous re-rendering
	}
	chart.update({	exporting: {enabled: true}});
	chart.redraw();		
}
export function semilogx(...args){
	chart.xAxis[0].update({ type: 'logarithmic' },false);
	chart.yAxis[0].update({ type: 'linear' },false);
	_plot(...args);	
}
export function semilogy(...args){
	chart.xAxis[0].update({ type: 'linear' },false);
	chart.yAxis[0].update({ type: 'logarithmic' },false);
	_plot(...args);	
}
export function loglog(...args){
	chart.xAxis[0].update({ type: 'logarithmic' },false);
	chart.yAxis[0].update({ type: 'logarithmic' },false);
	_plot(...args);	
}
export function plot(...args) {
	chart.xAxis[0].update({ type: 'linear' },false);
	chart.yAxis[0].update({ type: 'linear' },false);
	_plot(...args);
}
var hold = false;
export function _plot(...args){			
	let opt={};
	if(typeof args[args.length-1]==='string') {
		opt.color=args.pop();		
	}
	if(!hold)cplot();
	if(chart.colorAxis.length==1)chart.colorAxis[0].remove(false);
	
	chart.update({colorAxis: {}});
	if(args.length==1) {
		chart.addSeries({data: args[0],type: 'line', ...opt});
	} 
	else{
		let vs=args.pop(); let keys=args.pop();
		chart.addSeries({data: keys.map((key, index) => [key, vs[index]]), type: 'scatter', ...opt});
	}
}

export function heatmap(aoa,xspan,yspan) {
	surf('heatmap',aoa,xspan,yspan);
}
export function contour(aoa,xspan,yspan) {
	surf('contour',aoa,xspan,yspan);
}
// aoa is array (y) of array (x)
export function surf(type, aoa, xspan, yspan){
	if(!hold)cplot();
	if(chart.colorAxis.length==0)
		chart.addColorAxis( { labels: { format: '{value}' }, stops: [ [ 0, '#447cff' ], [ 0.5, '#f5ff66' ], [ 0.9, '#ff5e4f' ] ] });
	
	xspan = xspan ?? linspace(0,aoa[0].length,aoa[0].length);
	yspan = yspan ?? linspace(0,aoa.length,aoa.length);
	let r=[];
	//let min=Number.MAX_VALUE, max=Number.MIN_VALUE;
	for(let y=0;y<yspan.length;y++){
		for(let x=0;x<xspan.length;x++){
			let v = aoa[y][x];
			r.push([xspan[x], yspan[y], v]);
			//if(v>max)max=v;
			//if(v<min)min=v;
		}
	}
	chart.addSeries({data:r, type: type,lineWidth:type=='contour'?1:0 });
	chart.update({tooltip:{pointFormat:`{point.x},{point.y}={point.value}`}});
}
export function legend(...names ){
	for(let i=0;i<names.length;i++)chart.series[i].update({ name: names[i] });
}
export function title(title: string){
	chart.update({title:{text: title}});
}

export function logspace(x1,x2,n){
	n=n??50;
	let r=[]; let step=(x2-x1)/n;
	for(let x=x1;x<x2-step/2;x+=step)r.push(Math.pow(10,x));
	return r;
}
export function linspace(x1,x2,n){
	n=n??50;
	let r=[]; let step=(x2-x1)/n;
	for(let x=x1;x<x2-step/2;x+=step)r.push(x);
	return r;
}
export function holdon(){ hold=true; }
export function holdoff(){ hold=false; }
export function xlabel(label){
	chart.xAxis[0].setTitle({text: label});
}
export function ylabel(label){
	chart.yAxis[0].setTitle({text: label});
}
export function zlabel(label){
	chart.colorAxis[0].setTitle({text: label});
}

// func: (t,y)=>dy/dt
export function ode23(func:Function, tspan:number[], y0){
	let y=y0;
	let res=[y0];
	let isA = Array.isArray(y0);
	let isAA = isA? Array.isArray(y0[0]):false;
	
	for(let i=0;i<tspan.length-1;i++){
		let dt = tspan[i+1]-tspan[i];
		let dydt = func(tspan[i],y);

		let y1= isA?y.map((yu,i)=> isAA? yu.map((yuu:number,j:number)=>yuu+dydt[i][j]*dt): yu+0.1481*dydt[i]*dt) : y+0.1481*dydt*dt;
		
		let dy1dt=func(tspan[i]+0.148*dt,y1);
		
		let y2=isA?y.map((yu,i)=> isAA? yu.map((yuu:number,j:number)=>yuu+dy1dt[i][j]*dt): yu+0.4*dt*dy1dt[i]): y+0.4*dt*dy1dt;
		let dy2dt=func(tspan[i]+0.4*dt,y2);
		
		y=isA?y.map((yu,i)=> isAA? yu.map((yuu:number,j:number)=>yuu+dy2dt[i][j]*dt): yu+dy2dt[i]*dt): y+dy2dt*dt;
		res.push(y);
	}
	return res;
}
export function ode(func:Function, tspan:number[], y0){
	let y=y0;
	let res=[y0];
	let isA = Array.isArray(y0);
	let isAA = isA? Array.isArray(y0[0]):false;
	
	for(let i=0;i<tspan.length-1;i++){
		let dt = tspan[i+1]-tspan[i];
		let dydt = func(tspan[i],y);

		y=isA? y.map((yu,i)=>  isAA? yu.map((yuu:number,j:number)=>yuu+dydt[i][j]*dt): yu+dydt[i]*dt  ): y+dydt*dt;
		res.push(y);
	}
	return res;
}
let csvreadTask : PromiseWithResolvers<number[][]>;
export function csvread(){
	document.getElementById('playbackFileInput')?.click();
	csvreadTask=Promise.withResolvers();
	return csvreadTask.promise;
}
export async function csvread2() {
	return await csvread();
}
document.getElementById('playbackFileInput')?.addEventListener('change', function(event) {
		const reader = new FileReader();
		reader.onload = (e)=>{
			try {
				let lines = (e.target.result as string).split('\n');
				let table = lines.map(line=>line.split(','));
				if(isNaN(parseFloat(table[0][0]))){
					table.shift();	// remove header
				}
				csvreadTask.resolve(table.map(oneline => oneline.map((val) => {return parseFloat(val);})));
			} catch(error) {
				csvreadTask.reject(error);
			}
		};
		reader.onerror=(error) => {csvreadTask.reject(error);};
		reader.readAsText(event.target.files[0]);		
		event.target.value = null; // Reset the value to null to ensure the change event fires next time				
	});
	
function escapeCSVValue(value) {
  let stringValue = value.toString();
  // If the value contains quotes, commas, or newlines, escape it
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    stringValue = stringValue.replace(/"/g, '""'); // Double up internal quotes
    return `"${stringValue}"`; // Wrap the entire value in quotes
  }
  return stringValue;
}
export function csvwrite(aoa:number[][],fn:string){
	if(!fn.endsWith('.csv'))fn=fn+'.csv';
	let blob_to_save = new Blob([  aoa.map(row => row.map(escapeCSVValue).join(",")).join("\n") ],{type: 'text/csv'});
	const url=URL.createObjectURL(blob_to_save);
	const a = document.createElement('a'); a.href = url;  a.download = fn; // Desired filename
	document.body.appendChild(a);	a.click();
	document.body.removeChild(a); 	URL.revokeObjectURL(url); 
}
var n_digits=4;
export function digits(d){
	if(!d) console.log(`Displaying ${n_digits} decimal digits`);
	else n_digits=d;
}
export function hanning(N:number){
	let win=[];
	for (let i = 0; i < N; i++) {
		win.push(0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1))));
	}
	return win;
}
function _randn(){
	let u1 = 1 - Math.random(); // Subtracted from 1 to avoid log(0)
    let u2 = Math.random();
    // Box-Muller transform formula
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);	
}
export function randn(H:number|null,W:number|null){
	if(H===undefined)return _randn();
	else if(W===undefined){
		const result = Array(H).fill(0);
		for(let i=0;i<H;i++)result[i]=_randn();
		return result;
	}
	else{
		return gmat(H,W,_randn);
	}
}
export function rand(H:number|null,W:number|null){
	if(H===undefined)return Math.random()
	else if(W===undefined){
		const result = Array(H).fill(0);
		for(let i=0;i<H;i++)result[i]=Math.random();
		return result;
	}
	else{
		return gmat(H,W,Math.random);
	}
}
export function ones(H: number,W: number|null) {
	if(W===undefined){
		return Array(H).fill(1.0);
	}
	else{
		return gmat(H,W,()=>1);
	}
}

export function zeros(H: number,W: number|null) {
	if(W===undefined){
		return Array(H).fill(0);
	}
	else{
		return gmat(H,W,()=>0.0);
	}
}
export function gmat(H:number,W:number,fn:(i:number,j:number)=>number){
	const result = Array.from({ length: H }, () => new Array(W).fill(0));
	for(let i=0;i<H;i++)
		for(let j=0;j<W;j++)
			result[i][j]=fn(i,j);
	return result;	
}
function _randi(spec:number|[number,number]){
	if(Array.isArray(spec)){
		return Math.floor(Math.random()*(spec[1]-spec[0]))+spec[0];
	}else{
		return Math.floor(Math.random()*spec);
	}
}
export function randi(spec:number|[number,number], H:number|null,W:number|null){
	if(H===undefined)return _randi(spec);
	else if(W===undefined){
		const result = Array(H).fill(0);
		for(let i=0;i<H;i++)result[i]=_randi(spec);
		return result;
	}
	else{
		gmat(H,W,()=>_randi(spec));
	}
}
if (typeof window !== 'undefined') {
	Object.getOwnPropertyNames(Math).forEach(prop => {
		let arglen=Math[prop].length;
		if(arglen==1){
			window[prop]=function(x){
				if(Array.isArray(x)) {
					if(Array.isArray(x[0])){
						return x.map(xu=>xu.map(Math[prop]));
					}
					else return x.map(Math[prop]);
				} else return Math[prop](x);
			}
		}else if(arglen==2){
			window[prop]=function(x,y){
				if(Array.isArray(x))
					return x.map((xu,idx) => {return Math[prop](xu,y[idx]);}); 
				else return Math[prop](x,y);
			}			
		}else{
			window[prop]=Math[prop];
		}
	});
	window.plot = plot; window.semilogx=semilogx; window.semilogy=semilogy; window.loglog=loglog;
	window.cplot=cplot; window.holdon=holdon; window.holdoff=holdoff; window.chart=chart; window.gridon=gridon; window.gridoff=gridoff; window.axis=axis;
	window.title=title; window.xlabel=xlabel; window.ylabel=ylabel; window.zlabel=zlabel;
	window.legend=legend; window.ode23=ode23; window.ode=ode; window.contour=contour; window.heatmap=heatmap; 
	window.csvread=csvread; window.csvwrite=csvwrite; window.csvread2=csvread2;
	window.figure=figure; window.close=close; window.fft=fft;
	window.abs=abs; window.angle=angle; window.real=real; window.imag=imag; window.mean=mean; window.sum=sum; window.rms=rms; window.max=max; window.min=min;
	window.linspace=linspace; window.logspace=logspace;
	window.hanning=hanning; 
	window.add=add; window.scale=scale; window.dot=dot; window.transpose=transpose; window.mcat=mcat; window.mapply = mapply;
	window.rand=rand; window.randn=randn; window.randi=randi; window.gmat=gmat; window.ones=ones; window.zeros=zeros;
	window.sample2D_cell_centered = sample2D_cell_centered;
	window.sample1D_cell_centered = sample1D_cell_centered;
}


/*

### Generation of MATLAB Logo div(grad(Z))+$\lambda$ Z=0
```js
let lambda=1;
function dzdt(t,z){
	let r=Array(100).fill(Array(100).fill(0));
	let w=z[0].length, h=z.length;
	for(let y=0;y<z.length;y+=1){
		for(let x=0;x<z[0].length;x+=1){
			if(x<w/2 && y<h/2)r[y][x]=0;
			else{
				let center= sample2D_cell_centered(z,x+0.5,y+0.5,0);
				let top=y<h/2&&x<=w/2+1? -center: sample2D_cell_centered(z,x+0.5,y-0.5,0);
				let bottom= sample2D_cell_centered(z,x+0.5,y+1.5,0);
				let left=x<w/2&&y<=h/2+1? -center: sample2D_cell_centered(z,x-0.5,y+0.5,0);
				let right= sample2D_cell_centered(z,x+1.5,y+0.5,0);
				// laplacian is positive if in a sink hole, grad vector all pointing out
				r[y][x]=(left+right+top+bottom)-4*center +lambda*center;
			}
		}
	}
	return r;
}
z0=gmat(100,100,(i,j)=> i<50&&j<50? 0:exp( -((i/100-0.6)**2)- (j/100-0.6)**2) );
let tspan = linspace(0,10,1000); 
let z=ode(dzdt, tspan, z0);

```
*/