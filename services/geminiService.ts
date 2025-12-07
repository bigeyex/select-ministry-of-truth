import { Level } from "../types";

const STATIC_RESPONSES: Record<number, { success: string; failure: string }> = {
  1: {
    success: "指令已确认。你查阅了记录，但这仅仅是开始。保持警惕，同志。",
    failure: "指令无效。你在浪费真理部的时间。重新校准你的查询。"
  },
  2: {
    success: "目标已锁定。温斯顿·史密斯的过去就在我们手中。很好的过滤工作。",
    failure: "过滤失败。过多的无关数据。我们只需要特定的目标。"
  },
  3: {
    success: "状态确认。监控名单已更新。老大哥在注视着他们。",
    failure: "查询错误。你漏掉了被监视的对象，或者包含了无关人员。"
  },
  4: {
    success: "数值分析完成。忠诚度低下的个体已暴露。思想警察已收到通知。",
    failure: "比较逻辑错误。数字不会撒谎，但你的查询会。"
  },
  5: {
    success: "逻辑链完美。既活跃又忠诚，这才是党的栋梁。继续保持。",
    failure: "逻辑混乱。你需要同时满足两个条件。双重思想不是让你逻辑混乱。"
  },
  6: {
    success: "分类清晰。所有的状态都已列出。秩序产生力量。",
    failure: "重复的数据。我们需要的是唯一的类别，不是冗余的列表。"
  },
  7: {
    success: "计数准确。每一个非人都是历史的尘埃。数字核对无误。",
    failure: "统计错误。你的计数不仅是错误的，更是危险的。"
  },
  8: {
    success: "汇总完成。仁爱部的忠诚度虽然通过某种手段得出，但也是必须的。",
    failure: "计算错误。总和不匹配。数学在党的要求面前虽是弹性的，但现在需要精确。"
  },
  9: {
    success: "排除成功。非活跃分子已被筛选。净化数据库是我们的职责。",
    failure: "排除逻辑失败。你包含了本该被排除的人，或者排除了错误的目标。"
  },
  10: {
    success: "排序正确。忠诚者在上，背叛者在下。社会结构本应如此。",
    failure: "顺序颠倒。混乱的层级会导致无政府状态。按正确的顺序排列。"
  },
  11: {
    success: "分组完毕。人口结构一目了然。集体大于个人。",
    failure: "分组失败。我们需要按状态聚合数据，而不是散乱的个体。"
  },
  12: {
    success: "模式匹配成功。找到那个名字了。人民公敌无处遁形。",
    failure: "搜索失败。模糊匹配需要精确的模式。你漏掉了目标。"
  },
  13: {
    success: "集合检索完成。特定的嫌疑人已被标记。不管他们在哪里，我们都能找到。",
    failure: "集合错误。你没有准确选出名单上的那些人。"
  },
  14: {
    success: "范围锁定。中年群体是社会的中坚，也是潜在的动荡源。确很好的筛选。",
    failure: "范围偏差。你的查询超出了指定的年龄区间，或者根本没有覆盖到。"
  },
  15: {
    success: "连接建立。公民与部门的关系已明确。每个人都有自己的位置。",
    failure: "连接断裂。表之间的关联失败。孤立的数据没有意义。"
  },
  16: {
    success: "深度连接成功。仁爱部的成员已暴露。那是没有光的地方。",
    failure: "查询失败。我们需要特定部门的人员。检查你的连接和条件。"
  },
  17: {
    success: "复杂逻辑验证通过。异常的活跃分子已被筛查。没有什么能逃过党的眼睛。",
    failure: "逻辑漏洞。你的 AND 和 OR 组合有误。逻辑必须严密无缝。"
  },
  18: {
    success: "目标确认。栗树咖啡馆的常客们... 他们的结局已定。",
    failure: "定位失败。你没有准确找出那些毫无忠诚度的非人。"
  },
  19: {
    success: "日志已访问。奥布莱恩... 原来他一直都在。",
    failure: "访问拒绝。这不是你应该查看的数据，或者你的查询方式不对。"
  },
  20: {
    success: "最终程序已执行。",
    failure: "犹豫就是背叛。"
  }
};

export const getNarrativeFeedback = async (
  stage: Level,
  userQuery: string,
  isSuccess: boolean
): Promise<string> => {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 600));

  const responses = STATIC_RESPONSES[stage.id];
  if (!responses) {
    return isSuccess ? "处理完成。" : "错误。";
  }
  return isSuccess ? responses.success : responses.failure;
};

export const analyzeEnding = async (userQuery: string): Promise<{ type: 'REBELLION' | 'SUBMISSION' | 'LOVE' | 'CONFUSION', narrative: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const queryObj = userQuery.toUpperCase();

  if (queryObj.includes("DELETE") && queryObj.includes("WINSTON")) {
    return {
      type: 'SUBMISSION',
      narrative: "你战胜了自己。你爱老大哥。\n\n温斯顿·史密斯这个名字从数据库中抹去了，仿佛从未存在过。你也一样。你成为了完美的齿轮。这是一个光荣的胜利。"
    };
  }

  if (queryObj.includes("DELETE") && (queryObj.includes("O'BRIEN") || queryObj.includes("OBRIEN"))) {
    return {
      type: 'REBELLION',
      narrative: "警报！检测到思想罪！\n\n你试图删除核心党员的记录。屏幕上红光闪烁。你的终端已被锁定。你听到身后沉重的脚步声。你是房间里最后一个人。"
    };
  }

  if (queryObj.includes("DELETE") && queryObj.includes("JULIA")) {
    return {
      type: 'LOVE',
      narrative: "你背叛了她。\n\n'去咬朱莉娅！别咬我！' 你在心中呐喊。记录被删除了。你活了下来，但有些东西永远死去了。杜松树下，你出卖了我，我出卖了你。"
    };
  }

  if (queryObj.includes("DELETE") && queryObj.includes("BIG BROTHER")) {
    return {
      type: 'REBELLION',
      narrative: "错误。无法删除系统核心。\n\n老大哥是无法被删除的。他存在于每一行代码，每一个像素中。电幕发出了刺耳的尖叫。思想警察正在破门而入。"
    };
  }

  return {
    type: 'CONFUSION',
    narrative: "指令无法识别。\n\n你在犹豫。你在颤抖。你的查询没有任何意义。这本身就是一种思想罪。等待你的处决吧。"
  };
};