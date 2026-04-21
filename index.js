let drinkCount = 1;

function highlightUrgentWords(text) {
  const words = [
    'срочно',
    'быстрее',
    'побыстрее',
    'скорее',
    'поскорее',
    'очень нужно'
  ];

  let result = text;

  words.forEach(word => {
    const regex = new RegExp(`(${word})`, 'gi');
    result = result.replace(regex, '<b>$1</b>');
  });

  return result;
}

function attachTextareaListener(fieldset) {
  const textarea = fieldset.querySelector('.extra-text');
  const preview = fieldset.querySelector('.extra-preview');

  textarea.addEventListener('input', () => {
    preview.innerHTML = highlightUrgentWords(textarea.value);
  });
}

document.querySelector('.add-button').addEventListener('click', () => {
  drinkCount++;
  
  const forms = document.querySelectorAll('.beverage');
  const firstForm = forms[0];
  const newForm = firstForm.cloneNode(true);
  
  newForm.querySelector('.beverage-count').textContent = `Напиток №${drinkCount}`;
  
  const milkRadios = newForm.querySelectorAll('input[type="radio"]');
  milkRadios.forEach((radio, index) => {
    radio.name = `milk${drinkCount}`;
    radio.checked = index === 0;
  });

  const checkboxes = newForm.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  const select = newForm.querySelector('select');
  select.value = 'espresso';

  firstForm.parentNode.insertBefore(newForm, document.querySelector('.add-button').parentNode);
  
  updateRemoveButtons();
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-button')) {
    const forms = document.querySelectorAll('.beverage');
    if (forms.length > 1) {
      e.target.closest('.beverage').remove();
      updateRemoveButtons();
    }
  }
});

const modalOverlay = document.querySelector('.modal-overlay');
const modalCloseButton = document.querySelector('.modal-close');
const form = document.querySelector('form');

function getMilkText(value) {
  switch (value) {
    case 'usual':
      return 'обычное';
    case 'no-fat':
      return 'обезжиренное';
    case 'soy':
      return 'соевое';
    case 'coconut':
      return 'кокосовое';
    default:
      return '';
  }
}

function getAdditionalText(fieldset) {
  const dictionary = {
    'взбитых сливок': 'взбитые сливки',
    'зефирок': 'зефирки',
    'шоколад': 'шоколад',
    'корицу': 'корица'
  };
  
  const checkedOptions = Array.from(fieldset.querySelectorAll('input[type="checkbox"]:checked'));
  return checkedOptions
    .map(checkbox => {
      const label = checkbox.closest('label');
      const text = label ? label.innerText.trim() : checkbox.value;
      return dictionary[text] || text;
    })
    .join(', ');
}

function buildOrderTable() {
  const tbody = document.querySelector('.modal-order-table tbody');
  tbody.innerHTML = '';

  const forms = document.querySelectorAll('.beverage');
  forms.forEach(fieldset => {
    const drinkName = fieldset.querySelector('select').selectedOptions[0].textContent;
    const milkValue = fieldset.querySelector('input[type="radio"]:checked')?.value || '';
    const additionalText = getAdditionalText(fieldset);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${drinkName}</td>
      <td>${getMilkText(milkValue)}</td>
      <td>${additionalText}</td>
    `;
    tbody.appendChild(row);
  });
}

function getDrinkWord(n) {
  let n100 = Math.abs(n) % 100;
  let n10 = n100 % 10;
  if (n100 >= 11 && n100 <= 19) return 'напитков';
  if (n10 >= 2 && n10 <= 4) return 'напитка';
  if (n10 === 1) return 'напиток';
  return 'напитков';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const formsCount = document.querySelectorAll('.beverage').length;
  const drinkWord = getDrinkWord(formsCount);
  document.querySelector('.modal-drink-count').textContent = `Вы заказали ${formsCount} ${drinkWord}`;
  
  buildOrderTable();
  modalOverlay.classList.remove('hidden');
});

modalCloseButton.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});

function updateRemoveButtons() {
  const forms = document.querySelectorAll('.beverage');
  forms.forEach(form => {
    const btn = form.querySelector('.remove-button');
    if (btn) {
      if (forms.length === 1) {
        btn.disabled = true;
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.5';
      } else {
        btn.disabled = false;
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
      }
    }
  });
}

updateRemoveButtons();
