// 更新日志按型号分 Tab 切换
(function () {
  var tabs = document.getElementById('logTabs');
  if (!tabs) return;
  tabs.addEventListener('click', function (e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabs.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.log-panel').forEach(function (p) {
      p.classList.toggle('active', p.id === btn.dataset.panel);
    });
  });
})();

// 截图点击放大（Lightbox）
(function () {
  var imgs = document.querySelectorAll('.shot img');
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<img alt=""><div class="lb-cap"></div>';
  document.body.appendChild(box);
  var big = box.querySelector('img');
  var cap = box.querySelector('.lb-cap');
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
  imgs.forEach(function (img) {
    img.addEventListener('click', function () {
      big.src = img.src;
      big.alt = img.alt || '';
      var fig = img.closest('figure');
      var fc = fig ? fig.querySelector('figcaption') : null;
      cap.textContent = fc ? fc.textContent : (img.alt || '');
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  box.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
