-- Seed brands + terms + wiki pages (20–40 covering compare vocabulary)

insert into public.brands (slug, name, aliases, categories, tier, summary, source, confidence) values
  ('tata', 'TATA木门', array['TATA','tata'], array['木门','门套'], 'first_line', '国内知名木门品牌，常见于中高端整装升级选项。', 'seed', 0.95),
  ('sika', '西卡', array['西卡','Sika','SIKA'], array['防水'], 'premium', '国际建材化工品牌，防水材料口碑较好，常见于升级选项。', 'seed', 0.95),
  ('philips', '飞利浦', array['飞利浦','Philips'], array['电线','强电','弱电'], 'first_line', '国际电器品牌，整装方案中偶作电线升级选项。', 'seed', 0.9),
  ('daziran', '大自然', array['大自然'], array['地板'], 'first_line', '国内知名地板品牌，A5s 卧室地板可选池中较 AEs 多出。', 'seed', 0.9),
  ('dongfang-yuhong', '东方雨虹', array['东方雨虹','雨虹'], array['防水','腻子'], 'first_line', '国内防水与建材龙头，整装标配常见。', 'seed', 0.95),
  ('dulux', '多乐士', array['多乐士','Dulux'], array['乳胶漆'], 'first_line', '国际涂料品牌，乳胶漆主流选择。', 'seed', 0.95),
  ('carpoly', '嘉宝莉', array['嘉宝莉'], array['乳胶漆'], 'mainstream', '国内涂料品牌，常与多乐士并列可选。', 'seed', 0.9),
  ('marcopolo', '马可波罗', array['马可波罗'], array['瓷砖'], 'first_line', '瓷砖主流品牌。', 'seed', 0.9),
  ('dongpeng', '东鹏', array['东鹏'], array['瓷砖'], 'first_line', '瓷砖主流品牌。', 'seed', 0.9),
  ('oceano', '欧神诺', array['欧神诺'], array['瓷砖'], 'mainstream', '瓷砖品牌，整装可选池常见。', 'seed', 0.85),
  ('monalisa', '蒙娜丽莎', array['蒙娜丽莎'], array['瓷砖'], 'first_line', '瓷砖品牌。', 'seed', 0.9),
  ('zhibang', '志邦', array['志邦'], array['全屋定制','橱柜'], 'first_line', '定制家居一线品牌。', 'seed', 0.9),
  ('goldmedal', '金牌', array['金牌厨柜','金牌'], array['全屋定制','橱柜'], 'first_line', '定制家居一线品牌；AEs 厨房橱柜默认金牌。', 'seed', 0.9),
  ('moganshan', '莫干山', array['莫干山'], array['全屋定制','地板'], 'mainstream', '板材/定制常见品牌。', 'seed', 0.85),
  ('tubao', '兔宝宝', array['兔宝宝'], array['全屋定制'], 'mainstream', '板材品牌，定制可选。', 'seed', 0.85),
  ('der', '德尔', array['德尔'], array['地板'], 'mainstream', '复合地板常见品牌。', 'seed', 0.85),
  ('sxmd', '书香门地', array['书香门地'], array['地板'], 'first_line', '地板品牌，偏中高端。', 'seed', 0.85),
  ('jiumu', '九牧', array['九牧'], array['卫浴'], 'first_line', '卫浴五金主流品牌。', 'seed', 0.9),
  ('arrow', '箭牌', array['箭牌'], array['卫浴'], 'mainstream', '卫浴品牌。', 'seed', 0.9),
  ('huida', '惠达', array['惠达'], array['卫浴'], 'mainstream', '卫浴品牌。', 'seed', 0.85),
  ('siemens', '西门子', array['西门子','Siemens'], array['开关插座'], 'first_line', '开关插座一线品牌。', 'seed', 0.95),
  ('weixing', '伟星', array['伟星'], array['管材'], 'first_line', 'PPR 给水管主流品牌。', 'seed', 0.9),
  ('rifeng', '日丰', array['日丰'], array['管材'], 'first_line', '管材主流品牌。', 'seed', 0.9),
  ('gongyuan', '公元', array['公元'], array['管材'], 'mainstream', '管材品牌。', 'seed', 0.85),
  ('shengsheng', '升升概念', array['升升概念'], array['木门','门套'], 'mainstream', '木门/门套可选品牌。', 'seed', 0.8),
  ('oppein-door', '江山欧派', array['江山欧派','欧派木门'], array['木门','门套'], 'mainstream', '木门品牌。', 'seed', 0.8),
  ('paidemen', '派的门', array['派的门'], array['木门','门套'], 'mainstream', '木门品牌。', 'seed', 0.8),
  ('aupu', '奥普', array['奥普'], array['集成吊顶'], 'first_line', '集成吊顶/浴霸常见品牌。', 'seed', 0.9),
  ('midea', '美的', array['美的'], array['集成吊顶','电器'], 'first_line', '家电品牌，吊顶电器可选。', 'seed', 0.9),
  ('submarine', '潜水艇', array['潜水艇'], array['地漏'], 'first_line', '地漏主流品牌。', 'seed', 0.9),
  ('jianlin', '建霖智家', array['建霖智家','建霖'], array['淋浴房'], 'mainstream', 'A5s 明确含淋浴房品牌选项之一。', 'seed', 0.8),
  ('olin', '欧琳', array['欧琳'], array['水槽'], 'mainstream', '厨房水槽品牌。', 'seed', 0.85)
on conflict (slug) do update set
  summary = excluded.summary,
  tier = excluded.tier,
  categories = excluded.categories,
  updated_at = now();

insert into public.terms (slug, name, aliases, summary, category, source, confidence, wiki_slug) values
  ('billing-area', '计价面积', array['计价面积','计费面积'], '装修公司按此面积报价，通常小于房产商售卖面积；报价一律看计价面积。', '计价', 'seed', 1.0, 'billing-area'),
  ('sales-area', '售卖面积', array['售卖面积','建筑面积'], '房产商对外销售的面积口径，可能含公摊；不等于装修计价面积。', '计价', 'seed', 1.0, 'sales-area'),
  ('door-casing', '门套', array['门套','门框套'], '门洞四周的收口装饰结构，含侧板与线条，品牌常与木门绑定。', '木作', 'seed', 1.0, 'door-casing'),
  ('power-wiring', '强电', array['强电','强电电线'], '照明与插座等市电回路用电线，强调载流与安全认证。', '水电', 'seed', 1.0, 'power-wiring'),
  ('weak-current', '弱电', array['弱电','弱电电线'], '网线、电视、对讲等低电压信号线路。', '水电', 'seed', 1.0, 'weak-current'),
  ('mgmt-fee', '工程管理费', array['工程管理费','管理费'], '常见按硬装费用一定比例收取；多数方案定制部分免收。', '费用', 'seed', 1.0, 'mgmt-fee'),
  ('pm-fee', '项目经理费', array['项目经理跟踪服务费','项目经理费'], '项目管理跟踪服务费用，宣传页常按硬装约 2% 估算，签约以合同为准。', '费用', 'seed', 1.0, 'pm-fee'),
  ('particle-board', '颗粒板', array['颗粒板','刨花板'], '定制柜常见基材，性价比高；同档内通常比实木芯便宜。', '定制', 'seed', 1.0, 'particle-board'),
  ('solid-core', '实木芯', array['实木芯','实木颗粒板'], '定制柜升级基材，同产品内相对颗粒板约 +3000（15㎡标配量内）。', '定制', 'seed', 1.0, 'solid-core'),
  ('shower-enclosure', '淋浴房', array['淋浴房','淋浴隔断'], '卫浴干湿分离构件；A5s 宣传页明确含，AEs 是否计入需向门店确认。', '卫浴', 'seed', 1.0, 'shower-enclosure'),
  ('custom-cabinetry', '全屋定制', array['全屋定制','定制柜'], '橱柜、衣柜等工厂定制柜体，常按㎡计价并含标配量。', '定制', 'seed', 1.0, 'custom-cabinetry'),
  ('hard-fitout', '硬装', array['硬装','硬装基础价'], '墙顶地水电等基础装修部分，通常是管理费计算基数。', '费用', 'seed', 1.0, 'hard-fitout'),
  ('concealed-works', '隐蔽工程', array['隐蔽工程'], '水电、防水等完工后被覆盖的工程，质保年限通常更长。', '售后', 'seed', 1.0, 'concealed-works'),
  ('overage-fee', '超面积费用', array['超面积','超面积单价'], '计价面积超出档位起步面积时，按超出㎡×单价加收。', '费用', 'seed', 1.0, 'overage-fee'),
  ('base-package-price', '全案基础价', array['全案基础价'], '硬装小计 + 定制（通常不含管理费/项目经理费）。', '费用', 'seed', 1.0, 'base-package-price'),
  ('skirting', '踢脚线', array['踢脚线'], '墙地交接处的收口线条，常与地砖/地板配套。', '木作', 'seed', 0.95, 'skirting'),
  ('putty-base', '腻子基层', array['腻子','腻子基层'], '墙面找平基层，影响漆面平整度。', '墙面', 'seed', 0.95, 'putty-base'),
  ('integrated-ceiling', '集成吊顶', array['集成吊顶'], '厨房/卫生间常见模块化吊顶，可集成照明与换气。', '吊顶', 'seed', 0.95, 'integrated-ceiling'),
  ('waterproofing', '专业防水', array['防水','专业防水'], '厨卫阳台等潮湿区域的防水层施工与材料。', '防水', 'seed', 1.0, 'waterproofing'),
  ('ppr-pipe', '给水管PPR', array['PPR','给水管'], '冷热水给水常用塑料管材体系。', '水电', 'seed', 0.95, 'ppr-pipe')
on conflict (slug) do update set
  summary = excluded.summary,
  wiki_slug = excluded.wiki_slug,
  updated_at = now();

insert into public.wiki_pages (slug, title, body_md, term_slug, brand_slug, source, is_public) values
  ('billing-area', '计价面积', $md$
# 计价面积

装修公司报价所用的面积口径，**通常小于**房产商的售卖面积。

## 为什么重要

- 一房一价、超面积费用都按计价面积算
- 售卖面积 90㎡、计价面积 76.34㎡ 时，报价看 **76.34**

## 相关

- [售卖面积](/wiki/sales-area)
- [超面积费用](/wiki/overage-fee)
$md$, 'billing-area', null, 'seed', true),
  ('sales-area', '售卖面积', $md$
# 售卖面积

房产商对外销售的面积，可能含公摊或阳台折算规则，**不等于**装修计价面积。
$md$, 'sales-area', null, 'seed', true),
  ('door-casing', '门套', $md$
# 门套

门洞四周的收口结构。品牌池常与木门绑定；A5s 相对 AEs 多出 **TATA** 可选。
$md$, 'door-casing', null, 'seed', true),
  ('power-wiring', '强电', $md$
# 强电

照明与插座回路。A5s 可选 **飞利浦**，AEs 以中大元通/东方电缆为主。
$md$, 'power-wiring', null, 'seed', true),
  ('weak-current', '弱电', $md$
# 弱电

网络、电视等信号线。A5s 可选飞利浦/永鼎。
$md$, 'weak-current', null, 'seed', true),
  ('mgmt-fee', '工程管理费', $md$
# 工程管理费

宣传页常见：**仅硬装收取 12%，定制免收**。签约以合同基数为准。
$md$, 'mgmt-fee', null, 'seed', true),
  ('pm-fee', '项目经理费', $md$
# 项目经理跟踪服务费

估算口径常为硬装 × 2%。正式报价请向门店确认。
$md$, 'pm-fee', null, 'seed', true),
  ('particle-board', '颗粒板', $md$
# 颗粒板

定制柜高性价比基材。同套餐内升级实木芯通常约 +3000 元（15㎡标配）。
$md$, 'particle-board', null, 'seed', true),
  ('solid-core', '实木芯', $md$
# 实木芯

定制柜升级基材。相对颗粒板价差通常远小于整档升到更高套餐。
$md$, 'solid-core', null, 'seed', true),
  ('shower-enclosure', '淋浴房', $md$
# 淋浴房

A5s 宣传页明确含（如建霖智家等，约 ≤3.6㎡）；AEs 是否计入需门店确认。
$md$, 'shower-enclosure', null, 'seed', true),
  ('custom-cabinetry', '全屋定制', $md$
# 全屋定制

工厂定制柜体，常含标配㎡；超出按增项单价。
$md$, 'custom-cabinetry', null, 'seed', true),
  ('hard-fitout', '硬装', $md$
# 硬装

墙顶地水电等基础部分，管理费通常以此为基数。
$md$, 'hard-fitout', null, 'seed', true),
  ('concealed-works', '隐蔽工程', $md$
# 隐蔽工程

水电防水等被覆盖工程，质保往往更长（宣传页约水电防水 5 年）。
$md$, 'concealed-works', null, 'seed', true),
  ('overage-fee', '超面积费用', $md$
# 超面积费用

超出档位起步面积后：超出㎡ × 超面积单价。AEs 在 50≤S<80 档为 699 元/㎡，A5s 为 799 元/㎡。
$md$, 'overage-fee', null, 'seed', true),
  ('base-package-price', '全案基础价', $md$
# 全案基础价

硬装小计 + 定制，**通常不含**管理费与项目经理费。
$md$, 'base-package-price', null, 'seed', true),
  ('skirting', '踢脚线', $md$
# 踢脚线

墙地收口线条，常与地材品牌配套。
$md$, 'skirting', null, 'seed', true),
  ('putty-base', '腻子基层', $md$
# 腻子基层

墙面找平，影响乳胶漆观感。
$md$, 'putty-base', null, 'seed', true),
  ('integrated-ceiling', '集成吊顶', $md$
# 集成吊顶

厨卫模块化吊顶，可带照明/换气电器。
$md$, 'integrated-ceiling', null, 'seed', true),
  ('waterproofing', '专业防水', $md$
# 专业防水

潮湿区关键工序。A5s 可升级 **西卡**，两侧均可选东方雨虹。
$md$, 'waterproofing', null, 'seed', true),
  ('ppr-pipe', '给水管PPR', $md$
# 给水管 PPR

冷热水常用管材；伟星/日丰/公元等为常见可选池。
$md$, 'ppr-pipe', null, 'seed', true),
  ('brand-tata', 'TATA 木门', $md$
# TATA 木门

一线木门品牌。在本 Demo 中属于 **A5s 相对 AEs 的升级选项**。
$md$, null, 'tata', 'seed', true),
  ('brand-sika', '西卡防水', $md$
# 西卡

国际防水材料品牌，A5s 阳台/卫浴可选升级。
$md$, null, 'sika', 'seed', true)
on conflict (slug) do update set
  body_md = excluded.body_md,
  title = excluded.title,
  updated_at = now();
