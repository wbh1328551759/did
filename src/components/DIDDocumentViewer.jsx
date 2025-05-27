const DIDDocumentViewer = ({ didDocument, onDownload }) => {
  return (
    <div className="document-panel">
      <div className="panel-header">
        <h3 className="panel-title">DID DOCUMENT</h3>
        <button
          onClick={onDownload}
          className="download-btn"
        >
          <span className="btn-icon">⬇️</span>
          <span className="btn-text">DOWNLOAD</span>
        </button>
      </div>
      <div className="document-viewer">
        <pre className="document-code">
          <code>{JSON.stringify(didDocument, null, 2)}</code>
        </pre>
      </div>
    </div>
  )
}

export default DIDDocumentViewer 