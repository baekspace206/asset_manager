import React, { useState, useEffect } from 'react';
import { LedgerEntry } from '../services/api';

interface LedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<LedgerEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  editingEntry?: LedgerEntry | null;
  categories: string[];
}

const LedgerModal: React.FC<LedgerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEntry,
  categories
}) => {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    note: ''
  });

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        date: editingEntry.date.split('T')[0], // Convert to YYYY-MM-DD format
        category: editingEntry.category,
        description: editingEntry.description,
        amount: editingEntry.amount.toString(),
        note: editingEntry.note || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        amount: '',
        note: ''
      });
    }
  }, [editingEntry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      note: formData.note || undefined
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0 }}>
          {editingEntry ? 'Edit Entry' : 'Add Entry'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Category *
            </label>
            <input
              list="categories"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              placeholder="Enter or select a category"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
            <datalist id="categories">
              {categories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter description"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Amount *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              step="0.01"
              placeholder="Enter amount"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Additional notes (optional)"
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {editingEntry ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LedgerModal;