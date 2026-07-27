-- house_builder · seed.sql（由 packages/supabase/scripts/build-seed.mjs 生成，勿手改）
-- 应用方式：Supabase SQL Editor 粘贴执行，或 psql -f seed.sql（需先跑 migrations）

-- ===== terms =====
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('men-tao', '门套', '包覆门洞的框架饰面，保护墙角并固定门扇；材质与包边方式直接影响耐用度和观感。', array['门框套', '哑口套']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('qiang-dian', '强电', '220V 供电线路（照明、插座、空调等），电线品牌与线径关系用电安全，属隐蔽工程。', array['强电电线', '电力线路']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ruo-dian', '弱电', '低电压信号线路（网络、电视、电话、监控），装修时与强电分管敷设避免干扰。', array['弱电电线', '网线电视线']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ji-jia-mian-ji', '计价面积', '装修公司据以计算套餐价的面积，通常按套内实测，≠ 房产商售卖面积（建筑面积）。', array['报价面积', '套内计价面积']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('shou-mai-mian-ji', '售卖面积', '购房合同上的建筑面积，含公摊；装修报价一般不按此计，需换算成计价面积。', array['建筑面积']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ying-zhuang', '硬装', '固定在建筑上不可移动的装修部分：水电、防水、瓦工、木作基层、墙面、门窗等。', array['基础装修', '硬装修']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('quan-an', '全案', '硬装+定制柜（有时含部分软装）的整包模式；『全案基础价』常不含管理费，签约前要问清。', array['全案基础价', '整装全案']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ke-li-ban', '颗粒板', '木屑颗粒热压板材，定制柜常用基材，性价比高；环保等级看甲醛释放（ENF/E0/E1）。', array['实木颗粒板', '刨花板']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('shi-mu-xin', '实木芯', '多层实木单板交错热压的板材，握钉力与防潮优于颗粒板，价格略高（本案 15㎡ 内 +3000）。', array['实木多层', '多层实木板']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ti-jiao-xian', '踢脚线', '墙面与地面交界处的收边条，保护墙根、遮盖伸缩缝；材质常与地面或门套呼应。', array['踢脚板', '地脚线']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ni-zi', '腻子', '刷漆前找平墙面的基层材料，耐水腻子更耐潮；基层质量决定乳胶漆最终效果。', array['腻子基层', '批腻子']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ru-jiao-qi', '乳胶漆', '水性内墙涂料，环保性看 VOC 与净味认证；通常一底两面三道工序。', array['墙面漆', '内墙涂料']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('fang-shui', '专业防水', '卫生间/阳台等湿区涂刷防水涂层并闭水试验，属隐蔽工程；返工代价极高，材料与工艺都关键。', array['防水涂料', '防水工程']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ji-cheng-diao-ding', '集成吊顶', '铝扣板模块+电器（浴霸/照明/换气）一体化吊顶，常用于厨卫，检修方便。', array['铝扣板吊顶']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('di-lou', '地漏', '地面排水口，核心是防臭防返溢；深水封或磁悬浮芯体验差异明显。', array['防臭地漏']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('ppr-gei-shui-guan', 'PPR给水管', '热熔连接的冷热水管材，隐蔽工程主角之一；管材与热熔工艺决定漏水风险。', array['PPR管', '给水管']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('lin-yu-fang', '淋浴房', '钢化玻璃干湿分离隔断；是否包含在套餐内、面积上限（如约≤3.6㎡）是常见增项点。', array['淋浴隔断', '玻璃淋浴房']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('quan-wu-ding-zhi', '全屋定制', '按户型定制的柜体（衣柜/橱柜/收纳），套餐常含固定投影面积（如 15㎡），超出按增项计。', array['定制柜', '定制家具']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('gong-cheng-guan-li-fei', '工程管理费', '装修公司收取的施工管理费用，常按硬装造价百分比（如 12%）计，注意计费基数。', array['管理费']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('xiang-mu-jing-li-fei', '项目经理费', '支付给驻场项目经理的费用（如硬装 2%），有的公司并入管理费，签约前确认口径。', array['项目管理费']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('yi-fang-yi-jia', '一房一价', '按面积档位列出的套餐总价查询表，通常含定制、不含管理费；核对自家计价面积落在哪一档。', array['一房一价表']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('chuang-tai-shi', '窗台石', '窗台台面石材，天然石/人造石/岩板均可；防水防晒且好打理是选材重点。', array['窗台板']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('xian-guan-di-he', '线管底盒', '电线穿管保护与开关插座预埋盒，属隐蔽工程辅材；阻燃等级与壁厚是质量关键。', array['穿线管', '接线底盒']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('fu-cai', '辅材', '水泥沙浆、管线、腻子、防水等不直接可见的基础材料；套餐差异常藏在辅材品牌里。', array['辅料']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('zhu-cai', '主材', '可见的成品材料：瓷砖、地板、门、洁具、橱柜等；套餐一般给品牌池供选择。', array['主材包']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('chai-gai', '拆改', '拆除原有墙体/地面/设施的工程，套餐通常不含、按实结算，是常见的价外支出。', array['拆除改造', '砸墙']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('cheng-pin-bao-hu', '成品保护', '施工期间对已完成部位（地面、门窗、柜体）覆膜防护，避免交叉污染与磕碰。', array['成品保护膜']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('jun-gong-bao-jie', '竣工保洁', '工程收尾后的全面清洁（除胶、除尘、玻璃），套餐是否包含要看合同明细。', array['开荒保洁']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('yin-bi-gong-cheng', '隐蔽工程', '完工后被覆盖看不见的工程（水电、防水、结构加固），质保期通常更长（如约 5 年）。', array['水电隐蔽']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();
insert into public.terms (slug, name, short_def, aliases, source, confidence) values ('zeng-xiang', '增项', '套餐范围之外另行收费的项目（拆改、超量定制、特殊工艺等）；控制增项是控预算核心。', array['加项', '增项费用']::text[], 'seed', 1) on conflict (slug) do update set name = excluded.name, short_def = excluded.short_def, aliases = excluded.aliases, updated_at = now();

-- ===== wiki_pages =====
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('fang-shui', 'fang-shui', '专业防水', '# 专业防水

## 是什么

在卫生间、阳台、厨房等湿区的地面与墙面涂刷防水涂料形成连续防水层，完成后做 24–48 小时**闭水试验**验收。属于隐蔽工程——贴砖后完全不可见，出问题需砸砖返工，代价极高。

## 材料档次

- **东方雨虹**：国内防水龙头，家装标配级，柔性/刚性涂料全线。
- **西卡（Sika）**：瑞士品牌，高端选择；本案 A5s 相比 AEs 的差异点之一就是防水可选西卡。

## 标准做法

1. 基层找平、阴阳角做圆弧；
2. 地面满涂 2–3 遍，墙面淋浴区上返 ≥1.8m，其他区域 ≥0.3m；
3. 门槛石下方止水坎；
4. 闭水试验并楼下查验，拍照留档写入验收单。

## 常见坑

只刷一遍就贴砖；墙面上返高度不足；地漏/管根等节点未加强。验收时重点看节点处理与闭水记录。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('ji-jia-mian-ji', 'ji-jia-mian-ji', '计价面积', '# 计价面积

## 是什么

装修公司套餐报价所依据的面积，通常按**套内实际测量面积**（有的公司按套内墙体中线）计算。它和购房合同上的**售卖面积（建筑面积）**不是一回事：售卖面积含公摊，普遍比计价面积大 15%–25%。

## 为什么重要

- 套餐价按「计价面积 × 档位单价」或「一房一价表」确定，面积口径直接决定总价。
- 本示例房：售卖面积 90㎡，实测计价面积 76.34㎡，落在 50≤S<80 档。
- 不同公司口径不同（套内 / 中线 / 建筑面积打折），**对比报价前必须先统一口径**。

## 怎么核对

1. 要求装修公司现场实测并给出测量单。
2. 用「工具页 → 计价面积计算器」按公摊比例粗估，误差大就要求复测。
3. 合同上写明计价面积与超面积单价（如本案 AEs +699 元/㎡、A5s +799 元/㎡）。

## 常见坑

- 用售卖面积直接套「一房一价表」，总价被放大一档。
- 报价时按小面积，开工后「实测补差」；应在合同锁定复测规则。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('ke-li-ban', 'ke-li-ban', '颗粒板（vs 实木芯）', '# 颗粒板（vs 实木芯）

## 是什么

实木颗粒板（刨花板）：木材打成颗粒后施胶热压成型，是定制柜最常用的基材。优点是平整度好、成本低、饰面选择多；短板是防潮与握钉力弱于多层实木。

## 和实木芯（实木多层）怎么选

| 维度 | 颗粒板 | 实木芯（多层实木） |
| --- | --- | --- |
| 防潮 | 一般 | 更好，适合厨卫附近 |
| 握钉力 | 一般 | 更好，铰链反复拆装更耐用 |
| 环保 | 看等级（ENF/E0/E1） | 同样看等级，胶量略少 |
| 价格 | 低 | 高（本案 15㎡ 定制 +3000 元） |

## 本示例中的结论

AEs 与 A5s 的定制基材差价一致：颗粒板 13000 / 实木芯 16000（15㎡ 内）。**同套餐内升实木芯只要 +3000，往往比整体升档到 A5s 更划算**——升档买的是门/防水/淋浴房等可选面，不是板材。

## 选购要点

认准板材环保等级证书（优先 ENF 级），封边工艺（激光封边更防潮），并在合同写明超出 15㎡ 后的增项单价。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('men-tao', 'men-tao', '门套', '# 门套

## 是什么

包覆门洞四周的框架与饰面板，由门套板、门套线（哑口线）组成。作用：固定门扇五金、保护墙角阳角、收口墙面与门洞的交接。没有门扇的洞口做的套叫「哑口套」。

## 材质与工艺

| 类型 | 特点 |
| --- | --- |
| 实木多层门套 | 握钉力好、不易变形，主流之选 |
| 密度板门套 | 便宜，怕潮，卫生间慎用 |
| 铝合金/金属门套 | 防潮，适合厨卫，与金属移门配套 |

## 报价里怎么看

- 套餐通常「木门含门套」，但**窗套、哑口套、垭口**常单算，属于易增项点。
- 本示例对比中：AEs 门套品牌池为升升概念/江山欧派/派的门；A5s 额外可选 **TATA**，是两档套餐的差异点之一。

## 验收要点

门套与墙体缝隙打胶均匀；套线 45° 拼角严密；卫生间门套底部离地或做防水垫，防止吸水发黑。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('qiang-dian', 'qiang-dian', '强电 / 弱电', '# 强电 / 弱电

## 是什么

- **强电**：220V 电力线路，负责照明、插座、空调等用电。核心材料是铜芯电线（常用 2.5/4/6 平方毫米）。
- **弱电**：36V 以下信号线路，网线、电视线、电话线、安防线等。

两者必须**分管敷设、保持间距**（一般 ≥30cm 或用锡箔屏蔽），否则强电会干扰弱电信号。

## 报价里怎么看

- 看电线品牌与是否国标足米：本案 AEs 用中大元通/东方电缆，A5s 可选**飞利浦**；弱电 AEs 为永鼎，A5s 可选飞利浦。
- 看计费方式：按点位还是按米，超出部分单价多少——水电是增项重灾区。
- 线管（伟星/日丰/公元）与底盒虽是辅材，阻燃等级同样重要。

## 验收要点

强弱电分色分管；线管转弯用弯管器不折死角；底盒预留检修余量；配电箱回路标注清楚；网线打线测速达标。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('ying-zhuang', 'ying-zhuang', '硬装', '# 硬装

## 是什么

固定在建筑结构上、搬家带不走的装修部分：水电改造、防水、瓦工（贴砖）、木工基层、油漆墙面、门窗套、吊顶等。与之相对的是**软装**（家具、窗帘、灯饰、饰品）。

## 硬装套餐一般包含

- 水电：强弱电布线、给排水（本案含伟星/日丰/公元管材，西门子开关）
- 防水：卫生间、阳台涂刷+闭水（东方雨虹；A5s 可选西卡）
- 瓦工：地砖墙砖铺贴（马可波罗/东鹏/欧神诺/蒙娜丽莎品牌池）
- 油漆：腻子基层+乳胶漆（东方雨虹 + 多乐士/嘉宝莉）
- 成品：木门、门套、踢脚线、集成吊顶、地漏等

## 一般不包含（增项高发区）

拆改、新风/地暖/中央空调、阳台封窗、全屋净水、现场木作造型、灯具洁具升级等。

## 看报价的正确姿势

硬装价 = 基础价 + 超面积费用；再叠加**工程管理费**（本案硬装 ×12%）与**项目经理费**（约 2%）才是实际支出。对比套餐时先把「含费口径」拉平。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();
insert into public.wiki_pages (slug, term_slug, title, body_md, status, source) values ('zeng-xiang', 'zeng-xiang', '增项', '# 增项

## 是什么

签约套餐范围之外、施工过程中另行收费的项目。装修纠纷与超预算的第一来源。

## 高发增项清单

| 类别 | 说明 |
| --- | --- |
| 拆改 | 套餐几乎都不含，按实结算 |
| 水电超量 | 点位/米数超出套餐包含量 |
| 定制超量 | 本案套餐含 15㎡，超出按单价另计 |
| 特殊基层 | 墙面空鼓铲除、找平层加厚 |
| 防水加高 | 上返高度超标准段 |
| 封窗/新风/地暖 | 套餐外系统性工程 |

## 控增项方法

1. 签约前逐条确认「不含项」清单并写入合同；
2. 要求给出常见增项**单价表**（如超面积 699/799 元/㎡、实木芯 +3000）；
3. 开工交底时对增项现场确认签字，拒绝口头报价；
4. 合同约定增项总额上限（如 ≤5%）。

## 本示例中的待确认项

淋浴房是否计入 AEs；管理费基数；15㎡ 定制不够时的增项单价；拆改/新风/地暖是否另计。', 'published', 'seed') on conflict (slug) do update set title = excluded.title, body_md = excluded.body_md, updated_at = now();

-- ===== brands =====
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('makeboluo', '马可波罗', array['Marco Polo', '马可波罗瓷砖']::text[], array['瓷砖']::text[], 'premium', '国产瓷砖一线品牌，仿古砖起家，产品线全、渠道广。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('dongpeng', '东鹏', array['东鹏瓷砖', 'DONGPENG']::text[], array['瓷砖']::text[], 'premium', '老牌国产一线瓷砖，性价比与稳定性口碑好。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('oushennuo', '欧神诺', array['Oceano']::text[], array['瓷砖']::text[], 'mainstream', '帝欧家居旗下瓷砖品牌，主流档，整装渠道常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('mengnalisha', '蒙娜丽莎', array['Monalisa', '蒙娜丽莎瓷砖']::text[], array['瓷砖']::text[], 'premium', '国产一线瓷砖，岩板/大板品类有优势。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('dongfang-yuhong', '东方雨虹', array['雨虹', 'YUHONG']::text[], array['防水', '腻子', '辅材']::text[], 'premium', '国内防水建材龙头，民用防水与腻子基层标配级品牌。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('xika', '西卡', array['Sika']::text[], array['防水', '辅材']::text[], 'luxury', '瑞士百年建筑化工品牌，防水/密封胶高端之选。', '瑞士', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('duoleshi', '多乐士', array['Dulux']::text[], array['乳胶漆']::text[], 'premium', '阿克苏诺贝尔旗下涂料品牌，家装乳胶漆一线主力。', '荷兰', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('jiabaoli', '嘉宝莉', array['Carpoly']::text[], array['乳胶漆']::text[], 'mainstream', '国产涂料头部品牌，主流档乳胶漆常见选择。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('tata', 'TATA', array['TATA木门', 'tata']::text[], array['木门']::text[], 'premium', '国内木门零售第一梯队，静音门体系出名；套餐里能选到 TATA 通常是加分项。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('shengsheng-gainian', '升升概念', '{}'::text[], array['木门']::text[], 'mainstream', '整装渠道常见木门品牌，主流档。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('jiangshan-oupai', '江山欧派', array['欧派门(江山)']::text[], array['木门']::text[], 'premium', '上市木门企业，工程与零售量大，注意与『欧派家居』不是一家。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('padi-men', '派的门', array['PADI']::text[], array['木门']::text[], 'mainstream', '圣象集团旗下木门品牌，简约风格，主流偏上。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('feilipu', '飞利浦', array['Philips']::text[], array['电线', '照明']::text[], 'premium', '国际品牌授权的家装电线，品牌溢价明显，品质稳定。', '荷兰', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('zhongda-yuantong', '中大元通', array['元通电缆']::text[], array['电线']::text[], 'mainstream', '浙江本地主流电缆品牌，杭州整装常用。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('dongfang-dianlan', '东方电缆', '{}'::text[], array['电线']::text[], 'mainstream', '上市电缆企业，家装线为民用产品线。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('yongding', '永鼎', array['永鼎线缆']::text[], array['电线', '弱电']::text[], 'mainstream', '江苏老牌线缆企业，弱电线常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('weixing', '伟星', array['伟星管', 'VASEN']::text[], array['水管', '辅材']::text[], 'premium', 'PPR 管零售龙头，服务体系（星管家）完善。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('rifeng', '日丰', array['RIFENG']::text[], array['水管', '辅材']::text[], 'premium', '管道大厂，PPR/铝塑管全线覆盖，一线档。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('gongyuan', '公元', array['ERA', '公元管道']::text[], array['水管', '辅材']::text[], 'mainstream', '上市管道企业，工程量大，主流档。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('ximenzi', '西门子', array['Siemens']::text[], array['开关插座']::text[], 'premium', '开关插座外资一线，睿致/致典系列家装常见。', '德国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('zhibang', '志邦', array['志邦家居', 'ZBOM']::text[], array['全屋定制', '橱柜']::text[], 'premium', '上市定制家居企业，橱柜起家，全屋定制一线梯队。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('jinpai', '金牌', array['金牌厨柜', '金牌主厨']::text[], array['全屋定制', '橱柜']::text[], 'premium', '上市橱柜品牌，厨房定制见长，全屋定制一线梯队。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('moganshan', '莫干山', array['莫干山板材']::text[], array['全屋定制', '板材', '地板']::text[], 'mainstream', '升华云峰旗下板材品牌，环保板材口碑好，定制/地板均有产品线。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('tubaobao', '兔宝宝', array['Tubao']::text[], array['全屋定制', '板材']::text[], 'mainstream', '板材上市公司，环保等级宣传力度大，定制基材常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('aopu', '奥普', array['AUPU']::text[], array['集成吊顶', '浴霸']::text[], 'premium', '浴霸/集成吊顶头部品牌，厨卫吊顶电器一线。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('meidi', '美的', array['Midea']::text[], array['集成吊顶', '厨电']::text[], 'premium', '家电巨头，吊顶电器/厨电产品线齐全。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('chuzhibao', '厨之宝', '{}'::text[], array['台面']::text[], 'mainstream', '石英石台面供应商，整装渠道常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('oubali', '欧铂利', '{}'::text[], array['台面']::text[], 'mainstream', '欧派体系台面品牌，石英石台面主流选择。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('oulin', '欧琳', array['OULIN']::text[], array['水槽', '龙头']::text[], 'premium', '水槽头部品牌，不锈钢水槽一线。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('nuodima', '诺帝玛', array['NUODIMA']::text[], array['水槽', '龙头']::text[], 'mainstream', '水槽/龙头主流品牌，整装套餐常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('kadi', '卡帝', '{}'::text[], array['金属移门']::text[], 'mainstream', '极窄边框金属移门品牌，厨卫移门常用。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('denuoke', '德诺克', array['德诺克(梵)']::text[], array['金属移门']::text[], 'mainstream', '金属移门/淋浴隔断品牌，整装渠道常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('deer', '德尔', array['Der', '德尔地板']::text[], array['地板']::text[], 'premium', '强化/复合地板一线品牌，环保锁扣技术起家。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('shuxiang-mendi', '书香门地', array['书香门第']::text[], array['地板']::text[], 'premium', '美学地板定位，实木复合见长，一线偏上。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('daziran', '大自然', array['Nature', '大自然地板']::text[], array['地板']::text[], 'premium', '地板一线品牌，实木/实木复合产品线全。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('qianshuiting', '潜水艇', array['Submarine']::text[], array['地漏', '五金']::text[], 'premium', '地漏品类代名词级品牌，防臭芯专利多。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('jiumu', '九牧', array['JOMOO']::text[], array['卫浴']::text[], 'premium', '国产卫浴龙头，龙头五金起家，智能马桶量大。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('jianpai', '箭牌', array['ARROW', '箭牌卫浴']::text[], array['卫浴']::text[], 'premium', '国产卫浴一线，陶瓷洁具见长。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('huida', '惠达', array['HUIDA']::text[], array['卫浴']::text[], 'mainstream', '老牌卫浴上市公司，主流档性价比选择。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('jianlin-zhijia', '建霖智家', array['建霖']::text[], array['淋浴房', '卫浴']::text[], 'mainstream', '上市卫浴代工大厂旗下品牌，淋浴房/五金整装渠道常见。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();
insert into public.brands (slug, name, aliases, categories, tier, one_liner, country, source, confidence) values ('shengdu', '圣都整装', array['圣都家装', '圣都']::text[], array['装修公司']::text[], 'premium', '杭州起家的整装公司，2021 年被贝壳收购；AEs/A5s 为其硬装全案套餐。', '中国', 'seed', 1) on conflict (slug) do update set name = excluded.name, aliases = excluded.aliases, categories = excluded.categories, tier = excluded.tier, one_liner = excluded.one_liner, updated_at = now();

-- ===== 公开示例房（未登录可浏览对比） =====
insert into public.houses (id, owner_id, name, city, layout, sales_area_sqm, billing_area_sqm, is_public_demo) values ('00000000-0000-4000-8000-00000000d001', null, '示例房 · 售卖90㎡ / 计价76.34㎡', '杭州', '两室两厅一卫', 90, 76.34, true) on conflict (id) do update set name = excluded.name, billing_area_sqm = excluded.billing_area_sqm;

-- demo proposal: AEs
insert into public.proposals (id, house_id, company, package_name, version, status, source, pricing, total_base, total_with_fees, notes) values ('00000000-0000-4000-8000-0000000000ae', '00000000-0000-4000-8000-00000000d001', '圣都整装', 'AEs', '2025-07 宣传页', 'confirmed', 'demo', '{"currency":"CNY","items":[{"key":"hard_base","label":"硬装基础价(50㎡档)","amount":65000,"note":"宣传页档位起步硬装价"},{"key":"over_area","label":"超面积费用","amount":18411.66,"note":"(76.34-50)㎡ × 699元/㎡"},{"key":"custom_particle","label":"定制-颗粒板(15㎡)","amount":13000,"note":"标配定制量；实木芯为 16000（+3000）"},{"key":"mgmt_fee","label":"工程管理费12%(硬装)","amount":10009.4,"note":"基数为硬装小计 83411.66，定制免收"},{"key":"pm_fee","label":"项目经理费2%(硬装估)","amount":1668.23,"note":"签约以合同为准"}],"total_base":96411.66,"total_with_fees":108089.29}'::jsonb, 96411.66, 108089.29, array['不含拆改、个性化设计、现场木作等，按实结算。', '管理费/项目经理费基数以合同为准。', '材料以展厅实物为准，品牌会调整。', '售卖面积 90㎡ ≠ 计价面积 76.34㎡，报价按计价面积。']::text[]) on conflict (id) do update set pricing = excluded.pricing, total_base = excluded.total_base, total_with_fees = excluded.total_with_fees, notes = excluded.notes;
delete from public.proposal_line_items where proposal_id = '00000000-0000-4000-8000-0000000000ae';
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 0, '客餐厅', '地砖+踢脚线', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['ti-jiao-xian', 'zhu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 1, '客餐厅', '腻子基层', array['东方雨虹']::text[], null, null, array['ni-zi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 2, '客餐厅', '乳胶漆', array['多乐士', '嘉宝莉']::text[], null, null, array['ru-jiao-qi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 3, '客餐厅', '入户/门套', array['升升概念', '江山欧派', '派的门']::text[], null, null, array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 4, '客餐厅', '窗台石', '{}'::text[], '天然石/人造石/岩板', null, array['chuang-tai-shi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 5, '客餐厅', '强电电线', array['中大元通', '东方电缆']::text[], null, null, array['qiang-dian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 6, '客餐厅', '弱电电线', array['永鼎']::text[], null, null, array['ruo-dian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 7, '客餐厅', '线管底盒', array['伟星', '日丰', '公元']::text[], null, null, array['xian-guan-di-he']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 8, '客餐厅', '开关插座', array['西门子']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 9, '客餐厅', '全屋定制品牌', array['志邦', '金牌', '莫干山', '兔宝宝']::text[], null, null, array['quan-wu-ding-zhi', 'ke-li-ban', 'shi-mu-xin']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 10, '厨房', '地砖墙砖', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['zhu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 11, '厨房', '集成吊顶+电器', array['奥普', '美的']::text[], null, null, array['ji-cheng-diao-ding']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 12, '厨房', '橱柜', array['金牌']::text[], '约3m地柜+1.5m吊柜', null, array['quan-wu-ding-zhi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 13, '厨房', '台面', array['厨之宝', '欧铂利']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 14, '厨房', '水槽+龙头', array['欧琳', '诺帝玛']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 15, '厨房', '金属移门', array['卡帝', '德诺克']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 16, '厨房', '门套', array['升升概念', '江山欧派', '派的门']::text[], null, null, array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 17, '卧室', '复合地板+踢脚线', array['德尔', '莫干山', '书香门地']::text[], null, null, array['ti-jiao-xian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 18, '卧室', '木开门+五金', array['升升概念', '派的门', '江山欧派']::text[], null, null, array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 19, '卧室', '腻子/乳胶漆', array['东方雨虹', '多乐士', '嘉宝莉']::text[], null, null, array['ni-zi', 'ru-jiao-qi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 20, '阳台', '地砖+踢脚线', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['ti-jiao-xian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 21, '阳台', '专业防水', array['东方雨虹']::text[], null, null, array['fang-shui']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 22, '阳台', '地漏', array['潜水艇']::text[], null, null, array['di-lou']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 23, '卫生间', '地砖墙砖', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['zhu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 24, '卫生间', '专业防水', array['东方雨虹']::text[], null, null, array['fang-shui']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 25, '卫生间', '集成吊顶+电器', array['奥普', '美的']::text[], null, null, array['ji-cheng-diao-ding']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 26, '卫生间', '浴室柜/龙头/马桶/花洒', array['九牧', '箭牌', '惠达']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 27, '卫生间', '淋浴房', '{}'::text[], null, '宣传页本段未明确单列', array['lin-yu-fang']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 28, '卫生间', '木门', array['升升概念', '江山欧派', '派的门']::text[], null, null, array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 29, '辅材', '给水管PPR', array['伟星', '日丰', '公元']::text[], null, null, array['ppr-gei-shui-guan', 'fu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 30, '辅材', '防水/腻子/石膏', array['东方雨虹']::text[], null, null, array['fang-shui', 'ni-zi', 'fu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 31, '其它工程', '垃圾袋/成品保护/竣工保洁', '{}'::text[], null, '含', array['cheng-pin-bao-hu', 'jun-gong-bao-jie']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000ae', 32, '售后', '服务承诺', '{}'::text[], null, '十诺 / 14815 / 隐蔽约5年', array['yin-bi-gong-cheng']::text[]);

-- demo proposal: A5s
insert into public.proposals (id, house_id, company, package_name, version, status, source, pricing, total_base, total_with_fees, notes) values ('00000000-0000-4000-8000-0000000000a5', '00000000-0000-4000-8000-00000000d001', '圣都整装', 'A5s', '2025-07 宣传页', 'confirmed', 'demo', '{"currency":"CNY","items":[{"key":"hard_base","label":"硬装基础价(50㎡档)","amount":75800,"note":"宣传页档位起步硬装价"},{"key":"over_area","label":"超面积费用","amount":21045.66,"note":"(76.34-50)㎡ × 799元/㎡"},{"key":"custom_particle","label":"定制-颗粒板(15㎡)","amount":13000,"note":"标配定制量；实木芯为 16000（+3000）"},{"key":"mgmt_fee","label":"工程管理费12%(硬装)","amount":11621.48,"note":"基数为硬装小计 96845.66，定制免收"},{"key":"pm_fee","label":"项目经理费2%(硬装估)","amount":1936.91,"note":"签约以合同为准"}],"total_base":109845.66,"total_with_fees":123404.05}'::jsonb, 109845.66, 123404.05, array['不含拆改、个性化设计、现场木作等，按实结算。', '管理费/项目经理费基数以合同为准。', '材料以展厅实物为准，品牌会调整。', '售卖面积 90㎡ ≠ 计价面积 76.34㎡，报价按计价面积。']::text[]) on conflict (id) do update set pricing = excluded.pricing, total_base = excluded.total_base, total_with_fees = excluded.total_with_fees, notes = excluded.notes;
delete from public.proposal_line_items where proposal_id = '00000000-0000-4000-8000-0000000000a5';
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 0, '客餐厅', '地砖+踢脚线', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['ti-jiao-xian', 'zhu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 1, '客餐厅', '腻子基层', array['东方雨虹']::text[], null, null, array['ni-zi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 2, '客餐厅', '乳胶漆', array['多乐士', '嘉宝莉']::text[], null, null, array['ru-jiao-qi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 3, '客餐厅', '入户/门套', array['TATA', '升升概念', '江山欧派', '派的门']::text[], null, '可选TATA', array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 4, '客餐厅', '窗台石', '{}'::text[], '天然石/人造石/岩板', null, array['chuang-tai-shi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 5, '客餐厅', '强电电线', array['飞利浦', '中大元通', '东方电缆']::text[], null, '可选飞利浦', array['qiang-dian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 6, '客餐厅', '弱电电线', array['飞利浦', '永鼎']::text[], null, null, array['ruo-dian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 7, '客餐厅', '线管底盒', array['伟星', '日丰', '公元']::text[], null, null, array['xian-guan-di-he']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 8, '客餐厅', '开关插座', array['西门子']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 9, '客餐厅', '全屋定制品牌', array['志邦', '金牌', '莫干山', '兔宝宝']::text[], null, null, array['quan-wu-ding-zhi', 'ke-li-ban', 'shi-mu-xin']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 10, '厨房', '地砖墙砖', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['zhu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 11, '厨房', '集成吊顶+电器', array['奥普', '美的']::text[], null, null, array['ji-cheng-diao-ding']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 12, '厨房', '橱柜', array['志邦', '金牌', '莫干山', '兔宝宝']::text[], null, '品牌可选更多', array['quan-wu-ding-zhi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 13, '厨房', '台面', array['厨之宝', '欧铂利']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 14, '厨房', '水槽+龙头', array['欧琳', '诺帝玛']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 15, '厨房', '金属移门', array['卡帝', '德诺克']::text[], null, '德诺克(梵)', '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 16, '厨房', '门套', array['TATA', '升升概念', '江山欧派', '派的门']::text[], null, null, array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 17, '卧室', '复合地板+踢脚线', array['德尔', '莫干山', '书香门地', '大自然']::text[], null, '多大自然可选', array['ti-jiao-xian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 18, '卧室', '木开门+五金', array['TATA', '升升概念', '江山欧派', '派的门']::text[], null, '可选TATA', array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 19, '卧室', '腻子/乳胶漆', array['东方雨虹', '多乐士', '嘉宝莉']::text[], null, null, array['ni-zi', 'ru-jiao-qi']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 20, '阳台', '地砖+踢脚线', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['ti-jiao-xian']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 21, '阳台', '专业防水', array['西卡', '东方雨虹']::text[], null, '可选西卡', array['fang-shui']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 22, '阳台', '地漏', array['潜水艇']::text[], null, null, array['di-lou']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 23, '卫生间', '地砖墙砖', array['马可波罗', '东鹏', '欧神诺', '蒙娜丽莎']::text[], null, null, array['zhu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 24, '卫生间', '专业防水', array['西卡', '东方雨虹']::text[], null, '可选西卡', array['fang-shui']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 25, '卫生间', '集成吊顶+电器', array['奥普', '美的']::text[], null, null, array['ji-cheng-diao-ding']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 26, '卫生间', '浴室柜/龙头/马桶/花洒', array['九牧', '箭牌', '惠达']::text[], null, null, '{}'::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 27, '卫生间', '淋浴房', array['建霖智家']::text[], '约≤3.6㎡', '明确含淋浴房', array['lin-yu-fang']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 28, '卫生间', '木门', array['TATA', '升升概念', '江山欧派', '派的门']::text[], null, '同卧室门品牌池', array['men-tao']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 29, '辅材', '给水管PPR', array['伟星', '日丰', '公元']::text[], null, null, array['ppr-gei-shui-guan', 'fu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 30, '辅材', '防水/腻子/石膏', array['东方雨虹']::text[], null, null, array['fang-shui', 'ni-zi', 'fu-cai']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 31, '其它工程', '垃圾袋/成品保护/竣工保洁', '{}'::text[], null, '含', array['cheng-pin-bao-hu', 'jun-gong-bao-jie']::text[]);
insert into public.proposal_line_items (proposal_id, position, space, category, brand_names, spec, note, term_slugs) values ('00000000-0000-4000-8000-0000000000a5', 32, '售后', '服务承诺', '{}'::text[], null, '同体系服务承诺', array['yin-bi-gong-cheng']::text[]);
