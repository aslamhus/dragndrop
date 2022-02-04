class DragNDrop {
  constructor(item_prefix, drag_container, callbackFunc, dragBtn) {
    this.item_prefix = item_prefix;
    this.drag_container = document.querySelector(drag_container);
    console.log(this.drag_container);
    this._dragging;
    this._dragged_over;
    this.nodes = document.querySelectorAll(`[id^=${item_prefix}]`);
    this.callbackFunc = callbackFunc;
    this.currentX;
    this.currentY;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;

    this.dragBtn = dragBtn; // string selector dragBtn must be child of drag container
    this.initialize();
  }

  initialize() {
    // attach DOMNodeInsert event to Document
    document.addEventListener('DOMNodeInserted', this.handleDOMNodeInserted.bind(this));
    // attach events to all existing nodes

    this.nodes.forEach((node) => {
      // make sure drag container is not included in nodes
      if (node != this.drag_container) this.attachEvents(node);
    });
  }

  handleDOMNodeInserted(event) {
    const {
      target,
      target: { id },
    } = event;
    if (id.includes(this.item_prefix)) {
      if (!target.dataset.set) {
        this.attachEvents(event.target);
      }
    }
  }

  attachEvents(node) {
    node.style.position = 'relative';
    node.draggable = true;
    node.dataset.set = true; // reference for DOMNodeInserted listener
    node.style.cursor = 'grab';
    node.classList.add('dragNdrop');
    node.addEventListener('drag', this.dragging.bind(this));
    node.addEventListener('dragstart', this.dragstart.bind(this));
    node.addEventListener('dragenter', this.dragenter.bind(this));
    node.addEventListener('dragexit', this.dragexit.bind(this));
    node.addEventListener('dragover', this.dragover.bind(this));
    node.addEventListener('drop', this.drop.bind(this));
    node.addEventListener('dragend', this.dragend.bind(this));
    node.addEventListener('mousedown', this.mouseDown.bind(this));
  }

  mouseDown(event) {
    const { target } = event;
    if (this.dragBtn) {
      const dragBtnElement = target.parentElement.querySelector(this.dragBtn);
      if (dragBtnElement != target) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  dragstart(event) {
    const { target } = event;
    // dragBtn set

    if (!target.classList.contains('dragNdrop')) {
      event.preventDefault();
    }
    event.stopPropagation();
  }
  dragging(e) {
    e.preventDefault();
    e.target.style.cursor = 'grabbing';
    this._dragging = e.target.id.replace(this.item_prefix, '');
    e.target.classList.add('dragging');
  }
  dragover(e) {
    e.preventDefault();
  }

  drop(e) {
    if (this._dragged_over && this._dragged_over != this._dragging) {
      console.log('test');
      const el1 = document.querySelector(`#${this.item_prefix}${this._dragging}`);
      const el2 = document.querySelector(`#${this.item_prefix}${this._dragged_over}`);
      if (el1 && el2) {
        const insertBefore = this.drag_container.insertBefore(el1, el2);
      } else {
        return;
      }

      this.nodes = document.querySelectorAll(`[id^=${this.item_prefix}]`);
      let enumRank = [];
      this.nodes.forEach((node) => enumRank.push(node.id));
      this.callbackFunc(enumRank);
    } else {
      this.removeAllDragClasses();
    }
  }

  dragenter(e) {
    e.preventDefault();
    e.stopPropagation();
    let target = e.target;
    if (!target) {
      return;
    }
    if (!target.classList.contains('dragNdrop')) {
      target = target.closest('.dragNdrop');
    }

    this._dragged_over = target.id.replace(this.item_prefix, '');
    this.position(e, target);
  }

  dragexit(e) {
    e.preventDefault();
  }

  position(e, target) {
    if (!target.classList.contains('dragNdrop')) {
      return;
    }
    let draggedOverPos = target.getBoundingClientRect();
    var draggingPos = e.clientY;

    if (this.nodes.length <= 0) {
      this.nodes = document.querySelectorAll(`[id^=${this.item_prefix}]`);
    }
    this.nodes.forEach((el) => {
      el.style.transform = null;
    });
    if (draggedOverPos.x < e.clientX) {
      target.style.transform = 'translateX(10px)';
    }

    return;
  }

  dragend(e) {
    this.removeAllDragClasses();
  }

  removeAllDragClasses() {
    this.nodes.forEach((element) => {
      element.classList.remove('drag-over');
      element.classList.remove('dragging');
      element.style.transform = null;
      element.style.cursor = 'grab';
    });
  }
}

export default DragNDrop;
