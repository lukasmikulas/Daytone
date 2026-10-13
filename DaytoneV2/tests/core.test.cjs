const assert=require('node:assert/strict');
const C=require('../source/core.js');
function check(name,fn){fn();console.log('PASS '+name);}
check('Color endpoints and saturation',()=>{assert.equal(C.color(0),'#ed947e');assert.equal(C.color(28800),'#55a784');assert.equal(C.color(50000),C.color(28800));});
check('Pause excludes inactive time',()=>{let r={mode:'countdown',phase:'work',work:25,spans:[[1000,6000]],runningSince:null};assert.equal(C.elapsed(r,300000),5000);});
check('Resume includes both intervals',()=>{let r={mode:'countdown',phase:'work',work:25,spans:[[1000,6000]],runningSince:15000};assert.equal(C.elapsed(r,20000),10000);});
check('Countdown caps late callback at target',()=>{let r={mode:'countdown',phase:'work',work:1,spans:[],runningSince:1000};assert.deepEqual(C.intervals(r,999999),[[1000,61000]]);});
check('Countdown caps correctly after a pause',()=>{let r={mode:'countdown',phase:'work',work:1,spans:[[1000,31000]],runningSince:100000};assert.deepEqual(C.intervals(r,300000),[[1000,31000],[100000,130000]]);});
check('Stopwatch has no countdown cap',()=>{let r={mode:'infinite',phase:'work',spans:[],runningSince:1000};assert.deepEqual(C.intervals(r,9000000),[[1000,9000000]]);});
check('Midnight splits focus across local days',()=>{let a=+new Date(2026,9,10,23,30),b=+new Date(2026,9,11,0,30);assert.deepEqual(C.daily([{intervals:[[a,b]]}]),{'2026-10-10':1800,'2026-10-11':1800});});
check('Daylight saving calendar uses real midnight boundaries',()=>{let a=+new Date(2026,9,25),b=+new Date(2026,9,26);assert.equal(C.daily([{intervals:[[a,b]]}])['2026-10-25'],(b-a)/1000);assert.equal(C.days(new Date(2026,9,24),new Date(2026,9,26)),3);});
check('Hours/minutes and seconds formatting',()=>{assert.equal(C.duration(3660),'1h 1m');assert.equal(C.duration(50),'50s');});
