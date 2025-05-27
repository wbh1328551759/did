import DIDCard from './DIDCard'
import EmptyState from './EmptyState'

const DIDGrid = ({ 
  isLoaded, 
  walletConnected, 
  filteredDIDs, 
  selectedDID, 
  onSelectDID, 
  onCopyToClipboard, 
  onManageDID,
  onDeleteDID,
  onDismissWarning
}) => {
  return (
    <div className={`did-grid ${isLoaded ? 'loaded' : ''}`}>
      {!walletConnected ? (
        <EmptyState walletConnected={false} />
      ) : filteredDIDs.length === 0 ? (
        <EmptyState type="no-results" walletConnected={true} />
      ) : (
        filteredDIDs.map((did, index) => (
          <DIDCard
            key={did.id}
            did={did}
            index={index}
            selectedDID={selectedDID}
            onSelect={onSelectDID}
            onCopyToClipboard={onCopyToClipboard}
            onManageDID={onManageDID}
            onDeleteDID={onDeleteDID}
            onDismissWarning={onDismissWarning}
          />
        ))
      )}
    </div>
  )
}

export default DIDGrid 