import React, { useState, useEffect, useCallback } from 'react';
import { foodItemAPI, FoodItemWithRatings, CreateFoodItemDto, CreateFoodRatingDto, UpdateFoodRatingDto } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type FilterType = 'all' | 'completed' | 'incomplete' | 'baek-rated' | 'jeong-rated';
type SortType = 'date' | 'rating-desc' | 'rating-asc';

const FoodItemRanking: React.FC = () => {
  const { user } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItemWithRatings[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Forms
  const [createForm, setCreateForm] = useState<CreateFoodItemDto>({
    foodType: '',
    restaurantName: '',
    foodImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==', // Default placeholder image
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  
  const [ratingForm, setRatingForm] = useState<CreateFoodRatingDto>({
    foodItemId: 0,
    rating: 5,
    comment: ''
  });
  
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItemWithRatings | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Image compression function
  const compressImage = (file: File, maxWidth = 800, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const fetchFoodItems = useCallback(async () => {
    try {
      setLoading(true);
      const filterParam = filter === 'all' ? undefined : filter;
      const sortParam = sort === 'date' ? undefined : sort;
      const items = await foodItemAPI.getAll(filterParam, sortParam);
      setFoodItems(items);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch food items');
      console.error('Error fetching food items:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      try {
        setLoading(true);
        // Compress the image
        const compressedImage = await compressImage(file, 800, 0.8);
        setCreateForm({ ...createForm, foodImage: compressedImage });
        setPreviewImage(compressedImage);
        setError(null);
      } catch (err) {
        setError('Failed to process image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await foodItemAPI.create(createForm);
      setShowCreateModal(false);
      setCreateForm({
        foodType: '',
        restaurantName: '',
        foodImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setPreviewImage('');
      await fetchFoodItems();
      setError(null);
    } catch (err: any) {
      setError('Failed to create food item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFoodItem = async (id: number, restaurantName: string) => {
    if (!window.confirm(`"${restaurantName}" 음식 항목을 정말 삭제하시겠습니까? 모든 평가도 함께 삭제됩니다.`)) {
      return;
    }

    try {
      setLoading(true);
      await foodItemAPI.delete(id);
      await fetchFoodItems();
      setError(null);
    } catch (err: any) {
      setError('Failed to delete food item');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedFoodItem) return;
    
    try {
      setLoading(true);
      
      // Check if current user already has a rating
      const currentUserRating = getCurrentUserRating(selectedFoodItem);
      
      if (currentUserRating) {
        // Update existing rating
        const updateData: UpdateFoodRatingDto = {
          rating: ratingForm.rating,
          comment: ratingForm.comment
        };
        await foodItemAPI.updateRating(ratingForm.foodItemId, updateData);
      } else {
        // Add new rating
        await foodItemAPI.addRating(ratingForm.foodItemId, ratingForm);
      }
      
      setShowRatingModal(false);
      setRatingForm({ foodItemId: 0, rating: 5, comment: '' });
      setSelectedFoodItem(null);
      await fetchFoodItems();
      setError(null);
    } catch (err: any) {
      const currentUserRating = getCurrentUserRating(selectedFoodItem);
      setError(currentUserRating ? 'Failed to update rating' : 'Failed to add rating');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserRating = (item: FoodItemWithRatings) => {
    if (!user) return null;
    
    // Check if current user is baek or jeong and return their rating
    if (user.username === 'baek' || user.username === 'jaemin') {
      return item.baekRating;
    } else if (user.username === 'jeong') {
      return item.jeongRating;
    }
    return null;
  };

  const openRatingModal = (item: FoodItemWithRatings) => {
    const currentUserRating = getCurrentUserRating(item);
    
    setSelectedFoodItem(item);
    setRatingForm({
      foodItemId: item.id,
      rating: currentUserRating?.rating || 5,
      comment: currentUserRating?.comment || ''
    });
    setShowRatingModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingStatus = (item: FoodItemWithRatings) => {
    if (!user) return '⏳ 평가 대기';
    
    const currentUserRating = getCurrentUserRating(item);
    const otherUserRating = user.username === 'baek' ? item.jeongRating : item.baekRating;
    
    if (currentUserRating && otherUserRating) {
      return '✅ 모든 평가 완료';
    }
    
    if (currentUserRating && !otherUserRating) {
      const otherUser = user.username === 'baek' ? 'Jeong' : 'Baek';
      return `⏳ ${otherUser} 평가 대기 (내 평가: ${currentUserRating.rating}⭐)`;
    }
    
    if (!currentUserRating && otherUserRating) {
      return `⏳ 내 평가 대기 (상대방 평가: ${otherUserRating.rating}⭐)`;
    }
    
    return '⏳ 평가 대기 (미평가)';
  };


  if (loading && foodItems.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>🍽️ Food Ranking</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          ➕ Add New Food
        </button>
      </div>

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Filters and Sort */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '20px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#495057' }}>
            평가 상태:
          </label>
          <select
            value={filter === 'baek-rated' || filter === 'jeong-rated' ? 'all' : filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            style={{
              padding: '8px 12px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">전체</option>
            <option value="completed">평가 완료</option>
            <option value="incomplete">평가 대기</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#495057' }}>
            사용자 필터:
          </label>
          <select
            value={filter === 'baek-rated' ? 'baek-rated' : filter === 'jeong-rated' ? 'jeong-rated' : 'all'}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            style={{
              padding: '8px 12px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">전체</option>
            <option value="baek-rated">Baek 평가</option>
            <option value="jeong-rated">Jeong 평가</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#495057' }}>
            정렬:
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            style={{
              padding: '8px 12px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              backgroundColor: 'white',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="date">최신순</option>
            <option value="rating-desc">평점 높은순</option>
            <option value="rating-asc">평점 낮은순</option>
          </select>
        </div>
      </div>

      {/* Food Items Grid */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {foodItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: item.isCompleted ? '#f8f9fa' : 'white'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {/* Image */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={item.foodImage}
                  alt={`${item.restaurantName} - ${item.foodType}`}
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedImage({
                      src: item.foodImage,
                      alt: `${item.restaurantName} - ${item.foodType}`
                    });
                    setShowImageModal(true);
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#333', textAlign: 'center' }}>
                      🏪 {item.restaurantName} - {item.foodType}
                    </h3>
                    <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                      📅 {formatDate(item.date)}
                    </p>
                    {item.description && (
                      <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                        {item.description}
                      </p>
                    )}
                    <div style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>
                      {getRatingStatus(item)}
                    </div>
                  </div>

                  {/* Rating Action */}
                  {!item.isCompleted && (
                    <button
                      onClick={() => openRatingModal(item)}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ffc107',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {getCurrentUserRating(item) ? '⭐ 평가 수정' : '⭐ 평가하기'}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteFoodItem(item.id, item.restaurantName)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      marginLeft: '10px'
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>

                {/* Ratings Display */}
                <div style={{ 
                  marginTop: '15px', 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr auto', 
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  {/* Baek Rating */}
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: item.baekRating ? '#e8f5e8' : '#f8f9fa',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      👨‍💼 Baek
                    </div>
                    {item.baekRating ? (
                      <>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                          ⭐ {item.baekRating.rating}/10
                        </div>
                        {item.baekRating.comment && (
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            "{item.baekRating.comment}"
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: '14px', color: '#999' }}>미평가</div>
                    )}
                  </div>

                  {/* Jeong Rating */}
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: item.jeongRating ? '#e8f5e8' : '#f8f9fa',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                      👩‍💼 Jeong
                    </div>
                    {item.jeongRating ? (
                      <>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                          ⭐ {item.jeongRating.rating}/10
                        </div>
                        {item.jeongRating.comment && (
                          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            "{item.jeongRating.comment}"
                          </div>
                        )}
                      </>
                    ) : (
                      <div style={{ fontSize: '14px', color: '#999' }}>미평가</div>
                    )}
                  </div>

                  {/* Average Rating */}
                  {item.averageRating && (
                    <div style={{ 
                      padding: '15px', 
                      backgroundColor: '#fff3e0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '2px solid #ff9800'
                    }}>
                      <div style={{ fontSize: '12px', color: '#ef6c00', marginBottom: '4px' }}>
                        평균 평점
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef6c00' }}>
                        ⭐ {item.averageRating.toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {foodItems.length === 0 && !loading && (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
          No food items found for the selected filter.
        </div>
      )}

      {/* Create Food Item Modal */}
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
            padding: '20px',
            borderRadius: '8px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3>🍽️ Add New Food Item</h3>
            <form onSubmit={handleCreateItem} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    🏪 Restaurant Name:
                  </label>
                  <input
                    type="text"
                    value={createForm.restaurantName}
                    onChange={(e) => setCreateForm({ ...createForm, restaurantName: e.target.value })}
                    placeholder="Restaurant name"
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    🍕 Food Name:
                  </label>
                  <input
                    type="text"
                    value={createForm.foodType}
                    onChange={(e) => setCreateForm({ ...createForm, foodType: e.target.value })}
                    placeholder="e.g., Margherita Pizza, Bulgogi Burger"
                    required
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  📅 Date:
                </label>
                <input
                  type="date"
                  value={createForm.date}
                  onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  📝 Description:
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Optional description"
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  📸 Food Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  * 사진은 선택사항입니다
                </small>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '4px' }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setPreviewImage('');
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedFoodItem && (
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
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3>{getCurrentUserRating(selectedFoodItem) ? '⭐ 평가 수정' : '⭐ 평가하기'}</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '6px', 
              marginBottom: '20px' 
            }}>
              <strong>{selectedFoodItem.restaurantName}</strong><br />
              {selectedFoodItem.foodType} - {formatDate(selectedFoodItem.date)}
            </div>
            
            <form onSubmit={handleAddRating} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  ⭐ Rating (1-10):
                </label>
                <select
                  value={ratingForm.rating}
                  onChange={(e) => setRatingForm({ ...ratingForm, rating: parseInt(e.target.value) })}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} ⭐</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  💬 Comment:
                </label>
                <textarea
                  value={ratingForm.comment}
                  onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                  placeholder="Your thoughts about this food..."
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowRatingModal(false);
                    setSelectedFoodItem(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#ffc107',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? (getCurrentUserRating(selectedFoodItem) ? '수정 중...' : '평가 중...') : (getCurrentUserRating(selectedFoodItem) ? '평가 수정' : '평가 추가')}
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
            zIndex: 1000,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={() => {
            setShowImageModal(false);
            setSelectedImage(null);
          }}
        >
          <div 
            style={{ 
              position: 'relative',
              maxWidth: '50vw',
              maxHeight: '50vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            />
            <button
              onClick={() => {
                setShowImageModal(false);
                setSelectedImage(null);
              }}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
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

export default FoodItemRanking;