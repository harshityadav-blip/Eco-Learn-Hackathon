document.addEventListener("DOMContentLoaded", () => {

  // ======================
  // ✅ 1. THEME TOGGLE FUNCTIONALITY
  // ======================
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIconDark = document.getElementById("theme-icon-dark");
  const themeIconLight = document.getElementById("theme-icon-light");
  const htmlElement = document.documentElement; // <html> ট্যাগ

  // থিম সেট করার ফাংশন
  function setTheme(theme) {
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      if (themeIconDark) themeIconDark.classList.add('hidden');
      if (themeIconLight) themeIconLight.classList.remove('hidden');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      if (themeIconDark) themeIconDark.classList.remove('hidden');
      if (themeIconLight) themeIconLight.classList.add('hidden');
      localStorage.setItem('theme', 'light');
    }
  }

  // পেজ লোড হওয়ার সময় সেভ করা থিম চেক করুন
  const savedTheme = localStorage.getItem('theme') || 'light'; // ডিফল্ট লাইট
  setTheme(savedTheme);

  // বাটনে ক্লিক করলে থিম পরিবর্তন
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
      if (currentTheme === 'dark') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    });
  }

  // ======================
  // ✅ 2. WIKIPEDIA SEARCH FUNCTIONALITY
  // ======================
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      // ফর্ম সাবমিট হলে পেজ রিলোড হওয়া আটকায়
      event.preventDefault(); 
      
      // ইনপুট থেকে টেক্সট নেয়
      const query = searchInput.value.trim();
      
      // যদি ইনপুট খালি না হয়
      if (query) {
        // Wikipedia সার্চ URL তৈরি করে
        const wikipediaURL = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
        
        // নতুন ট্যাবে URL ওপেন করে
        window.open(wikipediaURL, "_blank");
      }
    });
  }

  // ======================
  // ✅ 3. SLIDER FUNCTIONALITY (FIXED)
  // ======================
  const sliders = document.querySelectorAll(".slider-container");

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector(".prevBtn");
    const nextBtn = slider.querySelector(".nextBtn");

    let currentIndex = 0;

    // ✅ ঠিক করা showSlide ফাংশন
    function showSlide(index) {
      // সব স্লাইড থেকে 'active' ক্লাস সরিয়ে দেয়
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });
      // শুধুমাত্র বর্তমান স্লাইডে 'active' ক্লাস যোগ করে
      if (slides[index]) {
        slides[index].classList.add("active");
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
      });
    }

    // প্রথম স্লাইডটি দেখায় (CSS-এ .active ক্লাসটি ব্যবহার করে)
    // showSlide(currentIndex); <-- এই লাইনের আর প্রয়োজন নেই কারণ HTML-এই active ক্লাস দেওয়া আছে
  });


  // ======================
  // "SEE MORE" FUNCTIONALITY (আপনার আগের কোড)
  // ======================
  
  // ✅ এই কোডটি আপনার "Quality Education (SDG 4)" সেকশনের জন্য
  const expandableText = document.getElementById("expandable-text");
  const seeMoreBtn = document.getElementById("see-more-btn");
  const fadeOverlay = document.getElementById("fade-overlay");

  if (seeMoreBtn && expandableText && fadeOverlay) {
      seeMoreBtn.addEventListener("click", () => {
          if (expandableText.classList.contains("max-h-32")) {
              // Expand
              expandableText.classList.remove("max-h-32");
              expandableText.style.maxHeight = expandableText.scrollHeight + "px";
              seeMoreBtn.textContent = "আরও কম দেখুন";
              fadeOverlay.classList.add("hidden");
          } else {
              // Collapse
              expandableText.classList.add("max-h-32");
              expandableText.style.maxHeight = null; // Tailwind ক্লাসে ফিরে যায়
              seeMoreBtn.textContent = "আরও দেখুন";
              fadeOverlay.classList.remove("hidden");
          }
      });
  }
  
  // ✅ এই কোডটি আপনার স্লাইডারের নিচের লেখার জন্য (যেমন "প্রথম স্লাইডার সম্পর্কে")
  const articles = document.querySelectorAll(".mt-4.p-4");

  articles.forEach((article, index) => {
    // "Quality Education" সেকশনটি বাদ দিন, কারণ এটির আলাদা বাটন আছে
    if (article.querySelector("#expandable-text")) return; 
    
    // "পরিবেশ বিষয়ক স্লাইডার" সেকশনটি বাদ দিন (যদি না চান)
    // if (index === 1) return; 

    const textBox = article.querySelector(".text-gray-700, .dark\\:text-gray-300");
    if (!textBox) return;

    const oldBtn = article.querySelector(".see-more-btn");
    if (oldBtn) oldBtn.remove();

    const initialHeight = 100; // প্রাথমিক উচ্চতা কম করে দিলাম
    textBox.style.maxHeight = initialHeight + "px";
    textBox.style.overflow = "hidden";
    textBox.style.transition = "max-height 0.5s ease";
    textBox.style.position = "relative"; // fade effect-এর জন্য

    // Fade overlay যোগ করুন
    const fadeDiv = document.createElement("div");
    fadeDiv.className = "absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent";
    
    // বাটন যোগ করুন
    const btn = document.createElement("button");
    btn.textContent = "See More";
    btn.className =
      "see-more-btn mt-3 text-blue-600 dark:text-blue-400 hover:underline font-medium";

    let isExpanded = false;

    btn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      if (isExpanded) {
        textBox.style.maxHeight = textBox.scrollHeight + "px";
        btn.textContent = "See Less";
        fadeDiv.style.opacity = "0";
      } else {
        textBox.style.maxHeight = initialHeight + "px";
        btn.textContent = "See More";
        fadeDiv.style.opacity = "1";
      }
    });

    // লেখা যদি ছোট হয়, তাহলে বাটন বা fade দেখানোর দরকার নেই
    if (textBox.scrollHeight > initialHeight) {
        textBox.appendChild(fadeDiv);
        article.appendChild(btn);
    }
  });

});