import { Join } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/joins';
import {
  addObjToArray,
  addObjToArrayById,
  deleteDataFromArrayById,
  updateDataToArray,
} from '@/modals/ContractScheme/SqlServerLinkQueryRecord/Slices/utils';
import { AssociatedTableStoreType } from '@/modals/ContractScheme/SqlServerLinkQueryRecord/store';

export interface Column {
  id: string; //目前由tableId+字段名组合而成，后续可根据具体要求决定是否使用uid
  columnName: string; //字段名 (EN)
  columnTitle: string; //字段名 (CN)
  dataType: string; //数据类型
  source: string; //所属表
  rowSpan?: number; // 用于计算合并的辅助字段
  column?: ColumnItem;
  aggregate: boolean;
  subquery: boolean;
  alias?: string; //字段别名
  expression?: string; //表的别名_字段名 属于字段和值
  whereCondition?: []; //编辑字段条件
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
export interface QuerySliceType {
  query: {
    joins: Array<Join>;
    columns: Array<Column>;
    whereCondition: { subquery: boolean; children: Array<any> };
    orderBy: Array<any>;
  }; // 当前页面的总数据
  addJoinToQuery: (newFieldData) => void; // 添加一个关联表
  deleteJoinFromQuery: (joinId: string) => void; // 删除一个关联表通过id
  addColumnToQuery: (newFieldData: Column) => void; // 选择字段
  deleteColumnFromQuery: (columnId: string) => void; // 删除一个字段通过id
  updateColumnFromQuery: (columnId: string, updateData) => void; // 更新一个字段通过id
  addConditionToQuery: (condition) => void; // 添加筛选条件数据
}

const InitQueryData = {
  joins: [],
  columns: [],
  whereCondition: { subquery: false, children: [] },
  orderBy: [],
};
export const createQuerySlice = (set, get) => ({
  /*当前页面的总数据*/
  query: InitQueryData,
  /* *这里的数据操作仅针对页面级别，不涉及子查询*/
  /* !--- joins 的 CRUD 操作  ----*/
  addJoinToQuery: (join: Join) =>
    set((state) => ({
      query: {
        ...state.query,
        joins: addObjToArray(state.query.joins, join),
      },
    })),

  deleteJoinFromQuery: (joinId: string) =>
    set((state) => ({
      query: {
        ...state.query,
        joins: deleteDataFromArrayById(state.query.joins, joinId),
      },
    })),
  /* !--- columns 的 CRUD 操作  ----*/
  /**
   * 添加字段
   * @param column
   */
  addColumnToQuery: (column) =>
    set((state) => ({
      query: {
        ...state.query,
        columns: addObjToArray(state.query.columns, column), // 调用外部纯函数
      },
    })),
  deleteColumnFromQuery: (columnId: string) =>
    set((state) => ({
      query: {
        ...state.query,
        columns: deleteDataFromArrayById(state.query.columns, columnId),
      },
    })),
  updateColumnFromQuery: (columnId: string, updateData) =>
    set((state) => ({
      query: {
        ...state.query,
        columns: updateDataToArray(state.query.columns, columnId, updateData),
      },
    })),
  /* !--- whereCondition 的 CRUD 操作  ----*/
  /**
   * 添加字段
   * @param id
   * @param column
   */
  addConditionToQuery: (condition: any) =>
    set((state) => ({
      query: {
        ...state.query,
        whereCondition: { children: condition, subquery: false },
      },
    })),
});
