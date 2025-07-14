import { Join } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/joins';
import MDBMultipleFiltrate from '@/modals/ContractScheme/SqlServerLinkQueryRecord/components/SqlServerLinkFiltrate';
import { useAssociatedTableStore } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/store';
import React from 'react';
import styles from './styles.module.scss';

// 定义组件 props 的接口
interface AssociatedTableProps {
  joins: Join[];
  getFilterData: (data) => void;
  whereCondition: any;
  id: string | number;
  pid: string;
  onNavigate: any;
}

/**
 * AssociatedTable - 关联表中选择字段的表格
 * @component
 * @param {Object} props - 组件的属性
 * @returns {JSX.Element} - 渲染的组件
 */
export const AssociatedTable: React.FC<AssociatedTableProps> = React.memo(
  (props) => {
    const { getFilterData, whereCondition, pid, id, onNavigate } = props;
    const schemeData = useAssociatedTableStore((state) => state.schemeData);

    return (
      <div className={styles.AssociatedTable_container}>
        <MDBMultipleFiltrate
          getFilterData={getFilterData}
          joins={props?.joins}
          schemeData={schemeData}
          whereCondition={whereCondition}
          onNavigate={onNavigate}
          pid={pid}
          subquery={true}
          id={id}
        />
      </div>
    );
  },
);
