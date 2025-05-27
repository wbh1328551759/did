const UpdateNotification = ({ show, message = "神经接口矩阵已更新" }) => {
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