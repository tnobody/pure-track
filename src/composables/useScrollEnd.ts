export const waitForScrollEnd = async (el: HTMLElement) => {
  return new Promise<void>((res) => {
    const timeout = 50;
    let timeoutId: number | null = null;
    function handleScroll() {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        el.removeEventListener("scroll", handleScroll);
        res();
      }, timeout);
    }
    el.addEventListener("scroll", handleScroll);
  });
};
