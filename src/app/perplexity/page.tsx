'use client'
import React, { useState } from 'react';
import { QueryBuilderAntD } from '@react-querybuilder/antd';
import { QueryBuilder, RuleGroupType, Field, Operator } from 'react-querybuilder';
import { Button, Typography } from 'antd';

const { Text } = Typography;

// 定义字段，模拟SQL Server表字段
const fields: Field[] = [
    { name: 'id', label: 'ID', inputType: 'number' },
    { name: 'name', label: 'Name', inputType: 'text' },
    { name: 'age', label: 'Age', inputType: 'number' },
    { name: 'department', label: 'Department', inputType: 'text' },
];

// 定义操作符，支持SQL常用操作符
const operators: Operator[] = [
    { name: '=', label: '=' },
    { name: '<>', label: '<>' },
    { name: '<', label: '<' },
    { name: '>', label: '>' },
    { name: '<=', label: '<=' },
    { name: '>=', label: '>=' },
    { name: 'IN', label: 'IN', valueSources: ['value'] },
    { name: 'NOT IN', label: 'NOT IN', valueSources: ['value'] },
    { name: 'LIKE', label: 'LIKE' },
];

// 初始空查询组
const initialQuery: RuleGroupType = {
    combinator: 'and',
    rules: [],
};

// 递归函数，将规则树转换为SQL Server子查询语句
const buildSQL = (query: RuleGroupType): string => {
    if (!query.rules || query.rules.length === 0) {
        return '1=1'; // 空条件默认真
    }

    const parts = query.rules.map((rule) => {
        if ('rules' in rule) {
            // 规则组，递归生成子查询
            return `(${buildSQL(rule as RuleGroupType)})`;
        } else {
            // 单条规则
            const { field, operator, value } = rule;
            if (operator?.toUpperCase() === 'IN' || operator?.toUpperCase() === 'NOT IN') {
                // 假设value是逗号分隔字符串，转换为SQL列表
                const vals = (value as string)
                    .split(',')
                    .map((v) => `'${v.trim()}'`)
                    .join(', ');
                return `${field} ${operator} (${vals})`;
            } else if (operator?.toUpperCase() === 'LIKE') {
                return `${field} LIKE '%${value}%'`;
            } else {
                // 普通比较
                return `${field} ${operator} '${value}'`;
            }
        }
    });

    return parts.join(` ${query.combinator.toUpperCase()} `);
};

const SqlServerQueryBuilder: React.FC = () => {
    const [query, setQuery] = useState<RuleGroupType>(initialQuery);
    const [sql, setSql] = useState<string>('');

    const handleGenerateSQL = () => {
        const sqlWhere = buildSQL(query);
        const fullSql = `SELECT * FROM YourTable WHERE ${sqlWhere}`;
        setSql(fullSql);
    };

    return (
        <div style={{ padding: 20 }}>
            <Typography.Title level={4}>SQL Server 子查询构建器 (基于 Ant Design)</Typography.Title>
            <QueryBuilderAntD>
                <QueryBuilder
                    fields={fields}
                    operators={operators}
                    query={query}
                    onQueryChange={setQuery}
                    controlClassnames={{ fields: 'ant-select', operators: 'ant-select', value: 'ant-input' }}
                    combinators={[{ name: 'and', label: 'AND' }, { name: 'or', label: 'OR' }]}
                    // enableNestedRules={true} // 允许嵌套子查询
                />
            </QueryBuilderAntD>
            <Button type="primary" onClick={handleGenerateSQL} style={{ marginTop: 16 }}>
                生成SQL语句
            </Button>
            {sql && (
                <pre style={{ marginTop: 16, backgroundColor: '#f5f5f5', padding: 10, borderRadius: 4 }}>
          {sql}
        </pre>
            )}
        </div>
    );
};

export default SqlServerQueryBuilder;
