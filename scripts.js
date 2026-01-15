/* открытие/закрытие модального окна */
let modalCloseButton = document.querySelector('.modal__close-button');
let modalContainer = document.querySelector('.modal-container');

/* открытие модального окна кнопкой "Поиск гостиницы в Седоне" на index */
let searchButton = document.querySelector('.search__button');
if (searchButton) {
  searchButton.addEventListener('click', () => {
    modalContainer.classList.remove('modal-container--hidden');
  });
}
/* закрытие модального окна кнопкой-крестиком */
const closeModal = () => {
  modalContainer.classList.add('modal-container--hidden');
};

modalCloseButton.addEventListener('click', closeModal);

/* открытие модального окна ссылкой "Хочу сюда!" в хедере */
let navigationButton = document.querySelector('.navigation__button');
navigationButton.addEventListener('click', (event) => {
  event.preventDefault();
  modalContainer.classList.remove('modal-container--hidden');
})

/* открытие/закрытие тултипа в модальном окне */
let tooltipText = document.querySelector('#tooltip__text');
let tooltipButton = document.querySelector('.tooltip__button');

tooltipButton.addEventListener('click', () => {
  tooltipText.classList.toggle('tooltip__text--open');
});

/* взаимодействие с сервером и отправка формы поиска гостиниц */
const SERVER_ADDRESS = 'https://echo.htmlacademy.ru/';

const modalForm = document.querySelector('.search-form');
const modalFormButton = modalForm.querySelector('.search-form__button');
const modalResult = document.querySelector('.modal-result');
const modalResultText = modalResult.querySelector('.modal-result__text');
const modalResultButton = modalResult.querySelector('.modal-result__button');

const uploadFormDataServer = (formData, formMethod) => fetch( // ф-я запроса отправки данных на сервер
  SERVER_ADDRESS,
  {
    method: formMethod,
    body: formData
  }
);

const disableModalFormButton = () => {
  modalFormButton.disabled = true;
  modalFormButton.textContent = 'Отправляем запрос...'
};

const undisableModalFormButton = () => {
  modalFormButton.disabled = false;
  modalFormButton.textContent = 'Найти'
};

const onClickBackdrop = (evt) => {
  const isOnBackdropClick = evt.target === evt.currentTarget;

  if (isOnBackdropClick) {
    modalResult.close();
  }
};

const setFormData = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target); // собираем данные из формы
  disableModalFormButton();
  uploadFormDataServer(formData, 'POST')
  .then(
    (responce) => {
      if (!responce.ok) {
        throw new Error;
      }
      modalForm.reset();
      closeModal();
    }
  )
  .catch(
    () => {
      modalResultText.textContent = 'Что-то пошло не так... Попробуйте еще раз';
    }
  )
  .finally(
    () => {
      modalResult.showModal();
      undisableModalFormButton();
    }
  )
};

modalResult.addEventListener('click', onClickBackdrop);
modalResultButton.addEventListener('click', () => {
  modalResult.close();
})
modalForm.addEventListener('submit', setFormData);

/* отправка формы подписки */
const newsletterForm = document.querySelector('.newsletter__form');
const newsletterFormButton = newsletterForm.querySelector('.newsletter__button');

const disableNewsletterFormButton = () => {
  newsletterFormButton.disabled = true;
  newsletterFormButton.textContent = 'Подписываем...';
};

const undisableNewsletterFormButton = () => {
  newsletterFormButton.disabled = false;
  newsletterFormButton.textContent = 'Подписаться';
};

const onSubmitNewsletterForm = (evt) => {
  evt.preventDefault();
  disableNewsletterFormButton();
  const formData = new FormData(evt.target);

  uploadFormDataServer(formData, 'POST')
  .then(
    (responce) => {
      if (!responce.ok) {
        throw new Error;
      }
      newsletterForm.reset();
      modalResultText.textContent = 'Спасибо за подписку!';
    }
  )
  .catch(
    () => {
      modalResultText.textContent = 'Что-то пошло не так... уже работаем над этим. Попробуйте еще раз позже';
    }
  )
  .finally(
    () => {
      modalResult.showModal();
      undisableNewsletterFormButton();
    }
  )
};

newsletterForm.addEventListener('submit', onSubmitNewsletterForm);

/* форма поиска гостиниц */

const selectionForm = document.querySelector('.selection__form');

if (selectionForm) {
  const selectionFormButton = selectionForm.querySelector('.selection__button--submit');

  const disableSelectionFormButton = () => {
    selectionFormButton.disabled = true;
  };

  const unDisableSelectionFormButton = () => {
    selectionFormButton.disabled = false;
  };

  const onSubmitSelectionForm = (evt) => {
    evt.preventDefault();
    disableSelectionFormButton();
    const formData = new FormData(evt.target);

    let requestData = '';
    for (let [key, value] of formData) {
      requestData += `${key}=${value}&`;
    }
    requestData = requestData.slice(0, requestData.length - 1);

    fetch(`${SERVER_ADDRESS}?${requestData}`)
    .then(
      (responce) => {
        if (!responce.ok) {
          throw new Error;
        }
        selectionForm.reset();
        onResetButton();
      }
    )
    .catch(
      () => {
        modalResultText.textContent = 'Что-то пошло не так... уже работаем над этим. Попробуйте еще раз позже';
        modalResult.showModal();
      }
    )
    .finally(
      () => {
        unDisableSelectionFormButton();
      }
    )
  };

  selectionForm.addEventListener('submit', onSubmitSelectionForm);


  /* обработка слайдера выбора цены */
  const selectionPriceSlider = selectionForm.querySelector('.selection__price-slider');
  const rangeInputMax = selectionForm.querySelector('.range-input-max');
  const rangeInputMin = selectionForm.querySelector('.range-input-min');
  const selectionMinPrice = selectionForm.querySelector('.selection__min-price');
  const selectionMaxPrice = selectionForm.querySelector('.selection__max-price');
  const selectionButtonReset = selectionForm.querySelector('.selection__button--reset');

  const onRangeInputMax = (event) => {
    const valueMin = parseInt(event.target.parentNode.parentNode.style.getPropertyValue('--value-min'));

    if (event.target.valueAsNumber <= valueMin) {
      event.target.value = valueMin;
    }

    if (event.target.value === '0') {
      event.target.style.zIndex = '1';
    } else {
      event.target.style.zIndex = '0';
    }

    event.target.parentNode.parentNode.style.setProperty(
      '--value-max',
      event.target.valueAsNumber
    )
    selectionMaxPrice.value = event.target.valueAsNumber;
  };

  const onRangeInputMin = (event) => {
    const valueMax = parseInt(event.target.parentNode.parentNode.style.getPropertyValue('--value-max'));

    if (event.target.valueAsNumber >= valueMax) {
      event.target.value = valueMax;
    }

    if (event.target.value === '12000') {
      event.target.style.zIndex = '1';
    } else {
      event.target.style.zIndex = '0';
    }

    event.target.parentNode.parentNode.style.setProperty(
      '--value-min',
      event.target.valueAsNumber
    )
    selectionMinPrice.value = event.target.valueAsNumber;
  };

  rangeInputMax.addEventListener('input', onRangeInputMax);
  rangeInputMin.addEventListener('input', onRangeInputMin);

  /* взаимодействие с полями ввода цены */
  const onChangeMinPrice = () => {
    if (parseInt(selectionMinPrice.value) > parseInt(selectionMaxPrice.value)) {
      selectionMinPrice.value = selectionMaxPrice.value;
    } else if (parseInt(selectionMinPrice.value) < 0) {
      selectionMinPrice.value = 0;
    } else if (parseInt(selectionMinPrice.value) > 12000) {
      selectionMinPrice.value = 12000;
    }

    rangeInputMin.value = selectionMinPrice.value;
    selectionPriceSlider.style.setProperty(
      '--value-min',
      selectionMinPrice.value
    )
  };

  const onChangeMaxPrice = () => {
    if (parseInt(selectionMaxPrice.value) < parseInt(selectionMinPrice.value)) {
      selectionMaxPrice.value = selectionMinPrice.value;
    } else if (parseInt(selectionMaxPrice.value) < 0) {
      selectionMaxPrice.value = 0;
    } else if (parseInt(selectionMaxPrice.value) > 12000) {
      selectionMaxPrice.value = 12000;
    }

    rangeInputMax.value = selectionMaxPrice.value;
    selectionPriceSlider.style.setProperty(
      '--value-max',
      selectionMaxPrice.value
    )
  };

  selectionMinPrice.addEventListener('change', onChangeMinPrice);
  selectionMaxPrice.addEventListener('change', onChangeMaxPrice);

  const onResetButton = function () {
    selectionPriceSlider.style.setProperty(
      '--value-min',
      0
    );
    selectionPriceSlider.style.setProperty(
      '--value-max',
      9000
    );
  };
  selectionButtonReset.addEventListener('click', onResetButton);
}
