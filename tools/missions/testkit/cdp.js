const {spawn}=require('child_process'); const fs=require('fs');
const CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
async function launch(port=9333, w=1366, h=800){
  const ud='/tmp/chrome-test-'+port;
  const p=spawn(CHROME,['--headless=new','--remote-debugging-port='+port,'--user-data-dir='+ud,'--window-size='+w+','+h,'--no-first-run','--hide-scrollbars','about:blank'],{stdio:'ignore'});
  let tries=0, tabs; while(tries++<60){ try{ tabs=await (await fetch('http://localhost:'+port+'/json')).json(); if(tabs.length) break; }catch(e){} await new Promise(r=>setTimeout(r,250)); }
  const tab=tabs.find(t=>t.type==='page'); const ws=new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r=>ws.onopen=r);
  let id=0; const pend={}; const logs=[]; const errs=[];
  ws.onmessage=ev=>{ const m=JSON.parse(ev.data); if(m.id&&pend[m.id]){ pend[m.id](m); delete pend[m.id]; }
    else if(m.method==='Runtime.consoleAPICalled'){ logs.push(m.params.type+': '+m.params.args.map(a=>a.value!==undefined?a.value:a.description).join(' ')); }
    else if(m.method==='Runtime.exceptionThrown'){ const d=m.params.exceptionDetails; errs.push((d.exception&&d.exception.description)||d.text); } };
  const send=(method,params={})=>new Promise(r=>{ const i=++id; pend[i]=r; ws.send(JSON.stringify({id:i,method,params})); });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:false});
  const ev=async(expr)=>{ const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true}); if(r.result&&r.result.exceptionDetails) return {__err:r.result.exceptionDetails.exception?.description||r.result.exceptionDetails.text}; return r.result&&r.result.result?r.result.result.value:undefined; };
  const shot=async(file,clip)=>{ const r=await send('Page.captureScreenshot',Object.assign({format:'png'},clip?{clip}:{})); fs.writeFileSync(file,Buffer.from(r.result.data,'base64')); };
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const close=()=>{ try{ws.close()}catch(e){} p.kill(); };
  const key=async(k,down=true)=>{ const map={ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,' ':32,Enter:13,a:65,d:68,w:87,s:83,Escape:27}; const vk=map[k]||k.toUpperCase().charCodeAt(0); const code=k===' '?'Space':(k.length===1?'Key'+k.toUpperCase():k); await send('Input.dispatchKeyEvent',Object.assign({type:down?'keyDown':'keyUp',key:k,code:code,windowsVirtualKeyCode:vk,nativeVirtualKeyCode:vk},down&&k.length===1?{text:k}:{})); };
  const click=async(x,y)=>{ await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y}); await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1}); await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1}); };
  const move=async(x,y)=>send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});
  return {send,ev,shot,sleep,close,logs,errs,key,click,move};
}
module.exports={launch};
