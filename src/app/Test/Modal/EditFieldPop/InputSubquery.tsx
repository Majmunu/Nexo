import { FieldsItem } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/table';
import {
  createNewSubQuery,
  findColumnByFieldId,
} from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/utils';
import { useAssociatedTableStore } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/store';
import { CheckCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import React, { Fragment } from 'react';
import { v4 as uid } from 'uuid';
import { useShallow } from 'zustand/react/shallow';
import styles from './styles.module.scss';

// 定义组件 props 的接口
interface InputSubqueryProps {
  id: string;
  pid: string;
  subqueryId: string;
  field?: FieldsItem;
  alias?: string;
  columnData?: any;
  onNavigate: any;
  isSub: boolean;
  belongingTo?: string;
  handleSelectedSub?: (id: string) => void;
}

/**
 * InputSubquery - 子查询弹窗
 * @component
 * @param {Object} props - 组件的属性
 * @returns {JSX.Element} - 渲染的组件
 */
export const InputSubquery: React.FC<InputSubqueryProps> = (props) => {
  const {
    id,
    columnData,
    pid,
    isSub,
    subqueryId,
    belongingTo = '',
    handleSelectedSub,
  } = props;
  console.log('props', props);
  const createSubquery = useAssociatedTableStore(
    useShallow((state) => state.createSubquery),
  );
  const queries = useAssociatedTableStore(useShallow((state) => state.queries));
  const updateColumnFromQuery = useAssociatedTableStore(
    useShallow((state) => state.updateColumnFromQuery),
  );
  const updateColumnInSubquery = useAssociatedTableStore(
    useShallow((state) => state.updateColumnInSubquery),
  );

  const onClick = async () => {
    // 1.1 创建根查询
    const queryId = queries[subqueryId]
      ? subqueryId
      : createSubquery(pid ?? null);

    console.log('创建主查询:', queryId);
    // if(belongingTo==='filter')
    // {
    //
    // }else{
    //
    // }
    if (!queries[subqueryId]) {
      if (belongingTo === 'filter') {
        /* !处理筛选组件里面的子查询*/
        handleSelectedSub && handleSelectedSub(queryId);
      } else {
        /* *处理筛选字段里面的子查询*/
        isSub
          ? updateColumnInSubquery(pid, id, {
              subquery: true,
              subqueryId: queryId,
            })
          : updateColumnFromQuery(id, { subquery: true, subqueryId: queryId });
      }
    }
    // @ts-ignore
    props.onNavigate('subqueryPop', {
      title: '子查询',
      pid: queryId,
      isSub: isSub,
    });
  };
  return (
    <div className={styles.InputSubquery_container}>
      {!columnData?.expression ? (
        <Fragment>
          <PlusCircleOutlined style={{ fontSize: 50, color: '#3d84ff' }} />
          <span onClick={onClick}>点击添加子查询</span>
        </Fragment>
      ) : (
        <Fragment>
          <CheckCircleFilled style={{ fontSize: 50, color: '#51c319' }} />
          <span onClick={onClick}>已经设置子查询，点击重新设置</span>
        </Fragment>
      )}
    </div>
  );
};
