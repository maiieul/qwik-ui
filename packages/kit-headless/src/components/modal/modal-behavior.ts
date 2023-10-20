import { QRL, QwikMouseEvent } from '@builder.io/qwik';
import { FocusTrap, createFocusTrap } from 'focus-trap';

/**
 * Traps the focus of the given Modal
 * @returns FocusTrap
 */
export function trapFocus(modal: HTMLDialogElement): FocusTrap {
  return createFocusTrap(modal, { escapeDeactivates: false });
}

export function activateFocusTrap(focusTrap: FocusTrap | null) {
  try {
    focusTrap?.activate();
  } catch {
    // Activating the focus trap throws if no tabbable elements are inside the container.
    // If this is the case we are fine with not activating the focus trap.
    // That's why we ignore the thrown error.
  }
}

/**
 * Deactivates the given FocusTrap
 */
export function deactivateFocusTrap(focusTrap: FocusTrap | null) {
  focusTrap?.deactivate();
  focusTrap = null;
}

/**
 * Shows the given Modal.
 * Applies CSS-Class to animate the modal-showing.
 * Calls the given callback that is executed after the Modal has been opened.
 */
export async function showModal(modal: HTMLDialogElement, onShow$?: QRL<() => void>) {
  modal.showModal();
  opening(modal);
  await onShow$?.();
}

/**
 * Closes the given Modal.
 * Applies CSS-Class to animate the Modal-closing.
 * Calls the given callback that is executed after the Modal has been closed.
 */
export async function closeModal(modal: HTMLDialogElement, onClose$?: QRL<() => void>) {
  modal.close();
  modal.classList.remove('modal-showing');
  await onClose$?.();
}

/**
 * Determines if the backdrop of the Modal has been clicked.
 */
export function wasModalBackdropClicked(
  modal: HTMLDialogElement | undefined,
  clickEvent: QwikMouseEvent,
): boolean {
  if (!modal) {
    return false;
  }

  const rect = modal.getBoundingClientRect();

  const wasBackdropClicked =
    rect.left > clickEvent.clientX ||
    rect.right < clickEvent.clientX ||
    rect.top > clickEvent.clientY ||
    rect.bottom < clickEvent.clientY;

  return wasBackdropClicked;
}

/**
 * Locks scrolling of the document.
 */
export function lockScroll() {
  window.document.body.style.overflow = 'hidden';
}

export type WidthState = {
  width: number | null;
};

/**
 * Unlocks scrolling of the document.
 * Adjusts padding of the given scrollbar.
 */
export function unlockScroll(scrollbar: WidthState) {
  window.document.body.style.overflow = '';

  const currentPadding = parseInt(document.body.style.paddingRight);
  if (scrollbar.width) {
    document.body.style.paddingRight = `${currentPadding - scrollbar.width}px`;
  }
}

/**
 *
 * Adjusts scrollbar padding
 * TODO: Why???
 *
 */
export function adjustScrollbar(scrollbar: WidthState, modal: HTMLDialogElement) {
  if (scrollbar.width === null) {
    scrollbar.width = window.innerWidth - document.documentElement.clientWidth;
  }

  modal.style.left = `0px`;
  document.body.style.paddingRight = `${scrollbar.width}px`;
}

export function overrideNativeDialogEscapeBehaviorWith(continuation: () => void) {
  return function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();

      continuation();
    }
  };
}

/**
 * When the Modal is closed we are enabling scrolling again.
 * This means the scrollbar will reappear in the browser.
 * The scrollbar has a width and causes the Modal to reposition.
 *
 * That's why we take the scrollbar-width into account so that the
 * Modal remains in the same position as before.
 */
export function keepModalInPlaceWhileScrollbarReappears(
  scrollbar: WidthState,
  modal?: HTMLDialogElement,
) {
  if (!modal) return;

  if (scrollbar.width) {
    const modalLeft = parseInt(modal.style.left);

    modal.style.left = `${scrollbar.width - modalLeft}px`;
  }
}

/*
 * Listens for animation/transition events in order to
 * remove Animation-CSS-Classes after animation/transition ended.
 */
export function closing(modal: HTMLDialogElement, onClose$?: QRL<() => void>) {
  if (!modal) {
    return;
  }

  modal.classList.add('modal-closing');

  const { animationDuration, transitionDuration } = getComputedStyle(modal);

  const runAnimationEnd = () => {
    modal.classList.remove('modal-closing');
    closeModal(modal, onClose$);
  };

  const runTransitionEnd = () => {
    modal.classList.remove('modal-closing');
    closeModal(modal, onClose$);
  };

  if (animationDuration !== '0s') {
    modal.addEventListener('animationend', runAnimationEnd, { once: true });
  } else if (transitionDuration !== '0s') {
    modal.addEventListener('transitionend', runTransitionEnd, { once: true });
  } else {
    modal.classList.remove('modal-closing');
    closeModal(modal, onClose$);
  }
}

/*
 * Adds CSS-Class to support modal-opening-animation
 */
export function opening(modal: HTMLDialogElement) {
  if (!modal) return;

  modal.classList.add('modal-showing');
}
