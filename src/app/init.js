
const innerPriceHeader = () => {
    // ЗАПИСЬ В ШАПКУ ТОТАЛ ПРАЙС
    totalpriceElements.forEach((e) => {
      e.innerHTML = numberWithSpaces(totalPrice)
    })
  }
  
  // ОБНОВЛЕНИЕ ЧЕКА
async function updateCheck() {
    totalSaleCheck() // Предполагается, что totalSaleCheck() возвращает числовое значение скидки
    checkDopOtionShow()
    checkDopOptions()
  
    if (saleAll && saleAll !== 0) {
      ;(discountCheck.style.display = 'flex'),
        (priceItemDiscount.style.display = 'flex')
    } else {
      ;(discountCheck.style.display = 'none'),
        (priceItemDiscount.style.display = 'none')
    }
  
    await sumCarPrices(updatedCarState, myPriceModels)
    totalpriceElements.forEach((e) => {
      e.innerHTML = numberWithSpaces(sumCarPrices(carState, myPriceModels))
    })
  
    // Вставляем выбранные цвета, диски и салон
    colorKuzovaElements.forEach((element) => {
      element.textContent = carState.options.color[1]
    })
  
    colorSalonaElements.forEach((element) => {
      element.textContent = carState.options.interiorColor[1]
    })
  
    diskElements.forEach((element) => {
      element.textContent = `${carState.options.wheels[1]}`
    })
  
    priceColorElements.forEach((element) => {
      element.textContent = ` ${numberWithSpaces(carState.options.color[0])} руб.`
    })
  
    priceColorSalonElements.forEach((element) => {
      element.textContent = `${numberWithSpaces(
        carState.options.interiorColor[0]
      )} руб.`
    })
  
    priceDiskElements.forEach((element) => {
      element.textContent = ` ${numberWithSpaces(
        carState.options.wheels[0]
      )} руб.`
    })
  
    // Вычисляем и вставляем общую скидку
  
    totalSaleCarElements.forEach((element) => {
      element.innerHTML =
        saleAll === 0 || saleAll === null || saleAll === undefined
          ? 'Нет'
          : `${saleAll} руб.`
    })
    // Вычисляем и вставляем общую стоимость
    totalPriceCarElements.forEach((element) => {
      element.textContent = `${numberWithSpaces(
        sumCarPrices(carState, myPriceModels)
      )} руб.`
    })
  }

const updateWebsite = () => {
    // Сохраняем слайды
    savedSlides.colorCarousel = colorCarousel.swiper.slides
    savedSlides.colorImageCarousel = colorImageCarousel.swiper.slides
    savedSlides.diskDiametr = diskDiametr.swiper.slides
    savedSlides.diskImage = diskImage.swiper.slides
    savedSlides.colorSalon = colorSalon.swiper.slides
    savedSlides.salonImage = salonImage.swiper.slides
  
    //сохраняем объект стейта
    originalColorOptions = [...carState.options.color[2]]
    originalWheelsOptions = [...carState.options.wheels[2]]
    originalInteriorColorOptions = [...carState.options.interiorColor[2]]
  
    carState.options.runningBoards[0].forEach((option, index) => {
      const child = children[index]
      const checkbox = document.getElementById(child.id)
      const checkboxInput = checkbox.querySelector(`#${child.id}`)
      if (!option.check) {
        checkboxInput.checked = true
      }
    })
  
    //Вычисляем количество моделей для выравнивания
    const m = document.querySelectorAll('#carget-models .elementor-column').length
    let divisor
    if (m === 1) {
      divisor = 1
    } else if (m % 2 === 0) {
      divisor = 2
    } else {
      divisor = 3
    }
    document.querySelectorAll('#carget-models .elementor-column').forEach((e) => {
      e.style.width = `${96 / divisor}%`
    })
  
    // ПРОВЕРКА НА ДИСКИ TRUE FALSE
    if (carState.options.wheels[3] === true) {
      myArrowDiskImages = saveAllSlides(diskImage.swiper)
  
      updateCaruselDisk(`${carState.options.color[1]}-0`)
      // Другие операции с дисками или что угодно, что нужно выполнить, если wheels[3] === true
    } else if (
      carState.options.wheels[3] === false &&
      colorImageCarousel.swiper
    ) {
      myArrowDiskImages = saveAllSlides(colorImageCarousel.swiper)
  
      document.querySelectorAll(arrayWrappers[1]).forEach((e) => {
        e.style.display = 'none'
      })
    }
  
    checkDopOtionShow()
  
    closeAccordions()
    updateButtonState(carState)
    updateFlexWrapModelsContainer()
    updateCheck(totalPrice)
    innerPriceHeader()
    innerPriceTitleModels()
    updateTitlePrice()
    myPDF()
  }

//функции прослушиватели
const handleColorCarouselChange = async (e) => {
  colorCarousel.swiper.params.centeredSlides = true
  colorCarousel.swiper.params.slideToClickedSlide = true
  colorCarousel.swiper.update()
  if (isUpdatingCarousel) {
    return
  }

  try {
    colorImageCarousel.swiper.enable()
    // Установите флаг блокировки
    isUpdatingCarousel = true
    let currentColor, currentPrice

    //здесь была прокрутка на 2 слайда
    if (colorImageCarousel.swiper.slideTo(e.realIndex + 1, 400)) {
      colorImageCarousel.swiper.slideTo(e.realIndex + 1, 400)
      const index = carState.options.color[2].length <= 1 ? 0 : e.realIndex
      currentColor = await indexOption('color', index, 'index').color
      currentPrice = await indexOption('color', index, 'index').price
    } else {
      colorImageCarousel.swiper.slideTo(e.realIndex + 2, 400)
      const index = carState.options.color[2].length <= 1 ? 0 : e.realIndex + 1
      currentColor = await indexOption('color', index, 'index').color
      currentPrice = await indexOption('color', index, 'index').price
    }

    carState.options.color[0] = currentPrice
    carState.options.color[1] = currentColor

    if (carState.options.wheels[3] === true) {
      await updateCaruselDisk(`${currentColor}-${indexDisk}`)
    }
    await updateTitlePrice()

    isUpdatingCarousel = false
    colorCarousel.querySelectorAll('.elementor-swiper-button').forEach((e) => {
      if (colorCarousel.swiper.slides.length <= 1) {
        e.style.display = 'none'
      } else {
        e.style.display = 'inline-flex'
      }
    })
    colorImageCarousel.swiper.disable()
  } catch (error) {
    console.error('Error in handleColorCarouselChange event:', error)
    isUpdatingCarousel = false
  }
}
const handleColorImageCarouselChange = async (e) => {
  colorCarousel.swiper.params.slideToClickedSlide = true
  colorCarousel.swiper.update()

  // Проверяем, не выполняется ли уже обновление карусели
  if (isUpdatingCarousel) {
    return
  }
  // Устанавливаем флаг блокировки
  isUpdatingCarousel = true

  carState.options.color[0] = carState.options.color[2][e.realIndex].price
  carState.options.color[1] = indexColor(e.realIndex, 'index')

  if (carState.options.wheels[3] === true) {
    updateCaruselDisk(
      `${
        carState.options.color[2].length <= 1
          ? indexOption('color', 0, 'index').color
          : indexOption('color', e.realIndex, 'index').color
      }-0`
    )
  } else if (carState.options.wheels[3] === false) {
    setTimeout(() => {
      updateTitlePrice()
    }, 200)
  }

  colorCarousel.swiper.slideTo(
    e.realIndex + colorCarousel.swiper.params.slidesPerView,
    500
  )

  // Сбрасываем флаг после завершения обновления карусели
  isUpdatingCarousel = false
}

document.addEventListener('DOMContentLoaded', async (event) => {
  // Ожидаем, пока слайдер будет инициализирован
  const waitForSlider = () => {
    return new Promise((resolve) => {
      const checkSlider = () => {
        if (colorCarousel && colorCarousel.swiper) {
          resolve()
        } else {
          // Если слайдер ещё не готов, проверяем снова через небольшой интервал
          setTimeout(checkSlider, 100)
        }
      }

      checkSlider()
    })
  }
  // Дожидаемся инициализации САЙТА
  await waitForSlider()
  //  ОБНОВЛЕНИЯ САЙТА (КАРУСЕЛИ, АККОРДИОН, ШАПКА)
  // ОБНОВИТЬ СТОИМОСТb В ШАПКЕ, В МОДЕЛЯХ H2
  // Устанавливаем параметр centeredSlides для colorCarousel и colorSalon, если объекты определены

  if (colorCarousel && colorCarousel.swiper) {
    colorCarousel.swiper.on('activeIndexChange', handleColorCarouselChange)
  }

  if (colorImageCarousel && colorImageCarousel.swiper) {
    colorImageCarousel.swiper.on(
      'activeIndexChange',
      handleColorImageCarouselChange
    )
  }

  // Проверка на существование colorSalon.swiper
  if (colorSalon && colorSalon.swiper) {
    // Устанавливаем значение centeredSlides
    colorSalon.swiper.params.centeredSlides = true
    // Устанавливаем значение slideToClickedSlide
    colorSalon.swiper.params.slideToClickedSlide = true
    // Обновляем swiper
    colorSalon.swiper.update()

    colorSalon.swiper.on('activeIndexChange', async (e) => {
      // Проверьте, не выполняется ли уже обновление карусели
      if (isUpdatingCarousel) {
        return
      }

      // Установите флаг блокировки
      try {
        salonImage.swiper.enable()
        isUpdatingCarousel = true

        const currentColor = indexOption(
          'interiorColor',
          e.realIndex,
          'index'
        ).color
        const currentPrice = indexOption(
          'interiorColor',
          e.realIndex,
          'index'
        ).price
        let activeSlideAlt
        if (colorSalon.querySelector('.swiper-slide-active img')) {
          activeSlideAlt = colorSalon.querySelector(
            '.swiper-slide-active img'
          ).alt
        } else {
          setTimeout(() => {
            activeSlideAlt = colorSalon.querySelector(
              '.swiper-slide-active img'
            ).alt
          }, 1000)
        }

        const slideIndex = findSlideIndexByAlt(colorSalon, activeSlideAlt)
        carState.options.interiorColor[0] = currentPrice
        carState.options.interiorColor[1] = currentColor

        if (slideIndex !== -1) {
          salonImage.swiper.slideTo(e.realIndex + 1, 400)
        }
        updateTitlePrice()
        isUpdatingCarousel = false
        colorSalon.querySelectorAll('.elementor-swiper-button').forEach((e) => {
          if (colorSalon.swiper.slides.length <= 1) {
            e.style.display = 'none'
          } else {
            e.style.display = 'inline-flex'
          }
        })
        salonImage.swiper.disable()
      } catch (error) {
        console.error('Error in diskDiametr activeIndexChange event:', error)
        isUpdatingCarousel = false
      }
    })
  }
  if (salonImage && salonImage.swiper) {
    salonImage.swiper.on('activeIndexChange', async (e) => {
      // Проверьте, не выполняется ли уже обновление карусели
      if (isUpdatingCarousel) {
        return
      }

      try {
        isUpdatingCarousel = true

        const currentColor = indexOption(
          'interiorColor',
          e.realIndex,
          'index'
        ).color
        const currentPrice = indexOption(
          'interiorColor',
          e.realIndex,
          'index'
        ).price
        const activeSlideAlt = colorSalon.querySelector(
          '.swiper-slide-active img'
        ).alt

        const slideIndex = findSlideIndexByAlt(colorSalon, activeSlideAlt)

        if (slideIndex !== -1) {
          carState.options.interiorColor[0] = currentPrice
          carState.options.interiorColor[1] = currentColor
          colorSalon.swiper.slideTo(
            e.realIndex + colorSalon.swiper.params.slidesPerView,
            400
          )
          updateTitlePrice()
        }

        isUpdatingCarousel = false
      } catch (error) {
        console.error('Error in diskImage activeIndexChange event:', error)
        isUpdatingCarousel = false
      }
    })
  }

  // Проверка на существование diskDiametr.swiper
  if (diskDiametr && diskDiametr.swiper) {
    diskDiametr.swiper.params.centeredSlides = true

    diskDiametr.swiper.params.slideToClickedSlide = true
    // Обновляем swiper
    diskDiametr.swiper.update()

    diskDiametr.swiper.on('activeIndexChange', async (e) => {
      if (isUpdatingCarousel) {
        return
      }

      try {
        isUpdatingCarousel = true

        const currentColor = indexOption('wheels', e.realIndex, 'index').color
        const currentPrice = indexOption('wheels', e.realIndex, 'index').price
        let activeSlideAlt = null
        // Проверяем существование объекта diskDiametr и вызываем метод querySelector
        if (diskDiametr) {
          // Вызываем метод querySelector для объекта diskDiametr
          const activeSlide = diskDiametr.querySelector(
            '.swiper-slide-active img'
          )
          // Проверяем, что activeSlide не равен null или undefined
          if (activeSlide) {
            // Если activeSlide существует, получаем значение атрибута alt
            activeSlideAlt = activeSlide.alt
          }
        }

        const slideIndex = findSlideIndexByAlt(diskDiametr, activeSlideAlt)

        if (slideIndex !== -1) {
          carState.options.wheels[0] = currentPrice
          carState.options.wheels[1] = currentColor
          diskImage.swiper.enable()
          diskImage.swiper.slideTo(e.realIndex + 1, 400)
          diskImage.swiper.disable()
          updateTitlePrice()
        }

        isUpdatingCarousel = false
      } catch (error) {
        console.error('Error in diskDiametr activeIndexChange event:', error)
        isUpdatingCarousel = false
      }
    })
  }
  if (diskImage && diskImage.swiper) {
    diskImage.swiper.on('activeIndexChange', async (e) => {
      if (isUpdatingCarousel) {
        return
      }

      try {
        isUpdatingCarousel = true

        const currentColor = indexOption('wheels', e.realIndex, 'index').color
        const currentPrice = indexOption('wheels', e.realIndex, 'index').price
        let activeSlideAlt = null
        // Проверяем существование объекта diskDiametr и вызываем метод querySelector
        if (diskDiametr) {
          // Вызываем метод querySelector для объекта diskDiametr
          const activeSlide = diskDiametr.querySelector(
            '.swiper-slide-active img'
          )
          // Проверяем, что activeSlide не равен null или undefined
          if (activeSlide) {
            // Если activeSlide существует, получаем значение атрибута alt
            activeSlideAlt = activeSlide.alt
          }
        }

        const slideIndex = findSlideIndexByAlt(diskDiametr, activeSlideAlt)

        if (slideIndex !== -1) {
          carState.options.wheels[0] = currentPrice
          carState.options.wheels[1] = currentColor
          diskDiametr.swiper.slideTo(
            e.realIndex + diskDiametr.swiper.params.slidesPerView,
            400
          )
          updateTitlePrice()
        }

        isUpdatingCarousel = false
      } catch (error) {
        console.error('Error in diskImage activeIndexChange event:', error)
        isUpdatingCarousel = false
      }
    })
  }

  fetchCurrencyRates().then((data) => {
    updatedCarState = convertCarState(carState)
    if (updatedCarState) {
      myPriceModels = sumCarModelsPrices(updatedCarState)
    }
    if (myPriceModels) {
      sumCarPrices(updatedCarState, myPriceModels)
      updateWebsite()
      console.log('Сайт загружен и готов к работе')
      myPDF()
      // Определение элементов каждой модели в аккордионах
      cargetLoader.style.display = 'none'
      loader.style.display = 'none'
    }
  })
  updateDopOptions()
  // СЛУШАТЕЛИ ----------------- СЛУШАТЕЛИ //
  // Обработчик для кнопки "ВЫБРАНО"
  modelNames.forEach((modelName) => {
    createAndAttachButtonClickHandler(modelName)
  })

  document.querySelectorAll('.generate-pdf').forEach((e) => {
    e.addEventListener('click', async function () {
      e.style.opacity = '0.4'
      e.style.pointerEvents = 'none'
      await myPDF()
      if (pdfDoc) {
        console.log('pdfDoc', pdfDoc)
        pdfDoc.download(`${carState.model[0]} ${carState.model[1]}.pdf`)
        setTimeout(() => {
          e.style.opacity = '1'
          e.style.pointerEvents = 'auto'
        }, 200)
      }
    })
  })
})
