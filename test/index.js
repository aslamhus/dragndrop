window.onload = function () {
  var info = document.querySelector('#info');
  document.onmousemove = (event) => {
    info.innerHTML = 'clientX: ' + event.clientX;
  };

  const button = document.querySelector('#add-item-btn');
  button.onclick = addItem;
};

const addItem = () => {
  const items = Array.from(document.querySelectorAll('.item'));
  const lastItemNumber = items[items.length - 1].id.replace('item_', '');
  const newItem = document.createElement('div');
  const itemName = `item_${parseInt(lastItemNumber) + 1}`;
  newItem.id = itemName;
  newItem.classList.add('item');
  newItem.innerHTML = itemName;
  newItem.style.background = '#' + Math.floor(Math.random() * 16777215).toString(16);
  const dragMeBtn = document.createElement('button');
  dragMeBtn.innerHTML = 'Drag Me';
  newItem.append(dragMeBtn);
  const itemList = document.querySelector('#item_list');
  itemList.append(newItem);
};
