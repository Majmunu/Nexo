export interface FieldsItem {
  id: string; //目前由tableId+字段名组合而成，后续可根据具体要求决定是否使用uid
  columnName: string; //字段名 (EN)
  columnTitle: string; //字段名 (CN)
  dataType: string; //数据类型
  source: string; //所属表
  whereCondition?: []; //编辑字段条件
  rowSpan?: number; // 用于计算合并的辅助字段
  column: ColumnItem;
}

export interface ColumnItem {
  id: string;
  alias: string; //字段别名 在编辑字段后才有
  expression?: string; //表的别名_字段名  属于字段和值
  aggregate?: boolean;
  subquery?: boolean;
  type: string;
  table?: string; //当选择字段的时候
}

// 定义 store 的状态类型
export interface TablesSliceType {
  query: FieldsItem[]; // 当前页面的总数据
  addField: (argetQueryId: string, newFieldData: FieldsItem) => void; // 添加一个关联表
  deleteField: (targetQueryId: string, fieldIdToDelete: string) => void; // 根据 ID 删除一个关联表
  addColumnToField: (fieldId: string, column: ColumnItem) => void;
  setExpressionForField: (id: string, newSubQuery: any) => void;
}

export const createSubquerySlice = (set, get) => ({
  /* !仅存储子查询数据*/
  subquery: { joins: [], selectedFields: [], whereCondition: [] },
  /* *这里的数据操作仅针对子查询，不涉及页面*/
});
