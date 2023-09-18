import { Directive } from "vue";

export const TouchedDirective: Directive = (el: HTMLElement) => {
  const opts = {
    once: true,
  };
  const addClass = () => {
    el.classList.add("touched");
    el.removeEventListener("blur", addClass);
    el.removeEventListener("change", addClass);
  };
  el.addEventListener("blur", addClass, opts);
  el.addEventListener("change", addClass, opts);
};
