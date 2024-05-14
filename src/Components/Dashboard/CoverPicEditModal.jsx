import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CoverPicEditModal = ({ imageUrl, onSave, onCancel }) => {
  const [crop, setCrop] = useState({ aspect: 16 / 9 }); // Set initial crop aspect ratio
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const handleImageLoaded = (image) => {
    // Handle image loaded, if needed
  };

  const handleCropComplete = (crop) => {
    // Generate cropped image URL
    if (crop.width && crop.height) {
      // Define the getCroppedImage function here
      const getCroppedImage = (imageUrl, crop, callback) => {
        // Implementation of getCroppedImage function
      };

      getCroppedImage(imageUrl, crop, (croppedImage) => {
        setCroppedImageUrl(croppedImage);
      });
    }
  };

  const handleSave = () => {
    // Call onSave callback with cropped image URL
    onSave(croppedImageUrl);
  };

  return (
    <Modal
      open={false}
      title="Edit Cover Picture"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
    >
      <ReactCrop
        src={imageUrl}
        crop={crop}
        onChange={handleCropChange}
        onImageLoaded={handleImageLoaded}
        onComplete={handleCropComplete}
      />
    </Modal>
  );
};

export default CoverPicEditModal;
