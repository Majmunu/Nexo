import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
import styles from './styles.module.scss';

// 定义组件 props 的接口
interface InputValueProps {
  id: string;
  setColumnData: (columnData: any) => void;
  columnData: any;
}

/**
 * InputValue - 值输入组件
 * @component
 * @param {Object} props - 组件的属性
 * @returns {JSX.Element} - 渲染的组件
 */
export const InputValue: React.FC<InputValueProps> = React.memo((props) => {
  const { setColumnData, columnData } = props;
  const [form] = Form.useForm();
  const handleFormValuesChange = (_, values) => {
    console.log('handleFormValuesChange', values);
    setColumnData({ ...values, type: 'value' });
  };
  useEffect(() => {
    form.setFieldsValue({
      expression: columnData?.expression ?? null,
      description: columnData?.description ?? null,
    });
  }, []);
  return (
    <div className={styles.inputValue_container}>
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        style={{ maxWidth: 531 }}
        name={'value'}
        form={form}
        autoComplete={'false'}
        onValuesChange={handleFormValuesChange}
      >
        <Form.Item name={'expression'} required={true} label="输入框">
          <Input placeholder={'请输入'} />
        </Form.Item>
        <Form.Item name={'description'} required={false} label="描述">
          <Input.TextArea
            placeholder={'请输入'}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </div>
  );
});
