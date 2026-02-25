import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Spin } from 'antd';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { useTranslation } from "react-i18next";
import './QRcode.scss'
const QRCodeModal = ({ visible, onClose, qrCodeValue, firstName }) => {
  const [downloading, setDownloading] = useState(false);
  const { t } = useTranslation('translation');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const downloadQRCode = () => {
    setDownloading(true);
    const qrCodeElement = document.getElementById('qrCodeContainer');
    if (!qrCodeElement) {
      setDownloading(false);
      return;
    }
    html2canvas(qrCodeElement).then(canvas => {
      if (!mountedRef.current) return;
      const link = document.createElement('a');
      link.download = `${firstName}.png`;
      link.href = canvas.toDataURL();
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      requestAnimationFrame(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
      });
      if (mountedRef.current) setDownloading(false);
    }).catch(err => {
      console.error("Error generating QR code:", err);
      if (mountedRef.current) setDownloading(false);
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
