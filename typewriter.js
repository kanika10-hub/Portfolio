// Lightweight typing animation for the hero name
(function(){
  function once(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn();}
  once(()=>{
    const el = document.getElementById('type-text');
    if(!el) return;
    const cursor = document.querySelector('.type-cursor');
    const text = 'Kanika Rathore';
    const speed = 80; // ms per character
    let i = 0;
    function type(){
      if(i < text.length){
        i += 1;
        el.textContent = text.slice(0, i);
        setTimeout(type, speed + (Math.random()*40 - 20));
      } else {
        el.textContent = text;
        if(cursor) cursor.style.animation = 'none';
      }
    }
    setTimeout(type, 600);
  });
})();
