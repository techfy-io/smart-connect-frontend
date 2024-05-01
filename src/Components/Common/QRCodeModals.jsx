import React, { useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';

const QRCodeModal = ({ visible, onClose, qrCodeValue, firstName }) => {
  const [downloading, setDownloading] = useState(false);

  const downloadQRCode = () => {
    setDownloading(true);
    const qrCodeElement = document.getElementById('qrCodeContainer');
    html2canvas(qrCodeElement).then(canvas => {
      const link = document.createElement('a');
      link.download = `${firstName}.png`;
      link.href = canvas.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    });
  };

  return (
    <Modal
      width={400}
      title={"QR Code"}
      open={visible}
      onCancel={onClose}
      footer={null} // Removed the footer from here
    >
      <div id="qrCodeContainer" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <QRCode style={{ height: "300px" }} value={qrCodeValue} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}> {/* Centered buttons */}
        <Button key="close" onClick={onClose} style={{ marginLeft: '10px' }}> {/* Added margin for separation */}
          Close
        </Button>
        <Button style={{ backgroundColor: "#ff8000", width: "43%" }} key="download" type="primary" onClick={downloadQRCode} disabled={downloading}>
          {downloading ? <Spin /> : 'Download QR Code'}
        </Button>

      </div>
    </Modal>
  );
};

export default QRCodeModal;
