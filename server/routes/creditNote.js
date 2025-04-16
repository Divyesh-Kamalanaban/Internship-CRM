// Update credit note
router.put('/:id', async (req, res) => {
  try {
    let creditNote = null;
    
    // Try to find by _id first (MongoDB ObjectId)
    try {
      creditNote = await CreditNote.findById(req.params.id);
    } catch (err) {
      // If findById fails (e.g., invalid ObjectId format), try to find by id field
      console.log('findById failed, trying findOne with id field');
    }
    
    // If not found by _id or findById failed, try to find by id field (numeric)
    if (!creditNote) {
      creditNote = await CreditNote.findOne({ id: parseInt(req.params.id) });
    }
    
    if (!creditNote) {
      return res.status(404).json({ message: 'Credit note not found' });
    }
    
    // Preserve the documentNumber and id fields
    const { documentNumber, id, ...updateData } = req.body;
    
    // Update the credit note with the new data
    Object.assign(creditNote, updateData);
    const updatedCreditNote = await creditNote.save();
    
    res.json(updatedCreditNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}); 