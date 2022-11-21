const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async(req,res)=>{
    // Get all notes from mongo
    const notes = await Note.find().select().lean()

    //If not notes
    if (!notes?.length){
        return res.status(400).json({ message: 'No notes found' })
    }

    res.json(notes)
})


// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async(req,res)=>{
    
    const {user, title, text} = req.body

    if (!user || !title || !text){
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store new note
    const notesObject = {"user": user, title, text }

    const note = await Note.create(notesObject)

    if (note) { //created 
         res.status(201).json({ message: `New note created for ${user} ` })
    } else {
         res.status(400).json({ message: 'Invalid user data received' })
    }
  
})

// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {

    const {id,user,title,text} = req.body

    if (!id || !user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm note exists to update
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    note.user = user
    note.title = title
    note.text = text

    const updatedNote = await note.save()

    res.json({ message: `${updatedNote.user} s not just updated` })
})

// @desc Delete a notes
// @route DELETE /notes
// @access Private
const deleteNotes = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID Required' })
    }

    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Not for user ${result.user} deleted`
    
    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNotes
}
