import React, { useState, useEffect, useCallback } from 'react';
import { diaryAPI, Diary, CreateDiaryDto, UpdateDiaryDto } from '../services/api';

const DiaryComponent: React.FC = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [editingDiary, setEditingDiary] = useState<Diary | null>(null);
  const [editForm, setEditForm] = useState<UpdateDiaryDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateDiaryDto>({
    date: new Date().toISOString().split('T')[0],
    content: '',
    image: ''
  });
  const [previewImage, setPreviewImage] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const fetchDiaries = useCallback(async () => {
    try {
      setLoading(true);
      const diaries = await diaryAPI.getAll();
      setDiaries(diaries);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch diary entries');
      console.error('Error fetching diaries:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setCreateForm({ ...createForm, image: result });
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      date: new Date().toISOString().split('T')[0],
      content: '',
      image: ''
    });
    setPreviewImage('');
  };

  const handleCreateDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.content.trim()) {
      setError('Please enter diary content');
      return;
    }
    
    try {
      setLoading(true);
      await diaryAPI.create(createForm);
      setShowCreateModal(false);
      resetCreateForm();
      await fetchDiaries();
      setError(null);
    } catch (err: any) {
      setError('Failed to create diary entry: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiary) return;

    try {
      setLoading(true);
      await diaryAPI.update(editingDiary.id, editForm);
      setEditingDiary(null);
      setEditForm({});
      await fetchDiaries();
      setError(null);
    } catch (err: any) {
      setError('Failed to update diary entry: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiary = async (id: number, date: string) => {
    if (!window.confirm(`Are you sure you want to delete diary entry from "${new Date(date).toLocaleDateString()}"? This action cannot be undone.`)) return;

    try {
      setLoading(true);
      await diaryAPI.delete(id);
      await fetchDiaries();
      setError(null);
    } catch (err: any) {
      setError('Failed to delete diary entry: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleImageClick = (src: string, alt: string) => {
    setSelectedImage({ src, alt });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showImageModal) {
        closeImageModal();
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showImageModal]);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2>📔 My Diary</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ➕ Write New Entry
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          color: '#c00', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '20px' 
        }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
        </div>
      )}

      {diaries.length === 0 && !loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
          <p>No diary entries yet. Start writing your first entry!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {diaries.map((diary) => (
            <div key={diary.id} style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '12px', 
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Image */}
                {diary.image && (
                  <div style={{ flexShrink: 0 }}>
                    <img 
                      src={diary.image} 
                      alt={`Diary entry from ${formatDate(diary.date)}`}
                      onClick={() => handleImageClick(diary.image!, `Diary entry from ${formatDate(diary.date)}`)}
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }} 
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 5px 0', 
                        color: '#333',
                        fontSize: '18px',
                        fontWeight: 'bold'
                      }}>
                        📅 {formatDate(diary.date)}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Diary Content */}
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '15px', 
                    borderRadius: '8px', 
                    margin: '10px 0',
                    fontSize: '14px',
                    color: '#555',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {diary.content}
                  </div>
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                    <button
                      onClick={() => {
                        setEditingDiary(diary);
                        setEditForm({
                          date: diary.date,
                          content: diary.content,
                          image: diary.image || ''
                        });
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDiary(diary.id, diary.date)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>📝 Write New Diary Entry</h3>
            <form onSubmit={handleCreateDiary} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
                <input
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd' 
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content:</label>
                <textarea
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  placeholder="Write your diary entry..."
                  required
                  rows={6}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image (Optional):</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    cursor: 'pointer'
                  }}
                />
                {previewImage && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating...' : 'Create Entry'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDiary && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '8px', 
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>✏️ Edit Diary Entry</h3>
            <form onSubmit={handleUpdateDiary} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
                <input
                  type="date"
                  value={editForm.date || ''}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd' 
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Content:</label>
                <textarea
                  value={editForm.content || ''}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Write your diary entry..."
                  rows={6}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Image:</label>
                {editingDiary.image && (
                  <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                    <img 
                      src={editingDiary.image} 
                      alt="Current" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '150px', 
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </div>
                )}
                <input
                  type="url"
                  value={editForm.image || ''}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="Image URL (optional)"
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd' 
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Updating...' : 'Update Entry'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEditingDiary(null);
                    setEditForm({});
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            zIndex: 2000,
            cursor: 'pointer'
          }}
          onClick={closeImageModal}
        >
          <div 
            style={{ 
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              style={{ 
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }} 
            />
            <div style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '20px',
              color: '#333',
              fontSize: '16px',
              fontWeight: '500',
              textAlign: 'center',
              maxWidth: '80vw'
            }}>
              {selectedImage.alt}
            </div>
            <button
              onClick={closeImageModal}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                color: '#333',
                border: 'none',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryComponent;