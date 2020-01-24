// show and hide class:accordion elements
let acc = document.getElementsByClassName("accordion");

Array.from(acc).forEach(acc_ => {
  acc_.addEventListener("click", () => {
    acc_.classList.toggle("active");
    let panel = acc_.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      acc_.innerHTML = "Show Bio";
    } else {
      panel.style.maxHeight =
        acc_.id === "biobutton" ? `${panel.scrollHeight}px` : "300px";
      acc_.innerHTML = "Hide Bio";
    }
  });
});
