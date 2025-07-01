'use client'
import React, { useState, useEffect, useMemo } from 'react';
import {formatQuery, QueryBuilder} from "react-querybuilder";
import {QueryBuilderAntD} from "@react-querybuilder/antd";
// 修复：直接从 CDN 的 ES Module (mjs) 版本导入库
import {
    Card,
    Typography,
    Space,
    Button,
    Divider,
    Tag,
    message,
    Select, // 引入 Select 组件
} from 'antd';

const { Title, Paragraph, Text } = Typography;

// --- 字段定义 ---

// 1. 定义标准查询的字段
const standardFields = [
    { name: 'name', label: '姓名', inputType: 'text' },
    { name: 'salary', label: '薪水', inputType: 'number' },
    { name: 'department_name', label: '部门名称', inputType: 'text' },
    { name: 'hire_date', label: '入职日期', inputType: 'date' },
    { name: 'position', label: '职位', inputType: 'text' },
];

// 2. 定义派生表查询的字段
// (查询高于部门平均薪资的员工)
const derivedFields = [
    ...standardFields, // 包含所有标准字段
    // 新增来自派生表的“虚拟”字段
    { name: 'department_avg_salary', label: '部门平均薪水', inputType: 'number', type: 'derived' },
];

const chineseTranslations = {
    addRule: { label: '添加规则', title: '添加规则' },
    addGroup: { label: '添加分组', title: '添加分组' },
    removeRule: { label: 'x', title: '删除规则' },
    removeGroup: { label: 'x', title: '删除分组' },
    cloneRule: { title: '克隆规则' },
    cloneGroup: { title: '克隆分组' },
    not: { label: '非' },
};

const initialQuery = {
    combinator: 'and',
    rules: [],
};

const App = () => {
    const [query, setQuery] = useState(initialQuery);
    // --- 新增状态：管理当前的查询模式 ---
    const [queryMode, setQueryMode] = useState('standard');

    // 根据当前模式，动态选择要使用的字段列表
    const fields = useMemo(() => {
        if (queryMode === 'derived_avg_salary') {
            return derivedFields;
        }
        return standardFields;
    }, [queryMode]);

    // 当查询模式改变时，重置查询树
    const handleModeChange = (newMode:any) => {
        setQueryMode(newMode);
        setQuery(initialQuery); // 重置查询，防止字段不匹配
        message.info(`查询模式已切换，查询条件已重置。`);
    };

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/react-querybuilder@7.4.1/dist/query-builder.css';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const handleCopyToClipboard = (text:any) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                message.success('已复制到剪贴板！');
            }).catch(err => {
                message.error('复制失败',err);
            });
        }
    };

    const formattedSQL = formatQuery(query, 'sql');

    // 最终发送到后端的数据结构
    const dataToSend = {
        mode: queryMode,
        query: query
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <Card>
                <Title level={3}>高级查询构建器 (支持派生表)</Title>
                <Paragraph type="secondary">
                    通过切换下面的“查询模式”，可以选择不同的数据视图。构建器会动态更新可用的字段，后端则会根据模式选择不同的SQL模板。
                </Paragraph>

                {/* --- 新增UI：查询模式切换器 --- */}
                <Space style={{ marginBottom: '20px' }}>
                    <Text strong>查询模式:</Text>
                    <Select value={queryMode} onChange={handleModeChange} style={{width: 280}}>
                        <Select.Option value="standard">基础员工查询</Select.Option>
                        <Select.Option value="derived_avg_salary">查询高于部门平均薪资的员工</Select.Option>
                    </Select>
                </Space>

                <QueryBuilderAntD>
                    <QueryBuilder
                        fields={fields} // 使用动态字段列表
                        query={query}
                        onQueryChange={q => setQuery(q)}
                        showCloneButtons
                        showNotToggle
                        translations={chineseTranslations}
                    />
                </QueryBuilderAntD>

                <Divider />

                <Title level={4}>生成的查询结果</Title>
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
                <Paragraph type="secondary">
                    以下是将发送到后端的数据。后端会根据 <Tag>mode</Tag> 字段来决定使用哪个SQL模板，然后将 <Tag>query</Tag> 对象解析并应用到 `WHERE` 子句中。
                </Paragraph>
                <pre style={{ background: '#eee', padding: '10px', borderRadius: '4px', marginTop: '8px' }}>
            <code>{JSON.stringify(dataToSend, null, 2)}</code>
        </pre>
                <Button
                    size="small"
                    style={{ marginTop: 8 }}
                    onClick={() => handleCopyToClipboard(JSON.stringify(dataToSend, null, 2))}
                >
                    复制发送到后端的数据
                </Button>
            </Card>
        </div>
    );
};

export default App;
