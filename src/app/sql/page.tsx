'use client'
import React, {useState} from 'react';
import {
    Card,
    Typography,
    Space,
    Button,
    Divider,
    message,
} from 'antd';
import {formatQuery, QueryBuilder} from "react-querybuilder";
import {QueryBuilderAntD} from "@react-querybuilder/antd";
import 'react-querybuilder/dist/query-builder.css'

const {Title, Paragraph, Text} = Typography;

// 1. 定义字段，与我们之前的定义完全相同
const fields = [
    {name: 'name', label: '姓名', inputType: 'text'},
    {name: 'salary', label: '薪水', inputType: 'number'},
    {name: 'department_name', label: '部门名称', inputType: 'text'},
    {name: 'hire_date', label: '入职日期', inputType: 'date'},
    {name: 'position', label: '职位', inputType: 'text'},
];

// 2. 定义初始查询状态
const initialQuery = {
    combinator: 'and',
    rules: [
        {
            field: 'salary',
            operator: '>=',
            value: 8000,
        },
        {
            combinator: 'or',
            rules: [
                {field: 'position', operator: '=', value: '经理'},
                {field: 'position', operator: '=', value: '总监'},
            ],
        },
    ],
};
// --- 新增：定义中文翻译对象 ---
const chineseTranslations = {
    addRule: {
        label: '添加规则',
        title: '添加规则',
    },
    addGroup: {
        label: '添加分组',
        title: '添加分组',
    },
    removeRule: {
        label: 'x',
        title: '删除规则',
    },
    removeGroup: {
        label: 'x',
        title: '删除分组',
    },
    cloneRule: {
        title: '克隆规则',
    },
    cloneGroup: {
        title: '克隆分组',
    },
    not: {
        label: '非',
    },
    // 你也可以覆盖其他所有文本
};
const App = () => {
    const [query, setQuery] = useState(initialQuery);

    const handleCopyToClipboard = (text: any) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                message.success('已复制到剪贴板！');
            }).catch(err => {
                message.error('复制失败', err);
            });
        }
    };

    // 格式化后的 SQL (仅用于前端展示)
    const formattedSQL = formatQuery(query, 'sql');
    const formattedMDB = formatQuery(query, 'mongodb_query');

    return (
        <div style={{padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh'}}>
            <Card>
                <Title level={3}>使用 `react-querybuilder` 实现</Title>
                <Paragraph type="secondary">
                    这是一个使用专业库 `react-querybuilder` 及其 Ant Design 适配包 `@react-querybuilder/antd` 的示例。
                    注意，我们只需要管理配置和状态，所有复杂的 UI 和逻辑都由库处理。
                </Paragraph>

                {/* 3. 使用组件 */}
                <QueryBuilderAntD>
                    <QueryBuilder
                        fields={fields}
                        query={query}
                        onQueryChange={q => setQuery(q)}
                        showCloneButtons // 显示克隆按钮，这是库自带的强大功能
                        showNotToggle // 显示 "NOT" 切换器
                        translations={chineseTranslations} // <-- 将翻译对象传递给组件
                    />
                </QueryBuilderAntD>

                <Divider/>

                <Title level={4}>生成的查询结果</Title>
                <Space direction="vertical" style={{width: '100%'}}>
                    <div>
                        <Text strong>SQL (仅供预览):</Text>
                        <Button
                            size="small"
                            style={{marginLeft: 8}}
                            onClick={() => handleCopyToClipboard(formattedSQL)}
                        >
                            复制
                        </Button>
                        <pre style={{background: '#eee', padding: '10px', borderRadius: '4px', marginTop: '8px'}}>
                    <code>{formattedSQL}</code>
                        </pre>
                    </div>
                    <div>
                        <Text strong>MDB (仅供预览):</Text>
                        <Button
                            size="small"
                            style={{marginLeft: 8}}
                            onClick={() => handleCopyToClipboard(formattedSQL)}
                        >
                            复制
                        </Button>
                        <pre style={{background: '#eee', padding: '10px', borderRadius: '4px', marginTop: '8px'}}>
                    <code>{JSON.stringify(formattedMDB)}</code>
                        </pre>
                    </div>
                    <div>
                        <Text strong>JSON (发送给后端):</Text>
                        <Button
                            size="small"
                            style={{marginLeft: 8}}
                            onClick={() => handleCopyToClipboard(JSON.stringify(query, null, 2))}
                        >
                            复制
                        </Button>
                        <pre style={{background: '#eee', padding: '10px', borderRadius: '4px', marginTop: '8px'}}>
                    <code>{JSON.stringify(query, null, 2)}</code>
                </pre>
                    </div>
                </Space>

            </Card>
        </div>
    );
};

export default App;
