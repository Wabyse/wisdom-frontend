export function scrollDown(ref) {
        // First, reset the scroll to the top of the page
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Wait for 500ms(0.5sec) before scrolling to the div
        setTimeout(() => {
          if (ref.current) {
            const divPosition = ref.current.offsetTop;
            window.scrollTo({ top: divPosition, behavior: "smooth" });
          }
        }, 500);
}