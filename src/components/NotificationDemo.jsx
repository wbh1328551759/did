import React from 'react';

const NotificationDemo = ({ notification }) => {

  const showSuccessNotification = () => {
    notification.success('Operation completed successfully!', {
      title: 'Success',
      duration: 4000
    });
  };

  const showErrorNotification = () => {
    notification.error('An error occurred, please try again', {
      title: 'Error',
      duration: 6000
    });
  };

  const showWarningNotification = () => {
    notification.warning('Please note, this is a warning message', {
      title: 'Warning',
      duration: 5000
    });
  };

  const showInfoNotification = () => {
    notification.info('This is an information message', {
      title: 'Information',
      duration: 4000
    });
  };

  const showPersistentNotification = () => {
    notification.info('This notification will not disappear automatically', {
      title: 'Persistent Notification',
      autoClose: false
    });
  };

  const showLongMessage = () => {
    notification.success('This is a very long message to test how the notification component handles long text content. It should be able to wrap properly and maintain good visual effects.', {
      title: 'Long Message Test',
      duration: 8000
    });
  };

  const clearAllNotifications = () => {
    notification.clearNotifications();
  };

  return (
    <div className="notification-demo" style={{ 
      padding: '20px', 
      background: 'rgba(15, 23, 42, 0.8)', 
      borderRadius: '12px',
      margin: '20px',
      border: '1px solid rgba(148, 163, 184, 0.2)'
    }}>
      <h3 style={{ color: '#f1f5f9', marginBottom: '20px' }}>Notification System Demo</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '12px',
        marginBottom: '20px'
      }}>
        <button
          onClick={showSuccessNotification}
          style={{
            padding: '10px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Show Success
        </button>

        <button
          onClick={showErrorNotification}
          style={{
            padding: '10px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Show Error
        </button>

        <button
          onClick={showWarningNotification}
          style={{
            padding: '10px 16px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Show Warning
        </button>

        <button
          onClick={showInfoNotification}
          style={{
            padding: '10px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Show Info
        </button>

        <button
          onClick={showPersistentNotification}
          style={{
            padding: '10px 16px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Persistent
        </button>

        <button
          onClick={showLongMessage}
          style={{
            padding: '10px 16px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Long Message
        </button>
      </div>

      <button
        onClick={clearAllNotifications}
        style={{
          padding: '10px 16px',
          background: '#64748b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Clear All
      </button>
    </div>
  );
};

export default NotificationDemo; 