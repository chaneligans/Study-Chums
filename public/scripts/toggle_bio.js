// show and hide biography
// i'm not sure why but this only works when it's below the button
let i, acc = document.getElementsByClassName("accordion");

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {

    this.classList.toggle("active");
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      // panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.maxHeight = "300px";
    }
  });
}
