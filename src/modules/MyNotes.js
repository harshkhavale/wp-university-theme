import axios from 'axios';

class MyNotes {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.deleteBtns = document.querySelectorAll(".delete-note");
      this.editBtns = document.querySelectorAll(".edit-note");
      this.updateBtns = document.querySelectorAll(".update-note");
      this.submitBtn = document.querySelector(".submit-note");

      // Log elements to check if they are found
      console.log("Delete Buttons:", this.deleteBtns);
      console.log("Edit Buttons:", this.editBtns);
      console.log("Update Buttons:", this.updateBtns);
      console.log("Submit Button:", this.submitBtn);

      this.isEditing = false;

      this.events();
    });
  }

  events() {
    this.deleteBtns.forEach(btn => btn.addEventListener("click", this.deleteNote.bind(this)));
    this.editBtns.forEach(btn => btn.addEventListener("click", this.toggleEditMode.bind(this)));
    this.updateBtns.forEach(btn => btn.addEventListener("click", this.updateNote.bind(this)));
    if (this.submitBtn) this.submitBtn.addEventListener("click", this.submitNote.bind(this));
  }

  toggleEditMode(e) {
    const thisNote = e.target.closest("li");
    if (!thisNote) return;

    const noteTitleField = thisNote.querySelector(".note-title-field");
    const noteBodyField = thisNote.querySelector(".note-body-field");
    const updateBtn = thisNote.querySelector(".update-note");
    const editBtn = thisNote.querySelector(".edit-note");

    if (noteTitleField && noteBodyField && updateBtn && editBtn) {
      this.isEditing
        ? this.makeNoteReadOnly(
            noteTitleField,
            noteBodyField,
            updateBtn,
            editBtn
          )
        : this.makeNoteEditable(
            noteTitleField,
            noteBodyField,
            updateBtn,
            editBtn
          );
      this.isEditing = !this.isEditing;
    }
  }

  makeNoteEditable(noteTitleField, noteBodyField, updateBtn, editBtn) {
    noteTitleField.removeAttribute("readonly");
    noteTitleField.classList.add("note-active-field");
    noteBodyField.removeAttribute("readonly");
    noteBodyField.classList.add("note-active-field");
    updateBtn.classList.add("update-note--visible");
    editBtn.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Cancel`;
  }

  makeNoteReadOnly(noteTitleField, noteBodyField, updateBtn, editBtn) {
    noteTitleField.setAttribute("readonly", true);
    noteTitleField.classList.remove("note-active-field");
    noteBodyField.setAttribute("readonly", true);
    noteBodyField.classList.remove("note-active-field");
    updateBtn.classList.remove("update-note--visible");
    editBtn.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i> Edit`;
  }

  async deleteNote(e) {
    const thisNote = e.target.closest("li");
    if (!thisNote) return;

    const noteId = thisNote.dataset.id;
    try {
      const response = await axios.delete(
        `${universityData.root_url}/wp-json/wp/v2/note/${noteId}`,
        {
          headers: { "X-WP-Nonce": universityData.nonce },
        }
      );

      if (response.status === 200) thisNote.remove();
      if (response.userNoteCount < 5) {
        const lmtTEXT = document.querySelector(".note-limit-message");
        lmtTEXT.classList.remove("active");
      }
    } catch (error) {
      console.error("Error deleting the note:", error);
    }
  }

  async updateNote(e) {
    const thisNote = e.target.closest("li");
    if (!thisNote) return;

    const noteId = thisNote.dataset.id;
    const noteTitleField = thisNote.querySelector(".note-title-field");
    const noteBodyField = thisNote.querySelector(".note-body-field");

    try {
      const response = await axios.post(
        `${universityData.root_url}/wp-json/wp/v2/note/${noteId}`,
        {
          title: noteTitleField.value,
          content: noteBodyField.value,
        },
        {
          headers: { "X-WP-Nonce": universityData.nonce },
        }
      );

      if (response.status === 200) {
        this.makeNoteReadOnly(
          noteTitleField,
          noteBodyField,
          thisNote.querySelector(".update-note"),
          thisNote.querySelector(".edit-note")
        );
      }
    } catch (error) {
      console.error("Error updating the note:", error);
    }
  }

  async submitNote() {
    const noteTitleField = document.querySelector(".new-note-title");
    const noteBodyField = document.querySelector(".new-note-body");
    const lmtTEXT = document.querySelector(".note-limit-message");

    if (!noteTitleField || !noteBodyField) return;

    try {
      const response = await axios.post(
        `${universityData.root_url}/wp-json/wp/v2/note`,
        {
          title: noteTitleField.value,
          content: noteBodyField.value,
          status: "private",
        },
        {
          headers: { "X-WP-Nonce": universityData.nonce },
        }
      );

      console.log("Response:", response);

      if (response.status === 201) {
        alert("Note created successfully!");
        noteTitleField.value = "";
        noteBodyField.value = "";
        if (lmtTEXT) lmtTEXT.classList.remove("active");
        this.addNoteToDOM(response.data); // Add the new note to the DOM
      } else if (response.data === "You have reached the limit") {
        if (lmtTEXT) lmtTEXT.classList.add("active");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error creating the note:", error);
    }
  }

  addNoteToDOM(note) {
    const notesList = document.querySelector(".notes-list");
    if (!notesList) return;

    const newNote = document.createElement("li");
    newNote.dataset.id = note.id;
    newNote.innerHTML = `
      <input readonly class="note-title-field" value="${note.title.rendered}" />
      <textarea readonly class="note-body-field">${note.content.rendered}</textarea>
      <button class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</button>
      <button class="update-note">Save</button>
      <button class="delete-note">Delete</button>
    `;

    // Attach event listeners to the new note
    newNote.querySelector(".edit-note").addEventListener("click", this.toggleEditMode.bind(this));
    newNote.querySelector(".update-note").addEventListener("click", this.updateNote.bind(this));
    newNote.querySelector(".delete-note").addEventListener("click", this.deleteNote.bind(this));

    notesList.appendChild(newNote);
  }
}

export default MyNotes;
