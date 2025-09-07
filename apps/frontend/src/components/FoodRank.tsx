import React, { useState, useEffect, useCallback } from 'react';
import { foodRankAPI, FoodRank, UpdateFoodRankDto, CreateFoodRankDto } from '../services/api';

const FoodRankComponent: React.FC = () => {
  const [foodRanks, setFoodRanks] = useState<FoodRank[]>([]);
  const [editingRank, setEditingRank] = useState<FoodRank | null>(null);
  const [editForm, setEditForm] = useState<UpdateFoodRankDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'restaurant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateFoodRankDto>({
    foodType: '',
    restaurantName: '',
    foodImage: '',
    rating: 5,
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  const fetchFoodRanks = useCallback(async () => {
    try {
      setLoading(true);
      const foodRanks = await foodRankAPI.getAll();
      setFoodRanks(foodRanks);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch food ranks');
      console.error('Error fetching food ranks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setCreateForm({ ...createForm, foodImage: result });
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      foodType: '',
      restaurantName: '',
      foodImage: '',
      rating: 5,
      date: new Date().toISOString().split('T')[0],
      comment: ''
    });
    setPreviewImage('');
  };

  useEffect(() => {
    fetchFoodRanks();
  }, [fetchFoodRanks]);

  const handleCreateRank = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!createForm.foodImage) {
      setError('Please select an image file');
      return;
    }
    
    try {
      setLoading(true);
      await foodRankAPI.create(createForm);
      setShowCreateModal(false);
      resetCreateForm();
      await fetchFoodRanks();
      setError(null);
    } catch (err: any) {
      setError('Failed to create food rank: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRank) return;

    try {
      setLoading(true);
      await foodRankAPI.update(editingRank.id, editForm);
      setEditingRank(null);
      setEditForm({});
      await fetchFoodRanks();
      setError(null);
    } catch (err: any) {
      setError('Failed to update food rank: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRank = async (id: number, foodType: string, restaurantName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${foodType}" from "${restaurantName}"? This action cannot be undone.`)) return;

    try {
      setLoading(true);
      await foodRankAPI.delete(id);
      await fetchFoodRanks();
      setError(null);
    } catch (err: any) {
      setError('Failed to delete food rank: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return '#28a745';
    if (rating >= 6) return '#ffc107';
    if (rating >= 4) return '#fd7e14';
    return '#dc3545';
  };

  const getRatingEmoji = (rating: number) => {
    if (rating >= 9) return '🤤';
    if (rating >= 7) return '😋';
    if (rating >= 5) return '😊';
    if (rating >= 3) return '😐';
    return '😝';
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

  const sortedFoodRanks = [...foodRanks].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'rating':
        comparison = a.rating - b.rating;
        break;
      case 'restaurant':
        comparison = a.restaurantName.localeCompare(b.restaurantName);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2>⭐ Food Rankings</h2>
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
            ➕ Add New Rank
          </button>
        </div>
        
        {/* Sort Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'restaurant')}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="date">Date</option>
            <option value="rating">Rating</option>
            <option value="restaurant">Restaurant</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            style={{
              padding: '4px 8px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
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

      {sortedFoodRanks.length === 0 && !loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🍽️</div>
          <p>No food rankings yet. Complete some food orders to start ranking!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {sortedFoodRanks.map((rank) => (
            <div key={rank.id} style={{ 
              border: '1px solid #dee2e6', 
              borderRadius: '12px', 
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Food Image */}
                <div style={{ flexShrink: 0 }}>
                  <img 
                    src={rank.foodImage} 
                    alt={rank.foodType}
                    onClick={() => handleImageClick(rank.foodImage, `${rank.foodType} - ${rank.restaurantName}`)}
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
                
                {/* Food Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 5px 0', 
                        color: '#333',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {rank.foodType}
                      </h3>
                      <p style={{ 
                        margin: '0 0 5px 0', 
                        color: '#007bff',
                        fontSize: '16px',
                        fontWeight: '500'
                      }}>
                        📍 {rank.restaurantName}
                      </p>
                      <p style={{ margin: '0', color: '#888', fontSize: '14px' }}>
                        📅 {formatDate(rank.date)}
                      </p>
                    </div>
                    
                    {/* Rating */}
                    <div style={{ textAlign: 'center', marginLeft: '15px' }}>
                      <div style={{ 
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: getRatingColor(rank.rating),
                        marginBottom: '5px'
                      }}>
                        {rank.rating}/10
                      </div>
                      <div style={{ fontSize: '20px' }}>
                        {getRatingEmoji(rank.rating)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment */}
                  {rank.comment && (
                    <div style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '12px', 
                      borderRadius: '6px', 
                      margin: '10px 0',
                      fontSize: '14px',
                      color: '#555',
                      fontStyle: 'italic'
                    }}>
                      💬 "{rank.comment}"
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                    <button
                      onClick={() => {
                        setEditingRank(rank);
                        setEditForm({
                          foodType: rank.foodType,
                          restaurantName: rank.restaurantName,
                          foodImage: rank.foodImage,
                          rating: rank.rating,
                          date: rank.date,
                          comment: rank.comment || ''
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
                      onClick={() => handleDeleteRank(rank.id, rank.foodType, rank.restaurantName)}
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

      {/* Edit Modal */}
      {editingRank && (
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
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>✏️ Edit Food Rank</h3>
            <form onSubmit={handleUpdateRank} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Food Type:</label>
                  <input
                    type="text"
                    value={editForm.foodType || ''}
                    onChange={(e) => setEditForm({ ...editForm, foodType: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd' 
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Restaurant:</label>
                  <input
                    type="text"
                    value={editForm.restaurantName || ''}
                    onChange={(e) => setEditForm({ ...editForm, restaurantName: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd' 
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Food Image URL:</label>
                <input
                  type="url"
                  value={editForm.foodImage || ''}
                  onChange={(e) => setEditForm({ ...editForm, foodImage: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd' 
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating (1-10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editForm.rating || 5}
                    onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd' 
                    }}
                  />
                </div>
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
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment:</label>
                <textarea
                  value={editForm.comment || ''}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  placeholder="How was the food? Any notes..."
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    resize: 'vertical'
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
                  {loading ? 'Updating...' : 'Update Rank'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEditingRank(null);
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
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>➕ Add New Food Rank</h3>
            <form onSubmit={handleCreateRank} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Food Type:</label>
                  <input
                    type="text"
                    value={createForm.foodType}
                    onChange={(e) => setCreateForm({ ...createForm, foodType: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Restaurant:</label>
                  <input
                    type="text"
                    value={createForm.restaurantName}
                    onChange={(e) => setCreateForm({ ...createForm, restaurantName: e.target.value })}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd' 
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Food Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Rating (1-10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={createForm.rating}
                    onChange={(e) => setCreateForm({ ...createForm, rating: parseInt(e.target.value) })}
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
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Comment:</label>
                <textarea
                  value={createForm.comment}
                  onChange={(e) => setCreateForm({ ...createForm, comment: e.target.value })}
                  placeholder="How was the food? Any notes..."
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    border: '1px solid #ddd',
                    resize: 'vertical'
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
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Creating...' : 'Create Rank'}
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

export default FoodRankComponent;