import React, { useState, useEffect, useCallback } from 'react';
import { orderAPI, Order, CreateOrderDto, CompleteOrderDto } from '../services/api';
import FoodRank from './FoodRank';


const Orders: React.FC = () => {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<CreateOrderDto>({
    date: '',
    foodType: '',
    details: ''
  });
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [completingOrder, setCompletingOrder] = useState<Order | null>(null);
  const [completeForm, setCompleteForm] = useState<CompleteOrderDto>({
    restaurantName: '',
    foodImage: '',
    rating: 5,
    rankComment: ''
  });
  const [activeTab, setActiveTab] = useState<'orders' | 'rankings'>('orders');
  const [orderSubTab, setOrderSubTab] = useState<'pending' | 'completed'>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const [pendingOrders, completedOrders] = await Promise.all([
        orderAPI.getPending(),
        orderAPI.getCompleted()
      ]);
      setPendingOrders(pendingOrders);
      setCompletedOrders(completedOrders);
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch orders: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await orderAPI.create(newOrder);
      setNewOrder({ date: '', foodType: '', details: '' });
      await fetchOrders();
      setError(null);
    } catch (err: any) {
      setError('Failed to create order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      setLoading(true);
      await orderAPI.update(editingOrder.id, {
        date: editingOrder.date,
        foodType: editingOrder.foodType,
        details: editingOrder.details
      });
      setEditingOrder(null);
      await fetchOrders();
      setError(null);
    } catch (err: any) {
      setError('Failed to update order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingOrder) return;

    try {
      setLoading(true);
      await orderAPI.complete(completingOrder.id, completeForm);
      setCompletingOrder(null);
      setCompleteForm({ 
        restaurantName: '',
        foodImage: '',
        rating: 5,
        rankComment: ''
      });
      await fetchOrders();
      setError(null);
    } catch (err: any) {
      setError('Failed to complete order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      setLoading(true);
      await orderAPI.delete(id);
      await fetchOrders();
      setError(null);
    } catch (err: any) {
      setError('Failed to delete order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🍽️ Food Management</h2>

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


      {/* Main Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #dee2e6', 
        marginBottom: '20px' 
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: activeTab === 'orders' ? '#007bff' : 'transparent',
            color: activeTab === 'orders' ? 'white' : '#007bff',
            borderBottom: activeTab === 'orders' ? '2px solid #007bff' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          📋 Food Orders
        </button>
        <button
          onClick={() => setActiveTab('rankings')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: activeTab === 'rankings' ? '#28a745' : 'transparent',
            color: activeTab === 'rankings' ? 'white' : '#28a745',
            borderBottom: activeTab === 'rankings' ? '2px solid #28a745' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500'
          }}
        >
          ⭐ Food Rankings
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          {/* Order Form - Only show in orders tab */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <h3>📝 New Food Order</h3>
            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
                  <input
                    type="date"
                    value={newOrder.date}
                    onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
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
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Food Type:</label>
                  <input
                    type="text"
                    value={newOrder.foodType}
                    onChange={(e) => setNewOrder({ ...newOrder, foodType: e.target.value })}
                    placeholder="e.g., Korean, Chinese, Pizza"
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Details:</label>
                <textarea
                  value={newOrder.details}
                  onChange={(e) => setNewOrder({ ...newOrder, details: e.target.value })}
                  placeholder="Order details, preferences, quantity, etc."
                  required
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
              <button 
                type="submit" 
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px'
                }}
              >
                {loading ? 'Creating...' : 'Create Order'}
              </button>
            </form>
          </div>

          {/* Order Sub-Tabs */}
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #dee2e6', 
            marginBottom: '20px' 
          }}>
            <button
              onClick={() => setOrderSubTab('pending')}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: orderSubTab === 'pending' ? '#007bff' : 'transparent',
                color: orderSubTab === 'pending' ? 'white' : '#007bff',
                borderBottom: orderSubTab === 'pending' ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ⏳ Pending ({pendingOrders.length})
            </button>
            <button
              onClick={() => setOrderSubTab('completed')}
              style={{
                padding: '8px 16px',
                border: 'none',
                backgroundColor: orderSubTab === 'completed' ? '#28a745' : 'transparent',
                color: orderSubTab === 'completed' ? 'white' : '#28a745',
                borderBottom: orderSubTab === 'completed' ? '2px solid #28a745' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ✅ Completed ({completedOrders.length})
            </button>
          </div>
        </>
      )}

      {/* Pending Orders */}
      {activeTab === 'orders' && orderSubTab === 'pending' && (
        <div>
          {pendingOrders.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No pending orders found.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {pendingOrders.map((order) => (
                <div key={order.id} style={{ 
                  border: '1px solid #dee2e6', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
                        📅 {formatDate(order.date)} - {order.foodType}
                      </h4>
                      <p style={{ margin: '0 0 10px 0', color: '#666' }}>{order.details}</p>
                      <small style={{ color: '#888' }}>
                        Created: {formatDate(order.createdAt)}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '15px' }}>
                      <button
                        onClick={() => setEditingOrder(order)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ffc107',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setCompletingOrder(order)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✅ Complete
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Orders */}
      {activeTab === 'orders' && orderSubTab === 'completed' && (
        <div>
          {completedOrders.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No completed orders found.
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '15px' }}>
              {completedOrders.map((order) => (
                <div key={order.id} style={{ 
                  border: '1px solid #d4edda', 
                  borderRadius: '8px', 
                  padding: '20px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>
                        ✅ {formatDate(order.date)} - {order.foodType}
                      </h4>
                      <p style={{ margin: '0 0 10px 0', color: '#666' }}>{order.details}</p>
                      {order.completedComment && (
                        <div style={{ 
                          backgroundColor: '#e9ecef', 
                          padding: '10px', 
                          borderRadius: '4px', 
                          margin: '10px 0' 
                        }}>
                          <strong>💬 Completion Note:</strong> {order.completedComment}
                        </div>
                      )}
                      {order.completedImage && (
                        <div style={{ margin: '10px 0' }}>
                          <strong>📸 Completion Photo:</strong><br />
                          <img 
                            src={order.completedImage} 
                            alt="Completed order" 
                            style={{ 
                              maxWidth: '200px', 
                              maxHeight: '200px', 
                              borderRadius: '4px',
                              marginTop: '5px'
                            }} 
                          />
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#888' }}>
                        <span>Created: {formatDate(order.createdAt)}</span>
                        {order.completedAt && <span>Completed: {formatDate(order.completedAt)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Food Rankings Tab */}
      {activeTab === 'rankings' && (
        <FoodRank />
      )}

      {/* Edit Modal */}
      {editingOrder && (
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
            <h3>✏️ Edit Order</h3>
            <form onSubmit={handleUpdateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date:</label>
                <input
                  type="date"
                  value={editingOrder.date}
                  onChange={(e) => setEditingOrder({ ...editingOrder, date: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Food Type:</label>
                <input
                  type="text"
                  value={editingOrder.foodType}
                  onChange={(e) => setEditingOrder({ ...editingOrder, foodType: e.target.value })}
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
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Details:</label>
                <textarea
                  value={editingOrder.details}
                  onChange={(e) => setEditingOrder({ ...editingOrder, details: e.target.value })}
                  required
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
                  {loading ? 'Updating...' : 'Update Order'}
                </button>
                <button 
                  type="button"
                  onClick={() => setEditingOrder(null)}
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

      {/* Complete Modal */}
      {completingOrder && (
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
            <h3>✅ Complete Order</h3>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '4px', 
              marginBottom: '20px' 
            }}>
              <strong>Order:</strong> {completingOrder.foodType} - {formatDate(completingOrder.date)}<br />
              <strong>Details:</strong> {completingOrder.details}
            </div>
            <form onSubmit={handleCompleteOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

              <div style={{ 
                backgroundColor: '#fff3e0', 
                padding: '15px', 
                borderRadius: '6px' 
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#ef6c00' }}>⭐ Food Rating</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      🏪 Restaurant Name:
                    </label>
                    <input
                      type="text"
                      value={completeForm.restaurantName}
                      onChange={(e) => setCompleteForm({ ...completeForm, restaurantName: e.target.value })}
                      placeholder="Restaurant or place name"
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
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      ⭐ Rating (1-10):
                    </label>
                    <select
                      value={completeForm.rating}
                      onChange={(e) => setCompleteForm({ ...completeForm, rating: parseInt(e.target.value) })}
                      required
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd' 
                      }}
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num} - {
                          num >= 9 ? '🤤 Amazing!' : 
                          num >= 7 ? '😋 Delicious!' : 
                          num >= 5 ? '😊 Good' : 
                          num >= 3 ? '😐 Okay' : '😝 Not great'
                        }</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    📸 Food Photo:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setCompleteForm({ 
                            ...completeForm, 
                            foodImage: e.target?.result as string 
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '4px', 
                      border: '1px solid #ddd' 
                    }}
                  />
                </div>
                <div style={{ marginTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    💬 Food Review (optional):
                  </label>
                  <textarea
                    value={completeForm.rankComment || ''}
                    onChange={(e) => setCompleteForm({ ...completeForm, rankComment: e.target.value })}
                    placeholder="How was the taste? Would you order again? Any recommendations..."
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
                  {loading ? 'Completing...' : 'Mark as Completed'}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setCompletingOrder(null);
                    setCompleteForm({ 
                      restaurantName: '',
                      foodImage: '',
                      rating: 5,
                      rankComment: ''
                    });
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

export default Orders;