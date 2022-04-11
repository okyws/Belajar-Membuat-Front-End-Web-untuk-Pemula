const INCOMPLETED_BOOK_LIST_ID = "incompleteBookList";
const COMPLETE_BOOK_LIST_ID = "completeBookList";
const BOOK_ITEMID = "bookId";

function makeBook(Title, Author, Year, isCompleted) {
 const textBookTitle = document.createElement("h3");
 textBookTitle.innerText = Title;

 const textBookAuthor = document.createElement("p");
 textBookAuthor.innerText = Author;

 const textBookYear = document.createElement("p");
 textBookYear.innerText = Year;

 const buttonContainer = document.createElement("div");
 buttonContainer.classList.add("action");
 buttonContainer.append(
  createGreenButton(isCompleted),
  createEditButton(),
  createTrashButton()
 );

 const article = document.createElement("article");
 article.classList.add("book_item");
 article.append(textBookTitle, textBookAuthor, textBookYear, buttonContainer);

 return article;
}

function createGreenButton(isCompleted) {
 return createButton('green', (isCompleted ? 'Belum Selesai' : 'Selesai'), function (event) {
  if (isCompleted) {
   moveBookToUndone(event.target.parentElement.parentElement);
  } else {
   moveBookToDone(event.target.parentElement.parentElement);
  }
 });
}

function createEditButton() {
 return createButton("orange", "Edit Buku", function (event) {
  editBook(event.target.parentElement.parentElement);
 });
}

function createTrashButton() {
 return createButton("red", "Hapus Buku", function (event) {
  removeBook(event.target.parentElement.parentElement);
 });
}

function createButton(buttonClassType, buttonText, eventListener) {
 const button = document.createElement("button");
 button.classList.add(buttonClassType);
 button.innerText = buttonText;
 button.addEventListener(
  "click", function (event) {
   eventListener(event);
  });
  
 return button;
}

function addBook() {
 const incompleteBOOKList = document.getElementById(INCOMPLETED_BOOK_LIST_ID);
 const completeBOOKList = document.getElementById(COMPLETE_BOOK_LIST_ID);
 const bookTitle = document.getElementById("inputBookTitle").value;
 const bookAuthor = document.getElementById("inputBookAuthor").value;
 const bookYear = document.getElementById("inputBookYear").value;
 const isCompleted = document.getElementById("inputBookIsComplete").checked;

 const book = makeBook(bookTitle, bookAuthor, bookYear, isCompleted);
 const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isCompleted)

 book[BOOK_ITEMID] = bookObject.id;
 books.push(bookObject);

 if (isCompleted) {
  completeBOOKList.append(book);
 } else {
  incompleteBOOKList.append(book);
 }

 updateDataToStorage();

}

function moveBookToDone(bookElement) {
 const book = findBook(bookElement[BOOK_ITEMID]);
 book.isCompleted = true;

 const newBook = makeBook(book.Title, book.Author, book.Year, isCompleted = true);
 newBook[BOOK_ITEMID] = book.id;

 const completeBOOKList = document.getElementById(COMPLETE_BOOK_LIST_ID);
 completeBOOKList.append(newBook);

 bookElement.remove();

 updateDataToStorage();
}

function moveBookToUndone(bookElement) {
 const book = findBook(bookElement[BOOK_ITEMID]);
 book.isCompleted = false;

 const newBook = makeBook(book.Title, book.Author, book.Year, book.isCompleted);
 newBook[BOOK_ITEMID] = book.id;

 const incompleteBOOKList = document.getElementById(INCOMPLETED_BOOK_LIST_ID);
 incompleteBOOKList.append(newBook);

 bookElement.remove();

 updateDataToStorage();
}


function removeBook(bookElement) {
 const deleteModal = document.getElementById("deleteModal");
 deleteModal.style.display = "block";

 const noDelete = document.querySelector(".noBtn");
 const yesBtn = document.querySelector(".yesBtn");

 yesBtn.addEventListener('click', function (event) {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  deleteModal.style.display = "none";

  updateDataToStorage();
 })

 noDelete.addEventListener('click', function (event) {
  deleteModal.style.display = "none";
 })

 window.onclick = function (event) {
  if (event.target == deleteModal) {
   deleteModal.style.display = "none";
  }
 }
}

function editBook(bookElement) {
 const editModal = document.getElementById("editModal");
 editModal.style.display = "block";

 const book = findBook(bookElement[BOOK_ITEMID]);

 const editBookId = document.getElementById("inputBookIdEdit");
 const editBookTitle = document.getElementById("inputBookTitleEdit");
 const editBookAuthor = document.getElementById("inputBookAuthorEdit");
 const editBookYear = document.getElementById("inputBookYearEdit");
 const editBookIsCompleted = document.getElementById("inputBookIsCompleteEdit");

 editBookId.value = book.id;
 editBookTitle.value = book.Title;
 editBookAuthor.value = book.Author;
 editBookYear.value = book.Year;
 editBookIsCompleted.checked = book.isCompleted;

 const saveEdit = document.querySelector(".submitEdit");

 saveEdit.addEventListener('click', function (event) {
  updateEditBook(editBookTitle.value, editBookAuthor.value, editBookYear.value, editBookIsCompleted.checked, book.id);
  editModal.style.display = "none";
 });

 const cancelEdit = document.querySelector(".cancelEdit");

 cancelEdit.addEventListener("click", function (event) {
  editModal.style.display = "none";
  event.preventDefault();
 })

 window.onclick = function (event) {
  if (event.target == editModal) {
   editModal.style.display = "none";
  }
 }
}

function updateEditBook(Title, Author, Year, isCompleted, Id) {
 const bookStorage = JSON.parse(localStorage[STORAGE_KEY]);
 const bookIndex = findBookIndex(Id);

 bookStorage[bookIndex] = {
  id: Id,
  Title: Title,
  Author: Author,
  Year: Year,
  isCompleted: isCompleted
 };

 const parsed = JSON.stringify(bookStorage);
 localStorage.setItem(STORAGE_KEY, parsed);

 location.reload(true);
}

function findBookByTitle(keywordValue) {
 const bookList = document.querySelectorAll(".book_item");

 for (let book of bookList) {
  const title = book.childNodes[0];
  if (!title.innerText.toLowerCase().includes(keywordValue)) {
   title.parentElement.style.display = 'none';
  } else {
   title.parentElement.style.display = '';
  }
 }
}