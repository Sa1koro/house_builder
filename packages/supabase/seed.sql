-- Seed: public knowledge + demo house (AEs vs A5s @ 76.34㎡)
-- Run after 20250727000001_init.sql via Supabase SQL editor or CLI

-- Terms
insert into public.terms (slug, title, definition, category, aliases, source) values
  ('pricing-area', '计价面积', '装修公司用于报价的面积，通常不等于房产证或售卖面积，需按合同约定的折算规则计算。', '报价', array['报价面积','结算面积'], 'seed'),
  ('door-frame', '门套', '门框外侧的装饰套线，用于收口墙面与门洞，材质多为密度板或实木复合。', '硬装', '{}', 'seed'),
  ('strong-electric', '强电', '220V 家用动力与照明线路，含电线、线管、底盒、配电箱等。', '水电', '{}', 'seed'),
  ('weak-electric', '弱电', '网络、电话、有线电视、安防等低电压线路，需与强电分管分槽。', '水电', '{}', 'seed'),
  ('management-fee', '工程管理费', '装修公司按硬装造价比例收取的管理费用，圣都宣传页常见为硬装造价的 12%。', '报价', '{}', 'seed'),
  ('project-manager-fee', '项目经理费', '按工程造价比例支付给现场项目经理的费用，宣传页常见约硬装造价的 2%。', '报价', '{}', 'seed'),
  ('custom-board-particle', '颗粒板定制', '全屋定制柜体常用基材，性价比高，套餐标配 15㎡ 内。', '定制', '{}', 'seed'),
  ('custom-board-solid', '实木芯定制', '柜体采用实木芯材，相对颗粒板环保与质感更好，同套餐内通常加价约 3000 元。', '定制', '{}', 'seed'),
  ('shower-enclosure', '淋浴房', '卫生间干湿分离的玻璃隔断，套餐是否含淋浴房及面积上限需签约前确认。', '卫浴', '{}', 'seed'),
  ('waterproof', '专业防水', '阳台、卫生间等湿区地面及墙面的防水涂刷，常见品牌东方雨虹、西卡。', '硬装', '{}', 'seed'),
  ('tile', '地砖墙砖', '客餐厅、厨房、卫生间等区域的瓷砖铺贴。', '硬装', '{}', 'seed'),
  ('putty', '腻子基层', '墙面找平与批刮腻子，为乳胶漆打底。', '硬装', '{}', 'seed'),
  ('latex-paint', '乳胶漆', '墙面顶面饰面涂料。', '硬装', '{}', 'seed'),
  ('switch-socket', '开关插座', '墙面电工面板。', '水电', '{}', 'seed'),
  ('cabinet', '橱柜', '厨房地柜+吊柜+台面系统。', '定制', '{}', 'seed'),
  ('laminate-floor', '复合地板', '卧室常用地面材料，含踢脚线。', '硬装', '{}', 'seed'),
  ('bathroom-suite', '卫浴套装', '浴室柜、龙头、马桶、花洒等组合。', '卫浴', '{}', 'seed'),
  ('area-tier-50-80', '50–80㎡ 计价档', '圣都宣传页：50≤计价面积<80 时，AEs 超面积 +699/㎡，A5s +799/㎡。', '报价', '{}', 'seed'),
  ('hard-base-price', '硬装基础价', '套餐起步硬装造价，AEs 50㎡档 65000，A5s 50㎡档 75800。', '报价', '{}', 'seed'),
  ('full-package-base', '全案基础价', '硬装小计 + 标配定制（15㎡），不含管理费。', '报价', '{}', 'seed')
on conflict (slug) do nothing;

-- Brands
insert into public.brands (slug, name, categories, tier, aliases, summary, source) values
  ('tata', 'TATA木门', array['木门','门套'], 'first_tier', array['TATA'], '国内一线木门品牌，A5s 套餐可选。', 'seed'),
  ('sika', '西卡', array['防水','辅材'], 'first_tier', array['西卡防水'], '瑞士西卡防水系统，A5s 可选。', 'seed'),
  ('philips', '飞利浦', array['电线','弱电'], 'first_tier', '{}', '飞利浦电工，A5s 强弱电可选。', 'seed'),
  ('marco-polo', '马可波罗', array['瓷砖'], 'first_tier', '{}', '瓷砖一线品牌。', 'seed'),
  ('dongpeng', '东鹏瓷砖', array['瓷砖'], 'first_tier', '{}', '瓷砖一线品牌。', 'seed'),
  ('dulux', '多乐士', array['乳胶漆'], 'first_tier', '{}', '阿克苏诺贝尔涂料品牌。', 'seed'),
  ('yuhong', '东方雨虹', array['防水','腻子'], 'first_tier', '{}', '国内防水龙头。', 'seed'),
  ('siemens', '西门子', array['开关插座'], 'first_tier', array['西门子开关'], '德系电工品牌。', 'seed'),
  ('jomoo', '九牧', array['卫浴'], 'mainstream', '{}', '国产卫浴主流品牌。', 'seed'),
  ('arrow', '箭牌', array['卫浴'], 'mainstream', '{}', '卫浴陶瓷主流品牌。', 'seed'),
  ('huida', '惠达', array['卫浴'], 'mainstream', '{}', '卫浴陶瓷老牌。', 'seed'),
  ('del-floor', '德尔地板', array['地板'], 'mainstream', array['德尔'], '复合地板主流品牌。', 'seed'),
  ('nature-floor', '大自然', array['地板'], 'first_tier', '{}', '地板一线品牌，A5s 可选。', 'seed'),
  ('oppein', '志邦家居', array['橱柜','全屋定制'], 'mainstream', array['志邦'], '定制主流品牌。', 'seed'),
  ('goldenhome', '金牌橱柜', array['橱柜'], 'mainstream', array['金牌'], '橱柜主流品牌。', 'seed'),
  ('aupu', '奥普', array['集成吊顶'], 'mainstream', '{}', '集成吊顶常见品牌。', 'seed'),
  ('submarine', '潜水艇', array['地漏','五金'], 'mainstream', array['潜水艇地漏'], '地漏五金常见品牌。', 'seed'),
  ('weixing', '伟星管业', array['水管','线管'], 'mainstream', array['伟星'], 'PPR 水管主流。', 'seed'),
  ('rifeng', '日丰', array['水管','线管'], 'mainstream', '{}', 'PPR 水管主流。', 'seed'),
  ('jilian-zhijia', '建霖智家', array['淋浴房'], 'mainstream', '{}', '淋浴房品牌，A5s 含。', 'seed')
on conflict (slug) do nothing;

-- Wiki pages
insert into public.wiki_pages (slug, title, content, term_slug, brand_slug, source) values
  ('pricing-area-guide', '计价面积怎么算？', '计价面积是装修公司报价用的面积，不等于房产证建筑面积。圣都示例：售卖 90㎡，计价 76.34㎡。', 'pricing-area', null, 'seed'),
  ('aes-vs-a5s-summary', 'AEs vs A5s 怎么选', '预算优先选 AEs（76.34㎡ 含费约 108,089）；品牌细节优先选 A5s（约 123,404）。A5s 多 TATA 门、西卡防水、淋浴房。', null, null, 'seed'),
  ('tata-brand', 'TATA 木门', 'TATA 为国内一线木门品牌，A5s 套餐门套与卧室门可选。', null, 'tata', 'seed'),
  ('sika-brand', '西卡防水', '西卡为瑞士建筑化学品品牌，A5s 湿区防水可选。', null, 'sika', 'seed')
on conflict (slug) do nothing;

-- Demo house (fixed UUID for stable links)
insert into public.houses (id, owner_id, name, city, sales_area_sqm, pricing_area_sqm, layout, is_public_demo)
values (
  '00000000-0000-4000-8000-000000000001',
  null,
  '示例 90㎡ 三房（圣都 AEs vs A5s）',
  '示例城市',
  90,
  76.34,
  '三房一卫',
  true
) on conflict (id) do nothing;

-- Demo proposals
insert into public.proposals (id, house_id, company, package_name, version, pricing, notes) values
(
  '00000000-0000-4000-8000-000000000010',
  '00000000-0000-4000-8000-000000000001',
  '圣都整装', 'AEs', '2025-宣传页',
  '{"hardBase":65000,"areaOverage":{"areaSqm":26.34,"unitPrice":699,"amount":18411.66},"customBoard":{"particle":13000,"solidWood":16000},"managementFee":10009.4,"projectManagerFee":1668.23,"totals":{"baseParticle":96411.66,"baseSolidWood":99411.66,"withFeesParticle":108089.29,"withFeesSolidWood":111089.29}}'::jsonb,
  '["50≤计价面积<80 档","含15㎡全屋定制"]'::jsonb
),
(
  '00000000-0000-4000-8000-000000000011',
  '00000000-0000-4000-8000-000000000001',
  '圣都整装', 'A5s', '2025-宣传页',
  '{"hardBase":75800,"areaOverage":{"areaSqm":26.34,"unitPrice":799,"amount":21045.66},"customBoard":{"particle":13000,"solidWood":16000},"managementFee":11621.48,"projectManagerFee":1936.91,"totals":{"baseParticle":109845.66,"baseSolidWood":112845.66,"withFeesParticle":123404.05,"withFeesSolidWood":126404.05}}'::jsonb,
  '["相对AEs含费贵约15314.76元"]'::jsonb
) on conflict (id) do nothing;

-- Demo line items (subset — full list in houses/demo-90sqm/proposals.json)
insert into public.proposal_line_items (proposal_id, space, category, brands, term_slugs, notes, sort_order) values
  ('00000000-0000-4000-8000-000000000010', '客餐厅', '入户/门套', '升升概念/江山欧派/派的门', array['door-frame'], null, 1),
  ('00000000-0000-4000-8000-000000000010', '客餐厅', '强电电线', '中大元通/东方电缆', array['strong-electric'], null, 2),
  ('00000000-0000-4000-8000-000000000010', '卫生间', '淋浴房', '宣传页本段未明确单列', array['shower-enclosure'], '待门店确认', 3),
  ('00000000-0000-4000-8000-000000000011', '客餐厅', '入户/门套', 'TATA/升升概念/江山欧派/派的门', array['door-frame'], 'A5s优势：可选TATA', 1),
  ('00000000-0000-4000-8000-000000000011', '客餐厅', '强电电线', '飞利浦/中大元通/东方电缆', array['strong-electric'], 'A5s优势：可选飞利浦', 2),
  ('00000000-0000-4000-8000-000000000011', '阳台', '专业防水', '西卡/东方雨虹', array['waterproof'], 'A5s优势：可选西卡', 3),
  ('00000000-0000-4000-8000-000000000011', '卫生间', '淋浴房', '建霖智家/37°C2（约≤3.6㎡）', array['shower-enclosure'], 'A5s优势：明确含淋浴房', 4)
on conflict do nothing;
