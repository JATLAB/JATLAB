import * as HighCharts from 'highcharts';
import 'highcharts/modules/contour';
import 'highcharts/modules/heatmap';
//ContourModule(HighCharts);
import * as FFT from 'fft-js';

const isPowerOfTwo = num => num > 0 && (num & (num - 1)) === 0;
export function fft(x){
	if(isPowerOfTwo(x))return FFT.fft(x);
	else return FFT.dft(x);
}
export function ifft(x){
	if(isPowerOfTwo(x))return FFT.ifft(x);
	else return FFT.idft(x);
}

// input: a list of real number or a list of complex numbers or vector in the form [real,imag], which results in a list of complex number or vector
export function abs(aoa:number[]|number[][]|number){
	if(!Array.isArray(aoa))return Math.abs(aoa as number);
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return (aoa as number[][]).map(c=>Math.sqrt(c.reduce((p,c)=>p+c*c) ));
	else{
		let c= aoa as number[]; return Math.sqrt( c.reduce((p,c)=>p+c*c) );
	}
}

// input: a list of real number or a list of complex numbers in the form [real,imag], result is single scalar in all cases
export function rms(aoa:number[]|number[][]){
	let isAA = Array.isArray(aoa[0]);
	if(isAA)return Math.sqrt((aoa as number[][]).map(c=>c.reduce((p,c)=>p+c*c) ).reduce((p,c)=>p+c*c)/aoa.length/(aoa[0] as number[]).length  );
	else{
		let c= aoa as number[]; return Math.sqrt( c.reduce((p,c)=>p+c*c)/c.length );
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
	if(isAA)return (aoa as number[][]).reduce((p,c)=>[p[0]+c[0],p[1]+c[1]]);  // array of [r,i]
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
		scatter: { lineWidth: 1, marker: { radius: 2 } }
	}
 });

const hcOptions : HighCharts.Options = { title:{text:null}, yAxis: { title: { text: null }}, };
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
export function cplot(){
	document.getElementById("helpText")?.remove();
	while (chart.series.length > 0) {
	   chart.series[0].remove(false); // pass false to avoid continuous re-rendering
	}
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
	window.cplot=cplot; window.holdon=holdon; window.holdoff=holdoff; window.chart=chart;
	window.title=title; window.xlabel=xlabel; window.ylabel=ylabel;
	window.legend=legend; window.ode23=ode23; window.ode=ode; window.contour=contour; window.heatmap=heatmap; 
	window.csvread=csvread; window.csvwrite=csvwrite; window.csvread2=csvread2;
	window.figure=figure; window.close=close; window.fft=fft; window.ifft=ifft; 
	window.abs=abs; window.angle=angle; window.real=real; window.imag=imag; window.mean=mean; window.sum=sum; window.rms=rms; 
	window.linspace=linspace; window.logspace=logspace;
	window.hanning=hanning; 

}


