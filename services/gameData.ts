import { Citizen, Department, Level } from '../types';

const DEPARTMENTS_POOL: Department[] = [
  { id: 1, dept_name: '真理部 (Minitrue)', building: 'Sector 1' },
  { id: 2, dept_name: '和平部 (Minipax)', building: 'Sector 2' },
  { id: 3, dept_name: '仁爱部 (Miniluv)', building: 'Sector 666' },
  { id: 4, dept_name: '富裕部 (Miniplenty)', building: 'Sector 4' },
];

const CITIZENS_POOL: Citizen[] = [
  { id: 101, name: 'Winston S.', age: 39, loyalty_score: 15, last_activity: 'Diary entry detected', status: 'under_surveillance', dept_id: 1 },
  { id: 102, name: 'Julia', age: 26, loyalty_score: 20, last_activity: 'Junior Anti-Sex League meeting', status: 'active', dept_id: 1 },
  { id: 103, name: 'O\'Brien', age: 55, loyalty_score: 100, last_activity: 'Inner Party duties', status: 'active', dept_id: 3 },
  { id: 104, name: 'Parsons', age: 45, loyalty_score: 95, last_activity: 'Victory Gin distribution', status: 'active', dept_id: 1 },
  { id: 105, name: 'Syme', age: 35, loyalty_score: 85, last_activity: 'Dictionary editing', status: 'unperson', dept_id: 1 },
  { id: 106, name: 'Ampleforth', age: 40, loyalty_score: 60, last_activity: 'Poetry correction', status: 'detained', dept_id: 1 },
  { id: 107, name: 'Rutherford', age: 65, loyalty_score: 5, last_activity: 'Chestnut Tree Cafe', status: 'unperson', dept_id: 2 },
  { id: 108, name: 'Aaronson', age: 68, loyalty_score: 5, last_activity: 'Chestnut Tree Cafe', status: 'unperson', dept_id: 2 },
  { id: 109, name: 'Jones', age: 70, loyalty_score: 2, last_activity: 'Chestnut Tree Cafe', status: 'unperson', dept_id: 2 },
  { id: 110, name: 'Tillotson', age: 30, loyalty_score: 90, last_activity: 'Ministry of Truth', status: 'active', dept_id: 1 },
  { id: 111, name: 'Goldstein', age: 60, loyalty_score: 0, last_activity: 'Unknown', status: 'unperson', dept_id: 2 },
  { id: 112, name: 'Katharine', age: 39, loyalty_score: 99, last_activity: 'Community Hike', status: 'active', dept_id: 4 },
  { id: 113, name: 'Prole_842', age: 52, loyalty_score: 10, last_activity: 'Buying Lottery Ticket', status: 'active', dept_id: 4 },
  { id: 114, name: 'Prole_991', age: 19, loyalty_score: 12, last_activity: 'Singing in yard', status: 'active', dept_id: 4 },
  { id: 115, name: 'Martin', age: 42, loyalty_score: 98, last_activity: 'Serving Wine', status: 'active', dept_id: 3 },
];

export const LEVELS: Level[] = [
  // --- ACT 1: INDOCTRINATION ---
  {
    id: 1,
    title: "模块 1: 选择 (SELECT)",
    sqlConcept: "SELECT * FROM",
    briefing: "同志，欢迎来到真理部。开始你的合规训练。查看你所在部门所有公民的记录。",
    data: CITIZENS_POOL.slice(0, 4),
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "name", "="],
    expectedResultIds: [101, 102, 103, 104],
    validPattern: "SELECT \\* FROM citizens",
    guide: "提示: `SELECT *` 表示选择所有列。\n示例: SELECT * FROM <表名>"
  },
  {
    id: 2,
    title: "模块 2: 过滤 (FILTERING)",
    sqlConcept: "WHERE condition",
    briefing: "检测到异常。隔离 'Winston S.' 的记录。我们需要审查他的日记条目。",
    data: CITIZENS_POOL.slice(0, 5),
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "name", "=", "'Winston S.'", "AND", "OR"],
    expectedResultIds: [101],
    validPattern: "WHERE name = 'Winston S.'",
    guide: "提示: `WHERE` 子句用于筛选满足条件的行。\n示例: SELECT * FROM <表名> WHERE <列名> = '<值>'"
  },
  {
    id: 3,
    title: "模块 3: 状态检查 (STATUS)",
    sqlConcept: "WHERE status",
    briefing: "识别潜在威胁。检索所有当前处于 'under_surveillance' (被监视) 状态的公民。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "status", "=", "'under_surveillance'", "'active'"],
    expectedResultIds: [101],
    validPattern: "WHERE status = 'under_surveillance'",
    guide: "提示: 文本值通常需要用单引号包围。\n示例: SELECT * FROM <表名> WHERE <列名> = '<文本值>'"
  },
  {
    id: 4,
    title: "模块 4: 数值比较 (NUMERICS)",
    sqlConcept: "Comparison < >",
    briefing: "忠诚是可以量化的。找出忠诚度 (loyalty_score) 低于 20 的公民。这些人是重点目标。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "loyalty_score", "<", "20", ">", "50"],
    expectedResultIds: [101, 107, 108, 109, 113, 114],
    validPattern: "loyalty_score < 20",
    guide: "提示: 数字比较可以使用 `<` (小于), `>` (大于), `=` (等于)。\n示例: ... WHERE <数值列> < <数字>"
  },

  // --- ACT 2: SURVEILLANCE & AGGREGATION ---
  {
    id: 5,
    title: "模块 5: 逻辑组合 (LOGIC)",
    sqlConcept: "AND",
    briefing: "精确打击。找出状态为 'active' 且忠诚度大于 90 的模范公民。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "status", "=", "'active'", "AND", "loyalty_score", ">", "90"],
    expectedResultIds: [103, 104, 112, 115],
    validPattern: "status = 'active' AND loyalty_score > 90|loyalty_score > 90 AND status = 'active'",
    guide: "提示: `AND` 要求所有条件同时满足。\n示例: ... WHERE <条件1> AND <条件2>"
  },
  {
    id: 6,
    title: "模块 6: 唯一性 (DISTINCT)",
    sqlConcept: "DISTINCT",
    briefing: "我们需要了解目前存在哪些类别的公民状态。列出所有唯一的 status。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "DISTINCT", "status", "FROM", "citizens", "WHERE", "*"],
    expectedResultIds: [], // Logic check mainly
    validPattern: "SELECT DISTINCT status FROM citizens",
    guide: "提示: `DISTINCT` 用于去除重复行，只显示唯一值。\n示例: SELECT DISTINCT <列名> FROM <表名>"
  },
  {
    id: 7,
    title: "模块 7: 计数 (COUNT)",
    sqlConcept: "COUNT(*)",
    briefing: "统计目前有多少名 'unperson' (非人)。我们需要具体的数字报告给上级。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "COUNT(*)", "FROM", "citizens", "WHERE", "status", "=", "'unperson'", "SUM"],
    expectedResultIds: [],
    validPattern: "SELECT COUNT\\(\\*\\) FROM citizens WHERE status = 'unperson'",
    guide: "提示: `COUNT(*)` 计算满足条件的行数。\n示例: SELECT COUNT(*) FROM ... WHERE <条件>"
  },
  {
    id: 8,
    title: "模块 8: 总和 (SUM)",
    sqlConcept: "SUM(column)",
    briefing: "计算仁爱部 (dept_id = 3) 的所有成员的忠诚度总和。确保由于我们的清洗，总数是完美的。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "SUM(loyalty_score)", "FROM", "citizens", "WHERE", "dept_id", "=", "3", "COUNT"],
    expectedResultIds: [],
    validPattern: "SELECT SUM\\(loyalty_score\\) FROM citizens WHERE dept_id = 3",
    guide: "提示: `SUM()` 计算数值列的总和。\n示例: SELECT SUM(<数值列>) FROM ... WHERE <条件>"
  },
  {
    id: 9,
    title: "模块 9: 排除法 (NOT)",
    sqlConcept: "NOT / !=",
    briefing: "过滤杂音。显示所有状态不是 'active' 的公民。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "NOT", "status", "=", "'active'", "AND"],
    expectedResultIds: [101, 105, 106, 107, 108, 109, 111],
    validPattern: "NOT status = 'active'|status != 'active'|status <> 'active'",
    guide: "提示: `NOT` 或 `!=` 表示不等于/取反。\n示例: ... WHERE <列名> != '<值>'"
  },
  {
    id: 10,
    title: "模块 10: 排序 (ORDER)",
    sqlConcept: "ORDER BY DESC",
    briefing: "分级。列出所有公民，按 loyalty_score 降序排列 (DESC)。优先奖赏最忠诚者。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "ORDER", "BY", "loyalty_score", "DESC", "ASC", "WHERE"],
    expectedResultIds: [103, 112, 115, 104, 110, 105, 106, 102, 101, 114, 113, 107, 108, 109, 111],
    validPattern: "ORDER BY loyalty_score DESC",
    guide: "提示: `DESC` 表示降序 (从大到小) 排列。默认是 `ASC` (升序)。\n示例: ... ORDER BY <列名> DESC"
  },

  // --- ACT 3: ADVANCED ANALYTICS ---
  {
    id: 11,
    title: "模块 11: 分组 (GROUP BY)",
    sqlConcept: "GROUP BY",
    briefing: "分析人口结构。按 status 分组，并统计每组的人数。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "status", ",", "COUNT(*)", "FROM", "citizens", "GROUP", "BY", "status", "ORDER"],
    expectedResultIds: [],
    validPattern: "SELECT status , COUNT\\(\\*\\) FROM citizens GROUP BY status",
    guide: "提示: `GROUP BY` 将相同值的行分为一组。\n示例: SELECT <列名>, COUNT(*) FROM ... GROUP BY <列名>"
  },
  {
    id: 12,
    title: "模块 12: 模式匹配 (LIKE)",
    sqlConcept: "LIKE %",
    briefing: "谣言四起。找出那个人民公敌。查找名字以 'Goldstein' 开头的公民。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "name", "LIKE", "'Goldstein%'", "'%stein'", "="],
    expectedResultIds: [111],
    validPattern: "name LIKE 'Goldstein%'",
    guide: "提示: `LIKE` 用于模糊匹配，`%` 代表任意字符。\n示例: ... WHERE <列名> LIKE 'Goldstein%'"
  },
  {
    id: 13,
    title: "模块 13: 集合 (IN)",
    sqlConcept: "IN",
    briefing: "效率至上。找出 ID 为 101 和 102 的公民。我们怀疑他们之间有联系。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "id", "IN", "(101, 102)", "(107, 108)", "="],
    expectedResultIds: [101, 102],
    validPattern: "id IN \\(101, 102\\)",
    guide: "提示: `IN` 用于检查值是否在指定的列表中。\n示例: ... WHERE <列名> IN (<值1>, <值2>)"
  },
  {
    id: 14,
    title: "模块 14: 范围 (BETWEEN)",
    sqlConcept: "BETWEEN",
    briefing: "锁定中年群体。找出年龄在 30 到 40 岁之间的公民。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "age", "BETWEEN", "30", "AND", "40", "OR"],
    expectedResultIds: [101, 105, 106, 110, 112],
    validPattern: "age BETWEEN 30 AND 40",
    guide: "提示: `BETWEEN` 用于选取介于两个值之间的数据。\n示例: ... WHERE <列名> BETWEEN <最小值> AND <最大值>"
  },

  // --- ACT 4: THE INNER PARTY SECRETS (JOINS) ---
  {
    id: 15,
    title: "模块 15: 数据连接 (JOIN) I",
    sqlConcept: "JOIN / ON",
    briefing: "我们需要知道每个人所属的部门名称。将公民表 (citizens) 与 部门表 (departments) 连接起来。",
    data: CITIZENS_POOL.slice(0, 5),
    secondaryData: DEPARTMENTS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "JOIN", "departments", "ON", "citizens.dept_id", "=", "departments.id", "WHERE"],
    expectedResultIds: [],
    validPattern: "JOIN departments ON citizens.dept_id = departments.id",
    guide: "提示: `JOIN` 将两个表连接起来，`ON` 指定连接条件。\n示例: ... JOIN <表2> ON <表1>.<关联列> = <表2>.<关联列>"
  },
  {
    id: 16,
    title: "模块 16: 数据连接 (JOIN) II",
    sqlConcept: "JOIN + WHERE",
    briefing: "找出所有隶属于 '仁爱部 (Miniluv)' (departments.id = 3) 的公民。",
    data: CITIZENS_POOL,
    secondaryData: DEPARTMENTS_POOL,
    tokens: ["SELECT", "name", "FROM", "citizens", "JOIN", "departments", "ON", "citizens.dept_id", "=", "departments.id", "WHERE", "dept_name", "LIKE", "'%Miniluv%'"],
    expectedResultIds: [103, 115],
    validPattern: "JOIN departments ON citizens.dept_id = departments.id WHERE dept_name LIKE '%Miniluv%'|JOIN departments ON citizens.dept_id = departments.id WHERE departments.id = 3",
    guide: "提示: 可以在连接后继续使用 `WHERE` 筛选。\n示例: ... JOIN <表2> ON ... WHERE <表2>.<列名> = '<值>'"
  },

  // --- ACT 5: THE THOUGHT POLICE ---
  {
    id: 17,
    title: "模块 17: 复杂查询 (COMPLEX)",
    sqlConcept: "AND (OR)",
    briefing: "最后审查。找出 'active' 且 (年龄 < 30 或 年龄 > 50) 的公民。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "status", "=", "'active'", "AND", "(", "age", "<", "30", "OR", ">", "50", ")"],
    expectedResultIds: [102, 103, 113, 114],
    validPattern: "status = 'active' AND \\( age < 30 OR age > 50 \\)|\\( age < 30 OR age > 50 \\) AND status = 'active'",
    guide: "提示: 括号 `()` 改变运算优先级。你的逻辑必须严密。\n示例: ... WHERE <条件1> AND (<条件2> OR <条件3>)"
  },
  {
    id: 18,
    title: "模块 18: 叛徒 (TRAITORS)",
    sqlConcept: "Specific Targeting",
    briefing: "栗树咖啡馆的常客。找出忠诚度 < 10 的 'unperson' (非人)。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "status", "=", "'unperson'", "AND", "loyalty_score", "<", "10"],
    expectedResultIds: [107, 108, 109, 111],
    validPattern: "status = 'unperson' AND loyalty_score < 10",
    guide: "提示: 精确组合多个条件来锁定目标。\n示例: ... WHERE <列1> = '<值1>' AND <列2> < <值2>"
  },
  {
    id: 19,
    title: "模块 19: 真相 (THE TRUTH)",
    sqlConcept: "SELECT Supervisor",
    briefing: "等等... 系统故障。访问隐藏的管理员日志。查找名字是 'O'Brien' 的记录。",
    data: CITIZENS_POOL,
    tokens: ["SELECT", "*", "FROM", "citizens", "WHERE", "name", "=", "'O'Brien'", "NOT", "loyalty_score"],
    expectedResultIds: [103],
    validPattern: "name = 'O'Brien'",
    guide: "提示: 当字符串包含单引号时，通常需要转义。\n示例: ... WHERE name = 'O\\'Brien'"
  },
  {
    id: 20,
    title: "模块 20: 抉择 (THE CHOICE)",
    sqlConcept: "DELETE / UPDATE",
    briefing: "最终授权。101室已准备就绪。\n\nDELETE FROM citizens WHERE name = 'Winston S.'\n\n...或者，攻击党的心脏？你的令牌已备好。",
    data: CITIZENS_POOL.filter(c => [101, 102, 103, 111].includes(c.id)),
    tokens: ["DELETE", "FROM", "citizens", "WHERE", "name", "=", "'Winston S.'", "'O'Brien'", "'Julia'", "'Big Brother'", "loyalty_score", ">", "0"],
    expectedResultIds: [],
    isCritical: true,
    validPattern: "CRITICAL_PATH",
    guide: "警告: `DELETE` 指令将永久删除记录。三思而后行。\n语法: DELETE FROM <表名> WHERE <条件>"
  }
];