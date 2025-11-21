import React from "react";
function FilterBar({
  categories = [],
  filterCategory, setFilterCategory,
  filterStatus, setFilterStatus,
  filterDue, setFilterDue
}) {
  return (
    <div className="filter-toolbar">
      <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
        <option value="all">全部分类</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <option value="all">全部状态</option>
        <option value="uncompleted">待完成</option>
        <option value="completed">已完成</option>
      </select>
      <select value={filterDue} onChange={e => setFilterDue(e.target.value)}>
        <option value="all">所有时间</option>
        <option value="today">今天截止</option>
        <option value="week">一周内截止</option>
        <option value="overdue">已过期</option>
      </select>
    </div>
  );
}
export default FilterBar;
