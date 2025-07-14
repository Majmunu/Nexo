import React, { lazy, useEffect } from 'react';
import { useModalHistory } from '../../hooks/useModalHistory';
import { UnifiedModalProps, ViewType } from '../../types/modal';
import './test.scss';
// import { AddAssociatedPop } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/AddAssociatedPop';
// import { EditFieldPop } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/EditFieldPop';
// import { SubqueryPop } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/SubqueryPop';
// const MDBViewConsequence = lazy(() => import("./MDBViewConsequence"));
const SubqueryPop = lazy(() => import('../SubqueryPop'));
const EditFieldPop = lazy(() => import('../EditFieldPop'));
const AddAssociatedPop = lazy(() => import('../AddAssociatedPop'));
const UnifiedModal: React.FC<UnifiedModalProps> = ({
  visible = true,
  onClose,
  initialView = 'user',
  title,
  width,
  height,
  ...otherProps
}) => {
  const {
    currentView,
    currentProps,
    history,
    navigateTo,
    goBack,
    canGoBack,
    reset,
  } = useModalHistory(initialView, {
    ...otherProps,
  });

  useEffect(() => {
    console.log(2222);
    if (visible) {
      reset(initialView, {
        ...otherProps,
      });
    }
  }, [visible, initialView, reset]);
  console.log(123);
  const handleClose = () => {
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const renderCurrentView = () => {
    const commonProps = {
      currentView: currentView as ViewType,
      onNavigate: navigateTo,
      onBack: goBack,
      canGoBack,
    };

    switch (currentView) {
      case 'editFieldPop':
        // @ts-ignore
        return <EditFieldPop {...commonProps} {...currentProps} />;

      case 'AddAssociatedPop':
        // @ts-ignore
        return <AddAssociatedPop {...commonProps} {...currentProps} />;
      case 'subqueryPop':
        // @ts-ignore
        return <SubqueryPop {...commonProps} {...currentProps} />;
      // default:
      //   // @ts-ignore
      //   return <EditFieldPop {...commonProps} {...currentProps} />;
    }
  };

  if (!visible) return null;

  return (
    <div className="unified-modal" onClick={handleBackdropClick}>
      <div
        className="unified-modal__container"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="unified-modal__header">
          <div className="unified-modal__nav">
            {canGoBack && (
              <button
                onClick={goBack}
                className="unified-modal__back-btn"
                aria-label="返回上一页"
              >
                <span>返回上一页</span>
              </button>
            )}
            <h2 className="unified-modal__title">{title || '业务管理'}</h2>
          </div>
          <button
            onClick={handleClose}
            className="unified-modal__close-btn"
            aria-label="关闭弹窗"
          >
            <span>关闭弹窗</span>
          </button>
        </div>

        <div className="unified-modal__content">{renderCurrentView()}</div>

        <div className="unified-modal__footer">
          <div className="unified-modal__breadcrumb">
            当前路径:{' '}
            {history
              .map(
                (item, index) =>
                  item.view.toUpperCase() +
                  (index < history.length - 1 ? ' → ' : ''),
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedModal;
