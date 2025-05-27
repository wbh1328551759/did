const SaveNotification = ({ show }) => {
  if (!show) return null

  return (
    <div className="save-notification">
      <div className="notification-content">
        <span className="notification-icon">✅</span>
        <span className="notification-text">DID has been updated successfully</span>
      </div>
    </div>
  )
}

export default SaveNotification 