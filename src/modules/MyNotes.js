import axios from 'axios';

class MyNotes {
  constructor() {
    this.deleteBtn = document.querySelector(".delete-note");
    this.editBtn = document.querySelector(".edit-note");
    this.updateBtn = document.querySelector(".update-note");
    this.submitBtn = document.querySelector(".submit-note"); // Correct class selector for submit button
    this.isEditing = false; 

    this.events();
  }

  events() {
    this.deleteBtn.addEventListener("click", this.deleteNote.bind(this));
    this.editBtn.addEventListener("click", this.toggleEditMode.bind(this));
    this.updateBtn.addEventListener("click", this.updateNote.bind(this));
    this.submitBtn.addEventListener('click', this.submitNote.bind(this));
  }

  toggleEditMode(e) {
    const thisNote = e.target.closest("li");
    if (!thisNote) return;

    const noteTitleField = thisNote.querySelector(".note-title-field");
    const noteBodyField = thisNote.querySelector(".note-body-field");
    const updateBtn = thisNote.querySelector('.update-note');
    const editBtn = thisNote.querySelector('.edit-note');
    
    if (noteTitleField && noteBodyField && updateBtn && editBtn) {
      this.isEditing ? this.makeNoteReadOnly(noteTitleField, noteBodyField, updateBtn, editBtn) :
                       this.makeNoteEditable(noteTitleField, noteBodyField, updateBtn, editBtn);
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
      const response = await axios.delete(`${universityData.root_url}/wp-json/wp/v2/note/${noteId}`, {
        headers: { 'X-WP-Nonce': universityData.nonce }
      });
  
      if (response.status === 200) thisNote.remove();
    } catch (error) {
      console.error('Error deleting the note:', error);
    }
  }

  async updateNote(e) {
    const thisNote = e.target.closest("li");
    if (!thisNote) return;

    const noteId = thisNote.dataset.id;
    const noteTitleField = thisNote.querySelector(".note-title-field");
    const noteBodyField = thisNote.querySelector(".note-body-field");

    try {
      const response = await axios.post(`${universityData.root_url}/wp-json/wp/v2/note/${noteId}`, {
        title: noteTitleField.value,
        content: noteBodyField.value
      }, {
        headers: { 'X-WP-Nonce': universityData.nonce }
      });

      if (response.status === 200) {
        this.makeNoteReadOnly(noteTitleField, noteBodyField, thisNote.querySelector('.update-note'), thisNote.querySelector('.edit-note'));
      }
    } catch (error) {
      console.error('Error updating the note:', error);
    }
  }

  async submitNote() {
    const noteTitleField = document.querySelector(".new-note-title");
    const noteBodyField = document.querySelector(".new-note-body");

    if (!noteTitleField || !noteBodyField) return;

    try {
      const response = await axios.post(`${universityData.root_url}/wp-json/wp/v2/note`, {
        title: noteTitleField.value,
        content: noteBodyField.value,
        status:'private'
      }, {
        headers: { 'X-WP-Nonce': universityData.nonce }
      });

      if (response.status === 201) {
        // Optionally, you can refresh the page or add the new note to the DOM
        alert('Note created successfully!');
        noteTitleField.value = '';
        noteBodyField.value = '';
      }
    } catch (error) {
      console.error('Error creating the note:', error);
    }
  }
}

export default MyNotes;
