import '@testing-library/jest-dom/vitest'

// jsdom does not implement HTMLDialogElement.showModal/close; polyfill them.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.show = function show() {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close = function close(returnValue) {
    if (!this.hasAttribute('open')) return
    if (returnValue !== undefined) this.returnValue = returnValue
    this.removeAttribute('open')
    this.dispatchEvent(new Event('close'))
  }
}
