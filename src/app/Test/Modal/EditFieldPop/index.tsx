import { InputField } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/EditFieldPop/InputField';
import { InputSubquery } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/EditFieldPop/InputSubquery';
import { InputValue } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Modal/EditFieldPop/InputValue';
import { Join } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/joins';
import { Column } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/query';
import { ColumnItem } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/table';
import { useNiceModal } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/hooks/useNiceModal';
import { useAssociatedTableStore } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/store';
import { useUpdateEffect } from 'ahooks';
import { Button, Form, Input, Select } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { v4 as uid } from 'uuid';
import styles from './styles.module.scss';
const FIELDS_OPTION = [
  { value: 'value', label: '值' },
  { value: 'field', label: '字段' },
  { value: 'subquery', label: '子查询' },
  { value: 'function', label: '函数方法' },
];
const InputComponent: { [key: string]: React.FC } = {
  value: InputValue,
  field: InputField,
  subquery: InputSubquery,
};
// 2. 创建一个通用的渲染器组件
interface DynamicComponentRendererProps {
  // 这个 key 将用于在 map 中查找组件
  componentKey: string;
  table: Join;
  setColumnData: (columnData: any) => void;
  // field: FieldsItem;
  id: string; //当前字段的id
  onNavigate: (view, props) => void;
  columnData: any;
  alias: string;
  pid: string; //父元素id
  subqueryId: string; //关联的子查询id
  isSub: boolean;
}

const DynamicComponentRenderer: React.FC<DynamicComponentRendererProps> = ({
  componentKey,
  table,
  setColumnData,
  id,
  onNavigate,
  columnData,
  alias,
  pid,
  subqueryId,
  isSub,
  // field,
}) => {
  // 从映射表中查找组件。如果找不到，则使用一个默认组件
  if (!componentKey) return <Fragment />;
  if (componentKey in InputComponent) {
    const ComponentToRender = InputComponent[componentKey];

    return (
      <ComponentToRender
        // @ts-ignore
        id={id}
        setColumnData={setColumnData}
        subqueryId={subqueryId}
        columnData={columnData}
        table={table}
        onNavigate={onNavigate}
        alias={alias}
        pid={pid}
        isSub={isSub}
      />
    );
  } else {
    return <Fragment />;
  }
};
// 定义组件 props 的接口
interface EditFieldPopProps {
  id: string; //当前字段id
  pid: string;
  field: Column;
  joins: Join[];
  handleSetConfig?: any;
  onNavigate: (view, props) => void;
  isSub: boolean; //是否是子组件
  onBack: () => void; //返回
}
const title = {
  value: '请输入值',
  field: '请选择字段',
  subquery: '子查询',
};
/**
 * EditFieldPop - 编辑字段弹窗
 * @component
 * @param  props - 组件的属性
 * @returns {JSX.Element} - 渲染的组件
 */
export const EditFieldPop: React.FC<EditFieldPopProps> = (props) => {
  // const modal = useModal();
  const modal = useNiceModal('unified-modal');
  console.log('props---EditFieldPop', props);
  const [form] = Form.useForm();
  const { id, field, joins = [], onNavigate, isSub, pid } = props;
  const componentKey = Form.useWatch('type', form);
  const selectedTable = Form.useWatch('table', form);
  useUpdateEffect(() => {
    setColumnData(null);
  }, [componentKey]);
  useEffect(() => {
    if (field?.column) {
      const { column } = field;
      form.setFieldsValue({
        type: column.type,
        alias: column.alias,
        table: column?.table,
      });
      setColumnData(column);
    }
  }, []);
  const updateColumnInSubquery = useAssociatedTableStore(
    (state) => state.updateColumnInSubquery,
  );
  const updateColumnFromQuery = useAssociatedTableStore(
    (state) => state.updateColumnFromQuery,
  );
  /*中间层数据用来从子组件获取数据*/
  const [columnData, setColumnData] = useState<ColumnItem>();
  const handleOk = async () => {
    try {
      const targetTable = joins.find((item) => item.table === selectedTable);
      const expression =
        componentKey === 'field'
          ? `${targetTable.alias}.${columnData?.expression}`
          : columnData?.expression;
      isSub
        ? updateColumnInSubquery(pid, id, {
            ...columnData,
            expression,
            alias: form.getFieldValue('alias'),
            id: uid(),
            type: componentKey,
            subquery: componentKey === 'subquery',
            table: targetTable?.table,
          })
        : updateColumnFromQuery(id, {
            expression,
            type: componentKey,
            subquery: componentKey === 'subquery',
            alias: form.getFieldValue('alias'),
          });
      isSub ? props.onBack() : modal.hide();
    } catch (e) {
      console.error('error', e);
    }
  };
  const handleCancel = async () => {
    isSub ? props.onBack() : modal.hide();
  };
  const onFinish = () => {};
  const onFinishFailed = () => {};
  return (
    // <Modal
    //   title="编辑字段"
    //   open={modal.visible}
    //   onOk={handleOk}
    //   onCancel={handleCancel}
    //   destroyOnClose
    //   width={1162}
    //   className={styles.EditFieldPop_container}
    //   maskClosable={false}
    // >
    <div className={styles.EditFieldPop_container}>
      <Form
        name="EditField"
        form={form}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        style={{ maxWidth: 1114 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="type"
          label="字段类型"
          required={false}
          rules={[{ required: true }]}
        >
          <Select options={FIELDS_OPTION} />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.type !== currentValues.type
          }
        >
          {({ getFieldValue }) => {
            console.log('getFieldValue', getFieldValue('type'));

            return getFieldValue('type') === 'field' ? (
              <Form.Item
                name="table"
                label="选择表"
                required={false}
                rules={[{ required: true }]}
              >
                <Select
                  fieldNames={{ label: 'table', value: 'table' }}
                  options={joins}
                />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item
          name="alias"
          label="字段别名"
          required={false}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
      <div className={'inputWrapper'}>
        <p style={{ marginLeft: 16 }}>{title[componentKey]}</p>
        <DynamicComponentRenderer
          id={id}
          table={joins.find((item) => item.table === selectedTable)}
          componentKey={componentKey}
          setColumnData={setColumnData}
          onNavigate={onNavigate}
          columnData={columnData}
          alias={form.getFieldValue('alias')}
          pid={pid}
          isSub={isSub}
          subqueryId={field?.subqueryId}
        />
      </div>
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
export default EditFieldPop;
