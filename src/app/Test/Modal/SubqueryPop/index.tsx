import { AssociatedTableList } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/components/AssociatedTableList';
import { SelectedTableFields } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/components/SelectedTableFields';
import MDBMultipleFiltrate from '@/modals/ContractScheme/SqlServerLinkQueryRecord/components/SqlServerLinkFiltrate';

import { useNiceModal } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/hooks/useNiceModal';
import { Button } from 'antd';
import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAssociatedTableStore } from '../../store';

interface SubqueryPopProps {
  pid: string;
  isSub: boolean;
  searchResult: any;
  onNavigate: any;
  queryState: any;
  dispatch: any;
  onBack: any;
}

export const SubqueryPop = (props: SubqueryPopProps) => {
  const modal = useNiceModal('unified-modal');
  const { pid, onNavigate, onBack, isSub } = props;
  console.log('pid', pid);
  const database = useAssociatedTableStore(
    useShallow((state) => state.database),
  );
  const schemeData = useAssociatedTableStore(
    useShallow((state) => state.schemeData),
  );
  const deleteSubquery = useAssociatedTableStore(
    useShallow((state) => state.deleteSubquery),
  );

  const handleOk = async () => {
    if (isSub) {
      props?.onBack();
    } else {
      modal.hide();
    }
  };
  const queries = useAssociatedTableStore(useShallow((state) => state.queries));
  console.log('queries', queries, 111, pid);
  /**
   * 处理弹窗取消事件
   */
  const handleCancel = async () => {
    deleteSubquery(pid);
    console.log('subquery', isSub);
    if (isSub) {
      props?.onBack();
    } else {
      modal.hide();
    }
  };
  return (
    <div>
      <div>
        {/*关联表列表模块*/}
        <AssociatedTableList
          joins={queries[pid].joins ?? []}
          database={database}
          schemeData={schemeData}
          subquery={true}
          onBack={onBack}
          onNavigate={onNavigate}
          pid={pid}
        />
        {/*选择的字段模块*/}
        <SelectedTableFields
          joins={queries[pid].joins ?? []}
          selectedFields={queries[pid].columns ?? []}
          isSub={true}
          onNavigate={onNavigate}
          pid={pid}
        />
        {/*筛选条件模块*/}
        <MDBMultipleFiltrate
          whereCondition={queries[pid].whereCondition ?? {}}
          subquery={true}
          schemeData={schemeData}
        />
        <div className={'footer'}>
          <div className={'footer'}>
            <Button type={'default'} onClick={handleCancel}>
              取消
            </Button>
            <Button type={'primary'} onClick={handleOk}>
              确定
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubqueryPop;
