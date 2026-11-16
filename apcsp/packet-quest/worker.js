/* Runs student Python for PACKET QUEST in a Web Worker, so a runaway program can never freeze the page.
   Loads Pyodide (the same version the Python editor uses) and the game engine sim.py. */
importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");
var py = null;
var ready = (async function () {
  py = await loadPyodide();
  var src = await (await fetch("sim.py?v=" + (self.name || "1"))).text();
  py.runPython(src);
  postMessage({ type: "ready" });
})().catch(function (e) { postMessage({ type: "fail", msg: String(e) }); });

onmessage = async function (e) {
  await ready;
  var m = e.data;
  try {
    if (m.type === "run") {
      py.globals.set("_req", m.req);
      postMessage({ type: "result", id: m.id, out: py.runPython("run_request(_req)") });
    } else if (m.type === "start") {
      py.globals.set("_lv", m.level);
      postMessage({ type: "start", id: m.id, out: py.runPython("start_state(_lv)") });
    }
  } catch (err) {
    postMessage({ type: m.type === "start" ? "start" : "result", id: m.id, error: String(err) });
  }
};
