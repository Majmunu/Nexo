import SelectDataMap from '@/modals/ContractScheme/SelectDataMap';
import { AssociatedTable } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/AddAssociatedPop/AssociatedTable';
import { Join } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/joins';
import { useNiceModal } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/hooks/useNiceModal';
import { useAssociatedTableStore } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/store';
import { useModal } from '@ebay/nice-modal-react';
import { Button, Form, Input, Select } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

// 定义组件 props 的接口
interface AddAssociatedPopProps {
  handleAddAssociated: Dispatch<SetStateAction<any[]>>;
  id: string;
  pid: string;
  joins: Join[];
  subquery: boolean;
  onBack: any;
  join: Join;
  onNavigate: any;
}

/**
 * AddAssociatedPop - 简要描述组件功能
 * @component
 * @param {Object} props - 组件的属性
 * @returns {JSX.Element} - 渲染的组件
 */
export const AddAssociatedPop: React.FC<AddAssociatedPopProps> = (props) => {
  // const modal = useModal();
  const { joins, subquery = false, pid, join, onNavigate } = props;
  const modal = useNiceModal('unified-modal');
  const schemeData = useAssociatedTableStore((state) => state.schemeData);
  const addJoinToQuery = useAssociatedTableStore(
    (state) => state.addJoinToQuery,
  );
  const addJoinToSubquery = useAssociatedTableStore(
    (state) => state.addJoinToSubquery,
  );
  const [form] = Form.useForm();
  /*!是否打开弹窗*/
  const [openSelectTable, setOpenSelectTable] = useState(false);
  /*!表格ID*/
  const [tableId, setTableId] = useState<number>();
  const targetTable = Form.useWatch('table', form);
  const [filterData, setFilterData] = useState([]);
  //获取筛选数据
  const getFilterData = (data) => {
    console.log('filterData', data);
    setFilterData(data);
  };
  const handleOk = async () => {
    const formValue = form.getFieldsValue();
    if (subquery) {
      props?.onBack();
      addJoinToSubquery(pid, {
        ...formValue,
        whereCondition: { children: filterData, subquery: false },
        id: tableId,
      });
    } else {
      addJoinToQuery({
        ...formValue,
        whereCondition: { children: filterData, subquery: false },
        id: tableId,
      });
      modal.hide();
    }
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  /**
   * 关闭选择表弹窗
   */
  const onClose = () => {
    setOpenSelectTable(false);
  };
  /**
   * 处理表弹窗提交事件
   */
  const onSubmit = (value, btnFinished) => {
    console.log('value', value);
    const { tableName, tableId } = value;
    form.setFieldValue('table', tableName);
    setOpenSelectTable(false);
    setTableId(tableId);
    btnFinished();
  };
  /**
   * 处理弹窗取消事件
   */
  const handleCancel = async () => {
    if (subquery) {
      props?.onBack();
    } else {
      modal.hide();
    }
  };
  /**
   * 点击选择数据库表
   */
  const handleClickSelectTable = () => {
    !targetTable && setOpenSelectTable(true);
  };
  /**
   * 点击清除数据库表
   */
  const handleSelectTableClear = () => {};

  useEffect(() => {
    if (join) {
      console.log('join', join);
      const { type, table, alias } = join;
      form.setFieldsValue({ alias, type, table });
      // form.setFieldsValue()
    }
  }, []);
  return (
    <div
    // title="选择关联类型"
    // open={modal.visible}
    // onOk={handleOk}
    // onCancel={handleCancel}
    // destroyOnClose
    // width={994}
    // maskClosable={false}
    >
      <Form
        {...layout}
        form={form}
        layout={'horizontal'}
        autoComplete="off"
        preserve={false}
      >
        <Form.Item
          name="type"
          label="关联类型"
          required={false}
          rules={[{ required: true, message: '请选择关联类型' }]}
        >
          <Select
            allowClear
            placeholder={'请选择关联类型'}
            options={[
              { value: 'LEFT', label: '左关联' },
              { value: 'RIGHT', label: '右关联' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="table"
          label="选择数据库的表"
          required={false}
          rules={[{ required: true, message: '请选择数据库的表' }]}
        >
          <Select
            onClick={handleClickSelectTable}
            onClear={handleSelectTableClear}
            placeholder={'请选择数据库的表'}
            open={false}
            allowClear
            options={[]}
          />
        </Form.Item>

        <Form.Item
          name="alias"
          label="设置表别名"
          required={false}
          rules={[{ required: true, message: '请输入别名' }]}
        >
          <Input placeholder="请输入别名" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      <AssociatedTable
        whereCondition={join?.whereCondition}
        getFilterData={getFilterData}
        joins={joins}
        pid={pid}
        id={tableId}
        onNavigate={onNavigate}
      />
      <SelectDataMap
        openModal={openSelectTable}
        schemeData={schemeData}
        onClose={onClose}
        onSubmit={onSubmit}
        database={form.getFieldValue('table')}
        isPop={true}
      />
      <div className={'footer'}>
        <Button type={'default'} onClick={handleCancel}>
          取消
        </Button>
        <Button type={'primary'} onClick={handleOk}>
          确定
        </Button>
      </div>
    </div>
  );
};
export default AddAssociatedPop;
