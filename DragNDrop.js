class DragNDrop {
  constructor(item_prefix, drag_container, callbackFunc, dragBtn) {
    this.item_prefix = item_prefix;
    this.drag_container = document.querySelector(drag_container);
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
    if (id?.includes(this.item_prefix)) {
      if (!target.dataset.set) {
        this.attachEvents(event.target);
      }
    }
  }

  attachEvents(node) {
    node.style.position = 'relative';
    node.draggable = true;
    node.dataset.set = true; // reference for DOMNodeInserted listener

    node.classList.add('dragNdrop');
    // allows us to override any native cursor settings
    // (for instance if a button is the target drag element its native
    // cursor will be auto)
    if (this.dragBtn) {
      node.querySelector(this.dragBtn).style.setProperty('cursor', 'inherit', 'important');
    } else {
    }
    node.addEventListener('drag', this.dragging.bind(this));
    node.addEventListener('dragstart', this.dragstart.bind(this));
    node.addEventListener('dragenter', this.dragenter.bind(this));
    node.addEventListener('dragleave', this.dragleave.bind(this));
    node.addEventListener('dragexit', this.dragexit.bind(this));
    node.addEventListener('dragover', this.dragover.bind(this));
    node.addEventListener('drop', this.drop.bind(this));
    node.addEventListener('dragend', this.dragend.bind(this));
    node.addEventListener('mousedown', this.mousedown.bind(this));
    node.addEventListener('mouseenter', this.mouseenter.bind(this));
    node.addEventListener('mouseout', this.mouseout.bind(this));
  }

  position(e, target) {
    console.log(target);
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

  mousedown(event) {
    const { target } = event;
    // if a dragBtn is set, only allow dragging when clicking on the dragBtn element
    if (this.dragBtn) {
      const dragBtnElement = target.parentElement.querySelector(this.dragBtn);
      if (!target.closest(this.dragBtn)) {
        // prevent dragging
        event.preventDefault();
        event.stopPropagation();
      } else {
        // continue dragging and set cursor to grab
        document.body.style.setProperty('cursor', 'grab', 'important');
      }
    } else {
      // no dragBtn set, cursor is
      document.body.style.setProperty('cursor', 'grab', 'important');
    }
  }

  mouseenter(event) {
    // if a dragBtn is set, only display grab cursor when hovering over it, and not its parent node
    const { target } = event;
    if (this.dragBtn) {
      const dragBtnElement = target.parentElement.querySelector(this.dragBtn);
      if (dragBtnElement == target) {
        document.body.style.setProperty('cursor', 'grab', 'important');
      }
    } else {
      document.body.style.setProperty('cursor', 'grab', 'important');
    }
  }

  mouseout(event) {
    document.body.style.setProperty('cursor', 'auto', 'important');
  }

  dragstart(event) {
    const { target } = event;
    if (!target.classList.contains('dragNdrop')) {
      event.preventDefault();
    }
    event.stopPropagation();
  }

  dragging(event) {
    event.preventDefault();
    const { target } = event;
    this._dragging = target.id.replace(this.item_prefix, '');
    target.classList.add('dragging');
    target.style.opacity = 0;
    document.body.style.setProperty('cursor', 'grabbing', 'important');
  }

  dragover(e) {
    e.preventDefault();
  }

  dragenter(event) {
    event.preventDefault();
    event.stopPropagation();
    const {
      target,
      target: { id },
    } = event;
    if (!target) {
      return;
    }
    // looks for closest parent element with dragNdrop class
    const dragOverEl = this.findDragNDropElement(target);
    if (!dragOverEl) return;
    // get dragged over id (without prefix)
    const dragItemId = dragOverEl.id.replace(this.item_prefix, '');
    // give dragged over element drag-over class
    dragOverEl.classList.add('drag-over');
    // and remove drag over class on previous dragged over item
    if (this._dragged_over != dragItemId && dragItemId != '') {
      const dragLeaveEl = this.drag_container.querySelector(
        `#${this.item_prefix}${this._dragged_over}`
      );
      // remove drag-over class and transform
      if (dragLeaveEl) {
        dragLeaveEl.classList.remove('drag-over');
        dragLeaveEl.style.removeProperty('transform');
      }
    }

    this._dragged_over = dragItemId;
    this.position(event, dragOverEl);
  }

  findDragNDropElement(target) {
    let dragNdropEl;
    if (!target.classList.contains('dragNdrop')) {
      dragNdropEl = target.closest('.dragNdrop');
    }
    return dragNdropEl;
  }

  dragexit(event) {
    event.preventDefault();
  }

  dragleave(event) {
    event.preventDefault();
  }

  drop(e) {
    document.body.style.cursor = 'auto';
    if (this._dragged_over && this._dragged_over != this._dragging) {
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

  dragend(e) {
    this.removeAllDragClasses();
  }

  removeAllDragClasses() {
    this.nodes.forEach((element) => {
      element.classList.remove('drag-over');
      element.classList.remove('dragging');
      element.style.transform = null;
      element.style.opacity = 1;
    });

    document.body.style.setProperty('cursor', 'auto', 'important');
  }
}

export default DragNDrop;
