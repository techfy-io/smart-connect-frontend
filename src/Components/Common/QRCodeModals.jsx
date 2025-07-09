import React, { useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { useTranslation } from "react-i18next";
import './QRcode.scss'
const QRCodeModal = ({ visible, onClose, qrCodeValue, firstName }) => {
  const [downloading, setDownloading] = useState(false);
  const { t, i18n } = useTranslation('translation');

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

  const cancelDownload = () => {
    setDownloading(false);
    onClose();
  }
  return (
    <Modal
      width={400}
      title={t("QR Code")}
      open={visible}
      onCancel={cancelDownload}
      footer={null}
    >
      <div id="qrCodeContainer" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <QRCode style={{ height: "300px" }} value={qrCodeValue} />
      </div>
      <div className='download-qr-code-action-btn' > {/* Centered buttons */}
        <Button className='qr-code-cancle-btn' key="close" onClick={cancelDownload} style={{ marginBottom: '10px' }}>
          {t("Cancel")}
        </Button>
        <Button className='qr-code-download-btn' key="download" type="primary" onClick={downloadQRCode} disabled={downloading} loading={downloading}>
          {t('Download QR Code')}
        </Button>
      </div>
    </Modal>

  );
};

export default QRCodeModal;
