let selectedSeat = null;

  // Mostrar las opciones al hacer clic en un asiento
  function showOptions(event, seat) {
    selectedSeat = seat;
    const options = document.getElementById('options');
    options.style.display = 'block';
    options.style.left = `${event.pageX}px`;
    options.style.top = `${event.pageY}px`;
  }

  // Cambiar el estado del asiento según la opción seleccionada
  function setStatus(status) {
    if (selectedSeat) {
      if (status === 'occupied') {
        selectedSeat.style.backgroundColor = 'red';
      } else if (status === 'damaged') {
        selectedSeat.style.backgroundColor = 'orange';
      }
    }
    closeOptions();
  }

  // Cerrar el menú de opciones
  function closeOptions() {
    document.getElementById('options').style.display = 'none';
  }

  // Cerrar el menú de opciones si se hace clic fuera de él
  window.onclick = function(event) {
    const options = document.getElementById('options');
    if (event.target !== selectedSeat && !options.contains(event.target)) {
      closeOptions();
    }
  }