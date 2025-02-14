import DaumPostcode from "react-daum-postcode";

const AddressModal = ({ isOpen, onClose, onComplete }) => {
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close-button" onClick={onClose}>&times;</span>
          <DaumPostcode
            onComplete={(data) => {
              onComplete(data);
              onClose();
            }}
            autoClose={false}
            width={500}
            height={600}
          />
        </div>
      </div>
    );
  };

  export default AddressModal;
  