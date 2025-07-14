'use client'
import React, { useState, useMemo } from 'react';
import { Table } from 'antd';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
// import { restrictToVerticalAxis } from '@dnd-kit/modifiers'; // Removed this dependency
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HolderOutlined } from '@ant-design/icons';

// 初始数据
const initialData = [
    { id: '1', team: 'Team A', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
    { id: '2', team: 'Team A', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
    { id: '3', team: 'Team B', name: 'Not Expandable', age: 29, address: 'Jiangsu No. 1 Lake Park' },
    { id: '4', team: 'Team B', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
    { id: '5', team: 'Team B', name: 'Jim Red', age: 25, address: 'Tokyo No. 1 Lake Park' },
    { id: '6', team: 'Team C (Single)', name: 'Single Row', age: 50, address: 'Paris No. 1 Lake Park' },
    { id: '7', team: 'Team D', name: 'User One', age: 33, address: 'Berlin No. 1 Lake Park' },
    { id: '8', team: 'Team D', name: 'User Two', age: 45, address: 'Moscow No. 1 Lake Park' },
];

// 拖拽手柄组件
const DragHandle = ({ type, ...props }) => (
    <HolderOutlined
        {...props}
        style={{ cursor: 'move', color: '#999', marginRight: 8 }}
    />
);

// 自定义的可拖拽行组件
const DraggableRow = ({ children, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });
    const style = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    // 将 listeners 分配给不同的拖拽手柄
    const teamListeners = props.record.rowSpan > 0 ? { ...listeners } : {};
    const nameListeners = { ...listeners };

    // 注入拖拽手柄到 children
    const newChildren = React.Children.map(children, (child) => {
        if (child.props.dataIndex === 'team') {
            return React.cloneElement(child, {
                children: (
                    <>
                        {props.record.rowSpan > 0 && <DragHandle {...attributes} {...teamListeners} data-drag-type="group" />}
                        {child.props.children}
                    </>
                ),
            });
        }
        if (child.props.dataIndex === 'name') {
            return React.cloneElement(child, {
                children: (
                    <>
                        <DragHandle {...attributes} {...nameListeners} data-drag-type="item" />
                        {child.props.children}
                    </>
                ),
            });
        }
        return child;
    });

    return (
        <tr {...props} ref={setNodeRef} style={style}>
            {newChildren}
        </tr>
    );
};

// 主表格组件
const DraggableRowspanTable = () => {
    const [data, setData] = useState(initialData);

    // 预处理数据，计算 rowSpan
    const processedData = useMemo(() => {
        const teamMap = new Map();
        data.forEach(item => {
            if (!teamMap.has(item.team)) {
                teamMap.set(item.team, []);
            }
            teamMap.get(item.team).push(item);
        });

        const result = [];
        teamMap.forEach(group => {
            group.forEach((item:any, groupIndex) => {
                result.push({
                    ...item,
                    rowSpan: groupIndex === 0 ? group.length : 0,
                });
            });
        });
        return result;
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                // 拖动 1px 即可触发
                distance: 1,
            },
        }),
    );

    const onDragEnd = ({ active, over, activatorEvent }) => {
        if (!over || active.id === over.id) {
            return;
        }

        // 从拖拽手柄的 data- attribute 获取拖拽类型
        const dragType = activatorEvent.target.closest('[data-drag-type]')?.dataset.dragType;

        setData((previousData) => {
            const activeIndex = previousData.findIndex((i) => i.id === active.id);
            const overIndex = previousData.findIndex((i) => i.id === over.id);
            const activeItem = previousData[activeIndex];
            const overItem = previousData[overIndex];

            if (dragType === 'group') {
                // --- 分组拖拽逻辑 ---
                const activeGroup = previousData.filter(item => item.team === activeItem.team);
                const otherItems = previousData.filter(item => item.team !== activeItem.team);
                const overGroupStartIndex = otherItems.findIndex(item => item.team === overItem.team);

                if (overGroupStartIndex !== -1) {
                    otherItems.splice(overGroupStartIndex, 0, ...activeGroup);
                    return otherItems;
                }
                return previousData; // 如果目标位置不合法，则不移动

            } else if (dragType === 'item') {
                // --- 组内拖拽逻辑 ---
                if (activeItem.team !== overItem.team) {
                    // 不允许拖拽到其他分组
                    return previousData;
                }
                return arrayMove(previousData, activeIndex, overIndex);
            }

            return previousData;
        });
    };

    const columns = [
        { title: 'Team', dataIndex: 'team', onCell: (record) => ({ rowSpan: record.rowSpan }) },
        { title: 'Name', dataIndex: 'name' },
        { title: 'Age', dataIndex: 'age' },
        { title: 'Address', dataIndex: 'address' },
        { title: 'Action', key: 'action', render: () => <a>Delete</a> },
    ];

    return (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext items={data.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                <div style={{ padding: '24px' }}>
                    <h2>可合并行与分组拖拽的 Antd 表格 (@dnd-kit)</h2>
                    <p>拖拽 "Team" 列的图标可移动整个分组；拖拽 "Name" 列的图标可在组内排序。</p>
                    <Table
                        components={{ body: { row: DraggableRow } }}
                        rowKey="id"
                        columns={columns}
                        dataSource={processedData}
                        pagination={false}
                        bordered
                    />
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default DraggableRowspanTable;
