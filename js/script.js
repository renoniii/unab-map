const body = document.querySelector("body"),
    sidebar = body.querySelector(".sidebar"),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");

    toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
        optionMenu.classList.remove("active")
        optionMenu2.classList.remove("active")
    });

    modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light Mode"
            map.setStyle(`mapbox://styles/mapbox/dark-v11`); 
        }else{
            modeText.innerText = "Dark Mode"
            map.setStyle(`mapbox://styles/mapbox/streets-v12`); 
        }
    });

const optionMenu = document.querySelector(".select-menu"),
        selectBtn = optionMenu.querySelector(".select-btn"),
        options = optionMenu.querySelectorAll(".option"),
        sBtn_text = optionMenu.querySelector(".sBtn-text");

selectBtn.addEventListener("click", ()=> optionMenu.classList.toggle("active"))

options.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text").innerText;
        sBtn_text.innerText = selectedOption;
       
        optionMenu.classList.remove("active")
    })
})

selectBtn.addEventListener("click", () =>{
    sidebar.classList.remove("close");
});

const optionMenu2 = document.querySelector(".select-menu2"),
        selectBtn2 = optionMenu2.querySelector(".select-btn2"),
        options2 = optionMenu2.querySelectorAll(".option2"),
        sBtn_text2 = optionMenu2.querySelector(".sBtn-text2");

selectBtn2.addEventListener("click", ()=> optionMenu2.classList.toggle("active"))

options2.forEach(option =>{
    option.addEventListener("click", ()=>{
        let selectedOption = option.querySelector(".option-text2").innerText;
        sBtn_text2.innerText = selectedOption;
       
        optionMenu2.classList.remove("active")
    })
})

selectBtn2.addEventListener("click", () =>{
    sidebar.classList.remove("close");
});
