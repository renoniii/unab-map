const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
        optionMenu.classList.remove("active");
        optionMenu2.classList.remove("active");
    });

    modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light Mode"
            map.setConfigProperty('basemap', 'lightPreset', 'dusk'); 
        }else{
            modeText.innerText = "Dark Mode"
            map.setConfigProperty('basemap', 'lightPreset', 'day'); 
        }
    });

const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    sBtn_text = optionMenu.querySelector(".sBtn-text"),
    optionSearch = optionMenu.querySelector(".optionSearch");

optionSearch.addEventListener("keyup", function () {
  const filter = optionSearch.value.toUpperCase();
  for (let i = 0; i < options.length; i++) {
    const li = options[i];
    const textValue = li.textContent || li.innerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  }
});
  
const optionMenu2 = document.querySelector(".select-menu2"),
    selectBtn2 = optionMenu2.querySelector(".select-btn2"),
    options2 = optionMenu2.querySelectorAll(".option2"),
    sBtn_text2 = optionMenu2.querySelector(".sBtn-text2"),
    optionSearch2 = optionMenu2.querySelector(".optionSearch2");

optionSearch2.addEventListener("keyup", function () {
  const filter = optionSearch2.value.toUpperCase();
  for (let i = 0; i < options2.length; i++) {
    const li = options2[i];
    const textValue = li.textContent || li.innerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      li.style.display = "";
    } else {
      li.style.display = "none";
    }
  }
});

let isMenu1Open = false;
let isMenu2Open = false;

selectBtn.addEventListener("click", () => {
    if (isMenu2Open) {
      optionMenu2.classList.remove("active");
      isMenu2Open = false;
    }
    optionMenu.classList.toggle("active");
    isMenu1Open = !isMenu1Open;
    sidebar.classList.remove("close");
  });
  
  selectBtn2.addEventListener("click", () => {
    if (isMenu1Open) {
      optionMenu.classList.remove("active");
      isMenu1Open = false;
    }
    optionMenu2.classList.toggle("active");
    isMenu2Open = !isMenu2Open;
    sidebar.classList.remove("close");
  });
  
  options.forEach((option) => {
    option.addEventListener("click", () => {
      let selectedOption = option.querySelector(".option-text").innerText;
      sBtn_text.innerText = selectedOption;
      optionMenu.classList.remove("active");
      isMenu1Open = false;
    });
  });
  
  options2.forEach((option) => {
    option.addEventListener("click", () => {
      let selectedOption = option.querySelector(".option-text2").innerText;
      sBtn_text2.innerText = selectedOption;
      optionMenu2.classList.remove("active");
      isMenu2Open = false;
    });
  });