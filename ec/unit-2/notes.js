/* Shared helpers for the EC Unit 2 notes pages: flip cards and the "test yourself" quiz. */
(function () {
  [].forEach.call(document.querySelectorAll(".flip"), function (b) { b.onclick = function () { b.classList.toggle("open"); }; });
  var quiz = document.getElementById("quiz");
  if (quiz && window.QUIZ) window.QUIZ.forEach(function (q) {
    var d = document.createElement("div"); d.className = "q";
    d.innerHTML = "<div>" + q.s + '</div><div class="opts"></div><div class="fb"></div>';
    q.o.forEach(function (t, i) {
      var b = document.createElement("button"); b.className = "btn"; b.type = "button"; b.innerHTML = t;
      b.onclick = function () {
        var fb = d.querySelector(".fb");
        if (i === q.a) { fb.innerHTML = '<b style="color:#34D399">Right.</b> ' + q.e; b.classList.add("on"); }
        else fb.innerHTML = '<b style="color:#FCA5A5">Not quite.</b> Try another one.';
      };
      d.querySelector(".opts").appendChild(b);
    });
    quiz.appendChild(d);
  });
})();
