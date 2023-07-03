export const waitForScrollEnd = async (el: HTMLElement) => {
  return new Promise<void>((res) => {
    const timeout = 50;
    let timeoutId: number | null = null;
    console.log("Wait", el);
    function handleScroll() {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        console.log("Fired");
        el.removeEventListener("scroll", handleScroll);
        res();
      }, timeout);
    }
    el.addEventListener("scroll", handleScroll);
  });
};
