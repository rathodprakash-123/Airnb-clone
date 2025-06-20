let taxSwitch = document.getElementById("flexSwitchCheckDefault");
    taxSwitch.addEventListener("click", () => {
      let taxInfo = document.getElementsByClassName("tax-info");
      for (info of taxInfo) {
        if (info.style.display != "inline") {
          info.style.display = "inline";
        } else {
          info.style.display = "none";
        }
      }
    });
    
  const toggleButton = document.getElementById("toggleButton");
  const extraFilters = document.querySelectorAll(".filter.extra");
  const allFilters = document.querySelectorAll(".filter");
  let isExpanded = false;

  function toggleFilters() {
    isExpanded = !isExpanded;

    if (window.innerWidth <= 768) {
      // Small screen: toggle all
      allFilters.forEach(filter => {
        if (!filter.classList.contains('tax-toggle')) {
          filter.classList.toggle("hidden");
        }
      });
    } else {
      // Large screen: toggle extra only
      extraFilters.forEach(filter => {
        filter.classList.toggle("hidden");
      });
    }

    // Optional: Rotate the chevron icon
    toggleButton.classList.toggle("rotated");
  }

  toggleButton.addEventListener("click", toggleFilters);

  // Ensure filters reset on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && isExpanded) {
      // Make sure base filters are shown and only extras toggle
      allFilters.forEach(filter => filter.classList.remove("hidden"));
    } else if (window.innerWidth <= 768 && !isExpanded) {
      // Hide all filters again if resized back to small
      allFilters.forEach(filter => filter.classList.add("hidden"));
    }
  });

