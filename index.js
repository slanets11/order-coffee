document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-button');
  const submitBtn = document.querySelector('.submit-button');

  function getBeverages() {
    return document.querySelectorAll('.beverage');
  }

  function updateState() {
    const beverages = getBeverages();
    
    // Обновляем нумерацию
    beverages.forEach((bev, index) => {
      bev.querySelector('.beverage-count').textContent = `Напиток №${index + 1}`;
    });

    // Управляем кнопками удаления
    beverages.forEach((bev) => {
      let delBtn = bev.querySelector('.delete-btn');
      if (beverages.length === 1) {
        if (delBtn) delBtn.remove();
      } else {
        if (!delBtn) {
          delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'delete-btn';
          delBtn.innerHTML = '&times;';
          delBtn.style.cssText = 'position:absolute; top:5px; right:5px; background:none; border:none; font-size:20px; cursor:pointer; padding:0;';
          delBtn.addEventListener('click', () => {
            bev.remove();
            updateState();
          });
          bev.style.position = 'relative';
          bev.appendChild(delBtn);
        }
      }
    });
  }

  // Добавление напитка
  addBtn.addEventListener('click', () => {
    const firstBev = getBeverages()[0];
    const clone = firstBev.cloneNode(true);
    
    // Сбрасываем выбранные опции в клоне
    clone.querySelectorAll('input').forEach(input => {
      if (input.type === 'radio' || input.type === 'checkbox') input.checked = false;
    });
    
    // Удаляем скопированную кнопку удаления, если она есть
    const oldDel = clone.querySelector('.delete-btn');
    if (oldDel) oldDel.remove();

    firstBev.parentNode.insertBefore(clone, addBtn);
    updateState();
  });

  // Показ модального окна
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; display:flex; justify-content:center; align-items:center;';

    const modal = document.createElement('div');
    modal.style.cssText = 'position:relative; width:500px; height:auto; background:#fff; padding:20px; border-radius:5px;';
    modal.innerHTML = `
      <button type="button" class="modal-close" style="position:absolute; top:5px; right:10px; background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
      <p style="margin-top:15px; text-align:center; font-size:18px;">Заказ принят!</p>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    modal.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  });

  // Инициализация состояния
  updateState();
});