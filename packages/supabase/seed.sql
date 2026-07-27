-- Public acquisition demo: 90㎡ sale area / 76.34㎡ pricing area.
insert into public.houses (id, owner_id, name, city, layout, sale_area, pricing_area, is_public_demo)
values ('00000000-0000-4000-8000-000000000001', null, '90㎡ 三居装修方案 Demo', '杭州', '三室两厅', 90, 76.34, true)
on conflict (id) do update set name = excluded.name;

insert into public.proposals (id, house_id, company, package_name, version, costs, status)
values
  (
    '00000000-0000-4000-8000-000000000011',
    '00000000-0000-4000-8000-000000000001',
    '圣都整装', 'AEs', '宣传页 2026',
    '{"hardFit":83413.66,"customization":13000,"management":10009.64,"projectManager":1668.27,"total":108091.57}',
    'confirmed'
  ),
  (
    '00000000-0000-4000-8000-000000000012',
    '00000000-0000-4000-8000-000000000001',
    '圣都整装', 'A5s', '宣传页 2026',
    '{"hardFit":96846.66,"customization":13000,"management":11621.60,"projectManager":1936.93,"total":123405.19}',
    'confirmed'
  )
on conflict (id) do update set costs = excluded.costs;

with configs(sort_order, space, category, aes, a5s, term_slugs, note) as (
  values
    (1,'客餐厅','地砖+踢脚线','马可波罗/东鹏/欧神诺/蒙娜丽莎','马可波罗/东鹏/欧神诺/蒙娜丽莎',array['踢脚线'],'相同'),
    (2,'客餐厅','腻子基层','东方雨虹','东方雨虹',array['腻子'],'相同'),
    (3,'客餐厅','乳胶漆','多乐士/嘉宝莉','多乐士/嘉宝莉',array['乳胶漆'],'相同'),
    (4,'客餐厅','入户/门套','升升概念/江山欧派/派的门','TATA/升升概念/江山欧派/派的门',array['门套'],'A5s 可选 TATA'),
    (5,'客餐厅','窗台石','天然石/人造石/岩板','天然石/人造石/岩板',array['岩板'],'相同'),
    (6,'客餐厅','强电电线','中大元通/东方电缆','飞利浦/中大元通/东方电缆',array['强电'],'A5s 可选飞利浦'),
    (7,'客餐厅','弱电电线','永鼎','飞利浦/永鼎',array['弱电'],'A5s 可选飞利浦'),
    (8,'客餐厅','线管底盒','伟星/日丰/公元','伟星/日丰/公元',array['线管底盒'],'相同'),
    (9,'客餐厅','开关插座','西门子','西门子',array['强电'],'相同'),
    (10,'客餐厅','全屋定制品牌','志邦/金牌/莫干山/兔宝宝','志邦/金牌/莫干山/兔宝宝',array['全屋定制'],'相同'),
    (11,'厨房','地砖墙砖','马可波罗/东鹏/欧神诺/蒙娜丽莎','马可波罗/东鹏/欧神诺/蒙娜丽莎',array['墙砖'],'相同'),
    (12,'厨房','集成吊顶+电器','奥普/美的','奥普/美的',array['集成吊顶'],'相同'),
    (13,'厨房','橱柜','金牌（约3m地柜+1.5m吊柜）','志邦/金牌/莫干山/兔宝宝',array['地柜','吊柜'],'A5s 品牌可选更多'),
    (14,'厨房','台面','厨之宝/欧铂利','厨之宝/欧铂利',array['台面'],'相同'),
    (15,'厨房','水槽+龙头','欧琳/诺帝玛','欧琳/诺帝玛',array['龙头'],'相同'),
    (16,'厨房','金属移门','卡帝/德诺克','卡帝/德诺克(梵)',array['移门'],'基本相同'),
    (17,'厨房','门套','升升概念/江山欧派/派的门','TATA/升升概念/江山欧派/派的门',array['门套'],'A5s 可选 TATA'),
    (18,'卧室','复合地板+踢脚线','德尔/莫干山/书香门地','德尔/莫干山/书香门地/大自然',array['复合地板','踢脚线'],'A5s 多大自然'),
    (19,'卧室','木开门+五金','升升概念/派的门/江山欧派','TATA/升升概念/江山欧派/派的门',array['五金'],'A5s 可选 TATA'),
    (20,'卧室','腻子/乳胶漆','东方雨虹 + 多乐士/嘉宝莉','东方雨虹 + 多乐士/嘉宝莉',array['腻子','乳胶漆'],'相同'),
    (21,'阳台','地砖+踢脚线','马可波罗/东鹏/欧神诺/蒙娜丽莎','马可波罗/东鹏/欧神诺/蒙娜丽莎',array['踢脚线'],'相同'),
    (22,'阳台','专业防水','东方雨虹','西卡/东方雨虹',array['防水'],'A5s 可选西卡'),
    (23,'阳台','地漏','潜水艇','潜水艇',array['地漏'],'相同'),
    (24,'卫生间','地砖墙砖','马可波罗/东鹏/欧神诺/蒙娜丽莎','马可波罗/东鹏/欧神诺/蒙娜丽莎',array['墙砖'],'相同'),
    (25,'卫生间','专业防水','东方雨虹','西卡/东方雨虹',array['防水'],'A5s 可选西卡'),
    (26,'卫生间','集成吊顶+电器','奥普/美的','奥普/美的',array['集成吊顶'],'相同'),
    (27,'卫生间','浴室柜/龙头/马桶/花洒','九牧/箭牌/惠达','九牧/箭牌/惠达',array['花洒'],'相同'),
    (28,'卫生间','淋浴房','宣传页本段未明确单列','建霖智家/37°C2（约≤3.6㎡）',array['淋浴房'],'A5s 明确包含'),
    (29,'卫生间','木门','升升概念/江山欧派/派的门','TATA等（同卧室门品牌池）',array['木门'],'A5s 可选 TATA'),
    (30,'辅材','给水管PPR','伟星/日丰/公元','伟星/日丰/公元',array['ppr'],'相同'),
    (31,'辅材','防水/腻子/石膏','东方雨虹','东方雨虹',array['防水','腻子'],'相同'),
    (32,'其它工程','垃圾袋/成品保护/竣工保洁','含','含',array['成品保护'],'相同'),
    (33,'售后','服务承诺','十诺 / 14815 / 隐蔽约5年','同体系服务承诺',array['隐蔽工程'],'基本相同')
)
insert into public.proposal_line_items (proposal_id, sort_order, space, category, specification, brands, term_slugs, notes)
select p.id, c.sort_order, c.space, c.category, value,
  case when value in ('含','宣传页本段未明确单列','同体系服务承诺') then '{}'::text[] else regexp_split_to_array(value, '\s*[+/]\s*') end,
  c.term_slugs, c.note
from configs c
cross join lateral (
  values
    ('00000000-0000-4000-8000-000000000011'::uuid, c.aes),
    ('00000000-0000-4000-8000-000000000012'::uuid, c.a5s)
) p(id, value)
where not exists (
  select 1 from public.proposal_line_items existing
  where existing.proposal_id = p.id and existing.sort_order = c.sort_order
);

insert into public.terms (slug, name, summary, aliases, source)
values
  ('计价面积','计价面积','装修公司用于套用套餐和超面积计费的面积，可能与房产证或销售面积不同。',array['装修面积'],'seed'),
  ('门套','门套','包覆门洞墙体边缘的装饰与保护构件，报价时需确认单双面及材质。',array['门框'],'seed'),
  ('踢脚线','踢脚线','墙面与地面交界处的保护收口材料。',array[]::text[],'seed'),
  ('腻子','腻子','墙面涂装前用于找平的基层材料。',array['腻子基层'],'seed'),
  ('乳胶漆','乳胶漆','常见水性墙面涂料，关注底漆、面漆遍数和环保等级。',array['墙漆'],'seed'),
  ('岩板','岩板','高温烧结的大规格板材，常用于台面与墙面。',array[]::text[],'seed'),
  ('强电','强电','承载照明、插座与家电供电的电气系统。',array['强电电线'],'seed'),
  ('弱电','弱电','网络、电视、电话等低电压信号系统。',array['弱电电线'],'seed'),
  ('线管底盒','线管底盒','用于保护电线及安装开关插座面板的隐蔽辅材。',array[]::text[],'seed'),
  ('全屋定制','全屋定制','按空间尺寸定制柜体的产品与服务组合。',array['定制柜'],'seed'),
  ('墙砖','墙砖','铺贴于墙面的瓷砖，需确认规格、损耗和铺贴方式。',array[]::text[],'seed'),
  ('集成吊顶','集成吊顶','由模块化扣板及照明、取暖、换气电器组成的吊顶系统。',array[]::text[],'seed'),
  ('地柜','地柜','安装在地面的橱柜柜体，报价常按延米计算。',array[]::text[],'seed'),
  ('吊柜','吊柜','固定于墙面的悬挂柜体，需确认高度、深度和延米。',array[]::text[],'seed'),
  ('防水','专业防水','湿区基层上的防水涂层与节点处理工程。',array['防水工程'],'seed'),
  ('地漏','地漏','地面排水接口，关注防臭结构、排量与材质。',array[]::text[],'seed'),
  ('淋浴房','淋浴房','卫生间干湿分离隔断，需确认面积、玻璃与五金。',array[]::text[],'seed'),
  ('ppr','PPR 给水管','常见的热熔连接聚丙烯给水管材。',array['给水管'],'seed'),
  ('成品保护','成品保护','施工期间对已完成地面、门窗和设备的覆盖保护。',array[]::text[],'seed'),
  ('隐蔽工程','隐蔽工程','完工后被覆盖的水电、防水等工程，应留存影像并明确保修。',array[]::text[],'seed')
on conflict (slug) do update set summary = excluded.summary;

insert into public.brands (slug, name, category, tier, summary, aliases, source)
values
  ('tata','TATA 木门','木门','一线','国内成品门品牌，套餐中需核对具体系列与门套、五金是否包含。',array['TATA'],'seed'),
  ('sika','西卡','防水辅材','高端','建筑化学材料品牌，防水施工效果仍取决于产品型号与工艺。',array['Sika'],'seed'),
  ('yuhong','东方雨虹','防水辅材','一线','国内防水材料品牌，常见于防水、腻子等辅材清单。',array['雨虹'],'seed'),
  ('marcopolo','马可波罗','瓷砖','一线','国内瓷砖品牌，需比较套餐内可选系列和规格。',array[]::text[],'seed'),
  ('dongpeng','东鹏','瓷砖','一线','国内瓷砖及卫浴品牌。',array[]::text[],'seed'),
  ('oceano','欧神诺','瓷砖','一线','国内瓷砖品牌。',array[]::text[],'seed'),
  ('mona-lisa','蒙娜丽莎','瓷砖','一线','国内瓷砖品牌。',array[]::text[],'seed'),
  ('dulux','多乐士','涂料','一线','装饰涂料品牌，需核对产品系列和用量。',array['Dulux'],'seed'),
  ('carpoly','嘉宝莉','涂料','一线','国内涂料品牌。',array[]::text[],'seed'),
  ('siemens','西门子','开关插座','一线','开关插座及电气品牌，套餐内通常限定系列。',array[]::text[],'seed'),
  ('weixing','伟星','管材','一线','国内管材品牌，关注管径、壁厚和质保。',array[]::text[],'seed'),
  ('rifeng','日丰','管材','一线','国内管材品牌。',array[]::text[],'seed'),
  ('era','公元','管材','主流','国内塑料管道品牌。',array[]::text[],'seed'),
  ('zhibang','志邦','定制家居','一线','国内定制家居品牌。',array['志邦家居'],'seed'),
  ('goldenhome','金牌','定制家居','一线','国内橱柜与定制家居品牌。',array['金牌厨柜'],'seed'),
  ('morgreen','莫干山','板材/定制','一线','国内板材与定制家居品牌。',array[]::text[],'seed'),
  ('tubao','兔宝宝','板材/定制','一线','国内装饰材料与定制家居品牌。',array[]::text[],'seed'),
  ('nature','大自然','地板','一线','国内地板品牌。',array['大自然地板'],'seed'),
  ('submarine','潜水艇','地漏','一线','国内地漏与卫浴五金品牌。',array[]::text[],'seed'),
  ('jomoo','九牧','卫浴','一线','国内综合卫浴品牌。',array[]::text[],'seed')
on conflict (slug) do update set summary = excluded.summary;

insert into public.wiki_pages (slug, title, kind, entity_id, body_md, source)
select t.slug, t.name, 'term', t.id,
  '## ' || t.name || E'\n\n' || t.summary || E'\n\n### 验收要点\n\n- 核对合同中的材料型号与施工范围\n- 对比数量、损耗、辅料与人工是否包含\n- 隐蔽项目完工后拍照留档',
  'seed'
from public.terms t
on conflict (slug) do update set body_md = excluded.body_md;
