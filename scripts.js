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


}

/* слайдер в форме поиска гостиниц */

const selectionRangeScale = document.querySelector('.selection__range-scale');

if (selectionRangeScale) {
  const selectionRangeBar = selectionRangeScale.querySelector('.selection__range-bar');
  const selectionRangeMin = selectionRangeScale.querySelector('.selection__range-min');
  const selectionRangeMax = selectionRangeScale.querySelector('.selection__range-max');

  let selectionRangeScaleRect = selectionRangeScale.getBoundingClientRect(); // определяем размер и координаты блока слайдера относительно вьюпорта
  let rightEdgeMinButton = 25;
  let leftEdgeMaxButton = 283;

  /* левая кнопка */
  const onMouseMoveChangeMinStyle = (evt) => {
    const selectionRangeBarNum = evt.clientX - selectionRangeScaleRect.left;
    if (leftEdgeMaxButton > rightEdgeMinButton && rightEdgeMinButton >= 30) {
      selectionRangeBar.style.left = `${selectionRangeBarNum + 5}px`;
      selectionRangeMin.style.left = `${selectionRangeBarNum - 5}px`;
    }
    rightEdgeMinButton = selectionRangeBarNum + 25;
  };

  const onMouseDownStartChangeMin = () => {
    onMouseUpEndChangeMax();
    selectionRangeScale.addEventListener('mousemove', onMouseMoveChangeMinStyle);
  };

  const onMouseUpEndChangeMin = () => {
    selectionRangeScale.removeEventListener('mousemove', onMouseMoveChangeMinStyle);
  };

  selectionRangeMin.addEventListener('mousedown', onMouseDownStartChangeMin);
  selectionRangeMin.addEventListener('mouseup', onMouseUpEndChangeMin);

  /* правая кнопка */
  const onMouseMoveChangeMaxStyle = (evt) => {
    const selectionRangeBarNum = selectionRangeScaleRect.right - evt.clientX;
    if (selectionRangeBarNum >= 0 && leftEdgeMaxButton > rightEdgeMinButton && leftEdgeMaxButton <= 278) {
      selectionRangeBar.style.right = `${selectionRangeBarNum}px`;
      selectionRangeMax.style.right = `${selectionRangeBarNum - 5}px`;
    }
    leftEdgeMaxButton = 288 - selectionRangeBarNum - 5;
  };


  const onMouseDownStartChangeMax = function () {
    onMouseUpEndChangeMin();
    selectionRangeScale.addEventListener('mousemove', onMouseMoveChangeMaxStyle);
  };

  const onMouseUpEndChangeMax = () => {
    selectionRangeScale.removeEventListener('mousemove', onMouseMoveChangeMaxStyle);
  };

  selectionRangeMax.addEventListener('mousedown', onMouseDownStartChangeMax);
  selectionRangeMax.addEventListener('mouseup', onMouseUpEndChangeMax);

  /* */
  const onMouseoutEndChangeSlider = () => {
    onMouseUpEndChangeMin();
    onMouseUpEndChangeMax();
  };
  selectionRangeScale.addEventListener('mouseout', onMouseoutEndChangeSlider);

  /* на случай изменения разера эерана */
  window.addEventListener('resize', () => {
    selectionRangeScaleRect = selectionRangeScale.getBoundingClientRect();
  });
}
