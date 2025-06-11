const UpdateNotification = ({ show, message = "" }) => {
  if (!show) return null

  return (
    <div className="update-notification">
      <div className="notification-content">
        <span className="notification-icon">🔄</span>
        <span className="notification-text">{message}</span>
      </div>
    </div>
  )
}

export default UpdateNotification
