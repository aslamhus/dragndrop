class DragNDrop {
  constructor(item_prefix, drag_container, callbackFunc) {
    this.item_prefix = item_prefix;
    this.drag_container = document.querySelector(drag_container);
    this._dragging;
    this._dragged_over;
    this.nodes = document.querySelectorAll(`[id^=${item_prefix}]`);
    document.addEventListener('DOMNodeInserted', (e) => {
      if (e.target) {
        if (e.target.id) {
          if (e.target.id.includes(this.item_prefix)) {
            if (!e.target.dataset.set) {
              console.log('attach');
              this.attachEvents(e.target);
            }
          }
        }
      } else {
        return;
      }
    });
    this.nodes.forEach((node) => {
      this.attachEvents(node);
    });
    this.callbackFunc = callbackFunc;
    this.currentX;
    this.currentY;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
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
  }

  dragstart(e) {
    console.log(e.target);
    if (!e.target.classList.contains('dragNdrop')) {
      e.preventDefault();
    }
    e.stopPropagation();
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
      let el1 = document.querySelector(`#${this.item_prefix}${this._dragging}`);
      let el2 = document.querySelector(`#${this.item_prefix}${this._dragged_over}`);
      el1.remove();
      this.drag_container.insertBefore(el1, el2);
      this.nodes = document.querySelectorAll(`[id^=${this.item_prefix}]`);
      let enumRank = [];
      this.nodes.forEach((node) => enumRank.push(node.id));
      this.callbackFunc(enumRank);
      return;
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
      el.style.left = null;
    });
    if (draggedOverPos.x < e.clientX) {
      target.style.left = '35px';
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
      element.style.left = null;
      element.style.cursor = 'grab';
    });
  }
}

export default DragNDrop;

// touchStart(e){
//     this.initialX = e.touches[0].clientX - this.xOffset;
//     this.initialY = e.touches[0].clientY - this.yOffset;
//     let testimonial = e.target.closest("div.testimonial");
//     testimonial.style.opacity = 0.5;
// }

// touchMove(e){
//     this.currentX = e.touches[0].clientX - this.initialX;
//     this.currentY = e.touches[0].clientY - this.initialY;
//     let testimonial = e.target.closest("div.testimonial");
//     testimonial.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
//     console.log("currentX", this.currentX)

// }

// touchEnd(e){

//     let testimonial = e.target.closest("div.testimonial");
//     console.log(testimonial.style.transform)
//     testimonial.style.transform = "translate3d(" + 0 + "px, " + 0 + "px, 0)";
//     testimonial.style.opacity = 1;

// }
