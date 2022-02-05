class DragNDrop {
  constructor(item_prefix, drag_container, callbackFunc, dragBtn, axis) {
    this.item_prefix = item_prefix;
    this.drag_container = document.querySelector(drag_container);
    this._dragging;
    this._dragged_over;
    this.nodes = document.querySelectorAll(`[id^=${item_prefix}]`);
    this.callbackFunc = callbackFunc;
    this.axis = axis || 'horizontal';
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
    if (this.dragBtn) {
      const dragBtn = node.querySelector(this.dragBtn);
      dragBtn.addEventListener('mouseenter', this.mouseenter.bind(this));
    } else {
      node.addEventListener('mouseenter', this.mouseenter.bind(this));
    }
    node.addEventListener('mouseout', this.mouseout.bind(this));
  }

  position(event, target) {
    const bounds = target.getBoundingClientRect();
    const position = this.getPosition(bounds, event);
    switch (position) {
      case 'left':
        target.style.transform = 'translateX(10px)';
        break;
      case 'right':
        target.style.transform = 'translateX(-10px)';
        break;
      case 'top':
        target.style.transform = 'translateY(10px)';
        break;
      case 'bottom':
        target.style.transform = 'translateY(-10px)';
        break;
    }

    return position;
  }

  getPosition(bounds, event) {
    let position, midPos, mousePos;
    const { clientX, clientY, screenX, screenY } = event;
    const { width, height, x, y, left, top } = bounds;
    switch (this.axis) {
      case 'horizontal':
        midPos = left + width / 2;
        mousePos = clientX;
        if (mousePos < midPos) {
          position = 'left';
        } else if (mousePos > midPos) {
          position = 'right';
        }
        break;
      case 'vertical':
        midPos = top + height / 2;
        mousePos = clientY;
        if (mousePos < midPos) {
          position = 'top';
        } else if (mousePos > midPos) {
          position = 'bottom';
        }
        break;
      default:
        throw new Error('axis not set for dragndrop');
    }
    return position;
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
      if (target == dragBtnElement || target.closest(this.dragBtn)) {
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
    const dragOverEl = this.findDragNDropElement(e.target);
    if (!dragOverEl) return;

    this.position(e, dragOverEl);
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

    // remove drag over class on previous dragged over item
    if (this._dragged_over != this._dragging && dragItemId != '') {
      const dragLeaveEl = this.drag_container.querySelector(
        `#${this.item_prefix}${this._dragged_over}`
      );
      // remove drag-over class and transform
      if (dragLeaveEl) {
        console.log('remove drag-over', dragLeaveEl);
        dragLeaveEl.classList.remove('drag-over');
        dragLeaveEl.style.removeProperty('transform');
      }
    }
    // set the dragged over id
    this._dragged_over = dragItemId;
    // give dragged over element drag-over class (unless we are dragging over the grabbed item)
    if (this._dragged_over != this._dragging) {
      dragOverEl.classList.add('drag-over');
    }
  }

  findDragNDropElement(target) {
    let dragNdropEl;
    if (!target.classList.contains('dragNdrop')) {
      dragNdropEl = target.closest('.dragNdrop');
    } else {
      dragNdropEl = target;
    }
    return dragNdropEl;
  }

  dragexit(event) {
    event.preventDefault();
  }

  dragleave(event) {
    event.preventDefault();
  }

  insertAfter(a, b) {
    const parent = a.parentElement;
    const nextSibling = b.nextSibling;
    if (nextSibling) {
      parent.insertBefore(a, nextSibling);
    } else {
      // there is no next sibling, therefore append
      parent.append(a);
    }
    return a;
  }

  drop(e) {
    e.preventDefault();
    document.body.style.cursor = 'auto';
    const position = this.position(e, e.target);
    if (this._dragged_over && this._dragged_over != this._dragging) {
      const el1 = document.querySelector(`#${this.item_prefix}${this._dragging}`);
      const el2 = document.querySelector(`#${this.item_prefix}${this._dragged_over}`);
      // add drop item to dom hierarchy
      if (el1 && el2) {
        if (position == 'left' || position == 'top') {
          const insertBefore = this.drag_container.insertBefore(el1, el2);
        } else if (position == 'right' || position == 'bottom') {
          const insertAfter = this.insertAfter(el1, el2);
        }
      } else {
        return;
      }
      // get new order from dom
      this.nodes = document.querySelectorAll(`[id^=${this.item_prefix}]`);
      let enumRank = [];
      this.nodes.forEach((node) => enumRank.push(node.id));
      this.callbackFunc(enumRank);
    } else {
      this.removeAllDragClasses();
    }
  }

  dragend(e) {
    e.preventDefault();
    this.removeAllDragClasses();
  }

  removeAllDragClasses() {
    this.nodes.forEach((element) => {
      element.classList.remove('drag-over');
      element.classList.remove('dragging');
      element.style.transform = '';
      element.style.opacity = 1;
    });

    document.body.style.setProperty('cursor', 'auto', 'important');
  }
}

export default DragNDrop;
