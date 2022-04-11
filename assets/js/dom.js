document.addEventListener("DOMContentLoaded", function () {
 const submitBook = document.getElementById("inputBook");

 submitBook.addEventListener("submit", function (event) {
  addBook();
 });

 const buttonChecked = document.getElementById("inputBookIsComplete");
 const buttonSubmit = document.querySelector("#bookSubmit > span");

 buttonChecked.addEventListener("change", function () {
  if (buttonChecked.checked) {
   buttonSubmit.innerText = "Selesai Dibaca";
  } else {
   buttonSubmit.innerText = "Belum selesai dibaca";
  }
 });

 const buttonSearch = document.getElementById("searchSubmit");

 buttonSearch.addEventListener("click", function (event) {
  const keywordValue = document.getElementById("searchBookTitle").value;
  findBookByTitle(keywordValue.toLowerCase());
  event.preventDefault();
 });

 if (isStorageExist()) {
  loadDataFromStorage();
 }

});

document.addEventListener("ondatasaved", () => {
 console.log("Data berhasil disimpan");
});

document.addEventListener("ondataloaded", () => {
 refreshDataFromBooks();
});