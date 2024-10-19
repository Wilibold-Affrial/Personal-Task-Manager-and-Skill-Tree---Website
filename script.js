// Book class
class Book {
    constructor(id, title, author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isAvailable = true;
    }
}

// BST Node class
class BSTNode {
    constructor(book) {
        this.book = book;
        this.left = null;
        this.right = null;
    }
}

// Queue Node class
class QNode {
    constructor(bookId, memberName) {
        this.bookId = bookId;
        this.memberName = memberName;
        this.next = null;
    }
}

// Library Management System
class LibraryManagementSystem {
    constructor() {
        this.root = null;
        this.reservations = { front: null, rear: null };
        this.bookId = 1;
    }

    addBook(title, author) {
        const book = new Book(this.bookId++, title, author);
        this.root = this._insertRec(this.root, book);
        this.updateBookList();
        return book;
    }

    _insertRec(node, book) {
        if (node === null) {
            return new BSTNode(book);
        }
        if (book.id < node.book.id) {
            node.left = this._insertRec(node.left, book);
        } else if (book.id > node.book.id) {
            node.right = this._insertRec(node.right, book);
        }
        return node;
    }

    searchBook(id) {
        return this._searchRec(this.root, id);
    }

    _searchRec(node, id) {
        if (node === null || node.book.id === id) {
            return node ? node.book : null;
        }
        if (id < node.book.id) {
            return this._searchRec(node.left, id);
        }
        return this._searchRec(node.right, id);
    }

    reserveBook(bookId, memberName) {
        const book = this.searchBook(bookId);
        if (book && !book.isAvailable) {
            this._enqueue(bookId, memberName);
            return `Book reserved for ${memberName}`;
        } else if (book && book.isAvailable) {
            return "Book is available, no need to reserve";
        } else {
            return "Book not found!";
        }
    }

    _enqueue(bookId, memberName) {
        const newNode = new QNode(bookId, memberName);
        if (this.reservations.rear === null) {
            this.reservations.front = this.reservations.rear = newNode;
        } else {
            this.reservations.rear.next = newNode;
            this.reservations.rear = newNode;
        }
    }

    processNextReservation() {
        if (this.reservations.front === null) {
            return "No reservations in queue";
        }
        const reservation = this.reservations.front;
        this.reservations.front = this.reservations.front.next;
        if (this.reservations.front === null) {
            this.reservations.rear = null;
        }
        const book = this.searchBook(reservation.bookId);
        if (book && !book.isAvailable) {
            book.isAvailable = true;
            this.updateBookList();
            return `Reservation processed for ${reservation.memberName} - Book: ${book.title}`;
        }
        return "Error processing reservation";
    }

    borrowBook(id) {
        const book = this.searchBook(id);
        if (book && book.isAvailable) {
            book.isAvailable = false;
            this.updateBookList();
            return `Book borrowed successfully: ${book.title}`;
        } else if (book) {
            return `Book is not available: ${book.title}`;
        } else {
            return "Book not found";
        }
    }

    returnBook(id) {
        const book = this.searchBook(id);
        if (book && !book.isAvailable) {
            book.isAvailable = true;
            this.updateBookList();
            return `Book returned successfully: ${book.title}`;
        } else if (book) {
            return `Book was already in library: ${book.title}`;
        } else {
            return "Book not found";
        }
    }

    displayAllBooks() {
        const books = [];
        this._inorderTraversal(this.root, books);
        return books;
    }

    _inorderTraversal(node, books) {
        if (node !== null) {
            this._inorderTraversal(node.left, books);
            books.push(node.book);
            this._inorderTraversal(node.right, books);
        }
    }

    isEmpty() {
        return this.root === null;
    }

    updateBookList() {
        const books = this.displayAllBooks();
        const bookListBody = document.getElementById('bookListBody');
        bookListBody.innerHTML = '';
        books.forEach(book => {
            const row = bookListBody.insertRow();
            row.insertCell(0).textContent = book.id;
            row.insertCell(1).textContent = book.title;
            row.insertCell(2).textContent = book.author;
            const statusCell = row.insertCell(3);
            updateStatusColor(statusCell, book.isAvailable ? 'Available' : 'Borrowed');
        });
    }
}

// Helper function to display output
function displayOutput(message) {
    const toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
}

// Function to show the selected form and hide others
function showForm(formId) {
    const forms = document.querySelectorAll('.form-group');
    forms.forEach(form => {
        form.style.display = 'none';
        form.style.opacity = '0';
    });
    const selectedForm = document.getElementById(formId + 'Form');
    selectedForm.style.display = 'block';
    setTimeout(() => {
        selectedForm.style.opacity = '1';
    }, 10);
}

// Function to add a book
function addBook() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    if (title && author) {
        const book = library.addBook(title, author);
        displayOutput(`Successfully added book '${book.title}' by ${book.author}`);
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
    } else {
        displayOutput("Invalid input. Book not added.");
    }
}

// Function to borrow a book
function borrowBook() {
    const id = parseInt(document.getElementById('borrowId').value);
    if (!isNaN(id)) {
        const result = library.borrowBook(id);
        displayOutput(result);
        document.getElementById('borrowId').value = '';
    } else {
        displayOutput("Invalid input. Please enter a valid book ID.");
    }
}

// Function to reserve a book
function reserveBook() {
    if (library.isEmpty()) {
        displayOutput("The library is empty. No books available for reservation.");
    } else {
        const id = parseInt(document.getElementById('reserveId').value);
        const name = document.getElementById('memberName').value;
        if (!isNaN(id) && name) {
            const result = library.reserveBook(id, name);
            displayOutput(result);
            document.getElementById('reserveId').value = '';
            document.getElementById('memberName').value = '';
        } else {
            displayOutput("Invalid input. Please enter a valid book ID and name.");
        }
    }
}

// Function to return a book
function returnBook() {
    if (library.isEmpty()) {
        displayOutput("The library is empty. No books available for return.");
    } else {
        const id = parseInt(document.getElementById('returnId').value);
        if (!isNaN(id)) {
            const result = library.returnBook(id);
            displayOutput(result);
        } else {
            displayOutput("Invalid input. Please enter a valid book ID.");
        }
    }
}

// Function to process reservation
function processReservation() {
    const result = library.processNextReservation();
    displayOutput(result);
}

// Function to update status cell color
function updateStatusColor(cell, status) {
    cell.textContent = status;
    cell.style.color = status === 'Available' ? '#27ae60' : '#c0392b';
    cell.style.fontWeight = 'bold';
}

// Initialize the library and update book list
const library = new LibraryManagementSystem();
library.updateBookList();