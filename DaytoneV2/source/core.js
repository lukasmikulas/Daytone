/* Pure time and color functions; shared by the UI and automated tests. */
(function(root){
'use strict';
const DAY=86400000;
function key(d){d=new Date(d);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function date(k){return new Date(k+'T00:00:00');}
function add(d,n){d=new Date(d);d.setDate(d.getDate()+n);return d;}
function days(a,b){let n=0;for(let d=date(key(a));d<=b;d=add(d,1))n++;return n;}
function color(seconds){const stops=[[237,148,126],[237,185,119],[224,204,121],[185,205,121],[132,185,126],[85,167,132]];let x=Math.max(0,Math.min(1,seconds/28800))*5,i=Math.min(4,Math.floor(x)),t=x-i;return '#'+stops[i].map((v,j)=>Math.round(v+(stops[i+1][j]-v)*t).toString(16).padStart(2,'0')).join('');}
function duration(sec){sec=Math.max(0,sec);if(sec<60)return Math.floor(sec)+'s';let m=Math.floor(sec/60);return m<60?m+'m':Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':'');}
function elapsed(run,now=Date.now()){return run.spans.reduce((s,p)=>s+p[1]-p[0],0)+(run.runningSince!==null?Math.max(0,now-run.runningSince):0);}
function intervals(run,now=Date.now()){let remaining=run.mode==='infinite'?Infinity:(run.phase==='break'?run.rest:run.work)*60000;const list=run.spans.concat(run.runningSince!==null?[[run.runningSince,Math.max(run.runningSince,now)]]:[]),out=[];for(const [a,b] of list){let n=Math.min(b-a,remaining);if(n>0)out.push([a,a+n]);remaining-=n;}return out;}
function daily(sessions){const map={};for(const s of sessions)for(const [start,end]of s.intervals){let p=start;while(p<end){let d=new Date(p),next=+add(date(key(d)),1),stop=Math.min(end,next);map[key(d)]=(map[key(d)]||0)+(stop-p)/1000;p=stop;}}return map;}
function total(sessions){return sessions.reduce((t,s)=>t+s.intervals.reduce((a,p)=>a+(p[1]-p[0])/1000,0),0);}
const api={DAY,key,date,add,days,color,duration,elapsed,intervals,daily,total};if(typeof module!=='undefined')module.exports=api;root.DT=api;
})(typeof window!=='undefined'?window:globalThis);
