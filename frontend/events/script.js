document.addEventListener("DOMContentLoaded", function () {
    let tabs = document.querySelectorAll(".tabs button");
    tabs.forEach(tab => {
        tab.addEventListener("click", function () {
            document.querySelector(".tabs .active").classList.remove("active");
            this.classList.add("active");
        });
    });
});
