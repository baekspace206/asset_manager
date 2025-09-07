import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FoodRank {
  id: number;
  orderId: number;
  foodType: string;
  restaurantName: string;
  foodImage: string;
  rating: number;
  date: string;
  comment?: string;
  createdAt: string;
}

interface UpdateFoodRankDto {
  foodType?: string;
  restaurantName?: string;
  foodImage?: string;
  rating?: number;
  date?: string;
  comment?: string;
}

const FoodRankComponent: React.FC = () => {
  const [foodRanks, setFoodRanks] = useState<FoodRank[]>([]);
  const [editingRank, setEditingRank] = useState<FoodRank | null>(null);
  const [editForm, setEditForm] = useState<UpdateFoodRankDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'restaurant'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const API_BASE_URL = '/api';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchFoodRanks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/food-ranks`, { headers: getAuthHeaders() });
      setFoodRanks(response.data);
    } catch (err) {
      setError('Failed to fetch food ranks');
      console.error('Error fetching food ranks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoodRanks();
  }, [fetchFoodRanks]);


  const handleUpdateRank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRank) return;

    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/food-ranks/${editingRank.id}`, editForm, { headers: getAuthHeaders() });
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

  const handleDeleteRank = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this food rank?')) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/food-ranks/${id}`, { headers: getAuthHeaders() });
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
        <h2>⭐ Food Rankings</h2>
        
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
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
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
                      onClick={() => handleDeleteRank(rank.id)}
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
    </div>
  );
};

export default FoodRankComponent;