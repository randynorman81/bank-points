function tab(btn){
  var g = btn.getAttribute('data-tabgroup'), id = btn.getAttribute('data-tab');
  document.querySelectorAll('.tabs button[data-tabgroup="' + g + '"]').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.tabpanel[data-tabgroup="' + g + '"]').forEach(function(p){ p.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelector('.tabpanel[data-tabgroup="' + g + '"][data-panel="' + id + '"]').classList.add('active');
}
function reveal(el){ el.classList.add('revealed'); }
function step(btn){
  var st = btn.closest('.stepper'), i = parseInt(btn.getAttribute('data-i'), 10);
  var btns = st.querySelectorAll('.stepnav button');
  btns.forEach(function(b, n){ b.classList.remove('active'); if (n < i) b.classList.add('done'); else b.classList.remove('done'); });
  btn.classList.add('active');
  st.querySelector('.stepbody').innerHTML = st.querySelectorAll('template')[i].innerHTML;
}
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.stepper').forEach(function(s){ var b = s.querySelector('.stepnav button'); if (b) step(b); });
});
