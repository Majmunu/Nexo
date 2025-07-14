import React from 'react';
import UnifiedModal from '.';
import { useNiceModal } from '../../hooks/useNiceModal';

const ModalProvider: React.FC = () => {
  const unifiedModal = useNiceModal('unified-modal');
  return (
    <>
      {unifiedModal.visible && (
        <UnifiedModal
          visible={unifiedModal.visible}
          onClose={unifiedModal.hide}
          {...unifiedModal.props}
        />
      )}
    </>
  );
};

export default ModalProvider;
