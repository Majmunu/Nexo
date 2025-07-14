import { Join } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/joins';
import { useAssociatedTableStore } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/store';
import { RequestFKTableInfo } from '@/utils/javaSqlServerRequest';
import { useAsyncEffect } from 'ahooks';
import { Table, TableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { FieldItem } from '../../components/AssociatedTableList/AssociatedTableItem';
import styles from './styles.module.scss';
const columns: ColumnsType<FieldItem> = [
  {
    title: '字段 (CN)',
    dataIndex: 'columnName',
    key: 'columnName',
  },
  {
    title: '字段 (EN)',
    dataIndex: 'columnTitle',
    key: 'columnTitle',
  },
  {
    title: '类型',
    dataIndex: 'dataType',
    key: 'dataType',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
];
// 定义组件 props 的接口
interface InputFieldProps {
  id: string;
  table: Join;
  setColumnData: (columnData: any) => void;
  columnData: any;
}

/**
 * InputField - 简要描述组件功能
 * @component
 * @param {Object} props - 组件的属性
 * @returns {JSX.Element} - 渲染的组件
 */
export const InputField: React.FC<InputFieldProps> = React.memo((props) => {
  const { table, setColumnData, columnData } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const database = useAssociatedTableStore((state) => state.database);
  const [tabledData, setTabledData] = useState([]);
  const rowSelection: TableProps<FieldItem>['rowSelection'] = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: FieldItem[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    // getCheckboxProps: (record: DataType) => ({
    //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //     name: record.name,
    // }),
  };
  useEffect(() => {
    selectedRowKeys &&
      setColumnData({ expression: selectedRowKeys, type: 'field' });
  }, [selectedRowKeys, setColumnData]);
  useAsyncEffect(async () => {
    if (table?.id) {
      let resData = await RequestFKTableInfo({
        database: database,
        tableId: table.id,
      });
      const data = resData.data;
      setTabledData(data.columns);
      // setSelectedRowKeys([]);
    }
  }, [table?.id]);
  useEffect(() => {
    if (columnData?.type === 'field') {
      const suffix = columnData.expression.includes('.')
        ? columnData.expression.split('.')[1]
        : null;
      setSelectedRowKeys([suffix]);
    }
  }, []);
  return (
    <div className={styles.InputField_container}>
      <Table
        style={{ width: 1082, height: 476, margin: '0 auto' }}
        dataSource={tabledData}
        columns={columns}
        pagination={false}
        bordered={true}
        rowKey={'columnName'}
        rowSelection={{ type: 'radio', ...rowSelection }}
      />
    </div>
  );
});
