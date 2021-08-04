document.getElementById("searchButton").addEventListener("click", (e) => {
  e.preventDefault();
  let query = document.getElementById("searchInput").value;
  window.location.replace(`http://localhost:8000/search?s=${query}`);
});
