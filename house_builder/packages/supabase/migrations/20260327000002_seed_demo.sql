-- Demo house + AEs/A5s proposals (76.34㎡ billing / 90㎡ sales)
-- Safe to re-run: uses fixed UUIDs and ON CONFLICT

insert into public.houses (
  id, owner_id, name, city, layout, sales_area_sqm, billing_area_sqm, is_public_demo, notes
) values (
  'aaaaaaaa-bbbb-cccc-dddd-000000000001',
  null,
  'Demo · 90㎡ 示例房（圣都 AEs vs A5s）',
  '杭州',
  '两室一厅一卫',
  90,
  76.34,
  true,
  '公开示例：售卖面积 90㎡，计价面积 76.34㎡，落在 50≤面积<80 档。'
) on conflict (id) do update set
  name = excluded.name,
  billing_area_sqm = excluded.billing_area_sqm,
  is_public_demo = true;

-- AEs proposal
insert into public.proposals (
  id, house_id, owner_id, company, package_name, version,
  billing_area_sqm, sales_area_sqm, costs, notes, source, is_public_demo
) values (
  'aaaaaaaa-bbbb-cccc-dddd-0000000000a1',
  'aaaaaaaa-bbbb-cccc-dddd-000000000001',
  null,
  '圣都整装',
  'AEs',
  '2025-brochure',
  76.34,
  90,
  '{
    "hard_base": 65000,
    "overage_unit": 699,
    "overage_area": 26.34,
    "overage_fee": 18411.66,
    "hard_subtotal": 83411.66,
    "custom_particle": 13000,
    "custom_solid": 16000,
    "base_particle": 96411.66,
    "base_solid": 99411.66,
    "mgmt_fee": 10009.4,
    "pm_fee": 1668.23,
    "total_particle": 108089.29,
    "total_solid": 111089.29,
    "currency": "CNY"
  }'::jsonb,
  '["不含拆改/个性化设计/现场木作","管理费基数以合同为准","报价按计价面积"]'::jsonb,
  'seed',
  true
) on conflict (id) do update set costs = excluded.costs, is_public_demo = true;

-- A5s proposal
insert into public.proposals (
  id, house_id, owner_id, company, package_name, version,
  billing_area_sqm, sales_area_sqm, costs, notes, source, is_public_demo
) values (
  'aaaaaaaa-bbbb-cccc-dddd-0000000000a5',
  'aaaaaaaa-bbbb-cccc-dddd-000000000001',
  null,
  '圣都整装',
  'A5s',
  '2025-brochure',
  76.34,
  90,
  '{
    "hard_base": 75800,
    "overage_unit": 799,
    "overage_area": 26.34,
    "overage_fee": 21045.66,
    "hard_subtotal": 96845.66,
    "custom_particle": 13000,
    "custom_solid": 16000,
    "base_particle": 109845.66,
    "base_solid": 112845.66,
    "mgmt_fee": 11621.48,
    "pm_fee": 1936.91,
    "total_particle": 123404.05,
    "total_solid": 126404.05,
    "currency": "CNY"
  }'::jsonb,
  '["不含拆改/个性化设计/现场木作","管理费基数以合同为准","报价按计价面积"]'::jsonb,
  'seed',
  true
) on conflict (id) do update set costs = excluded.costs, is_public_demo = true;

delete from public.proposal_line_items
where proposal_id in (
  'aaaaaaaa-bbbb-cccc-dddd-0000000000a1',
  'aaaaaaaa-bbbb-cccc-dddd-0000000000a5'
);

-- Line items helper via temp mapping; AEs specs
with aes(space, category, spec, brands, term_slugs, sort_order) as (
  values
  ('客餐厅','地砖+踢脚线','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array['billing-area'], 1),
  ('客餐厅','腻子基层','东方雨虹', array['东方雨虹'], array[]::text[], 2),
  ('客餐厅','乳胶漆','多乐士/嘉宝莉', array['多乐士','嘉宝莉'], array[]::text[], 3),
  ('客餐厅','入户/门套','升升概念/江山欧派/派的门', array['升升概念','江山欧派','派的门'], array['door-casing'], 4),
  ('客餐厅','窗台石','天然石/人造石/岩板', array[]::text[], array[]::text[], 5),
  ('客餐厅','强电电线','中大元通/东方电缆', array['中大元通','东方电缆'], array['power-wiring'], 6),
  ('客餐厅','弱电电线','永鼎', array['永鼎'], array['weak-current'], 7),
  ('客餐厅','线管底盒','伟星/日丰/公元', array['伟星','日丰','公元'], array[]::text[], 8),
  ('客餐厅','开关插座','西门子', array['西门子'], array[]::text[], 9),
  ('客餐厅','全屋定制品牌','志邦/金牌/莫干山/兔宝宝', array['志邦','金牌','莫干山','兔宝宝'], array['custom-cabinetry','particle-board'], 10),
  ('厨房','地砖墙砖','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array[]::text[], 11),
  ('厨房','集成吊顶+电器','奥普/美的', array['奥普','美的'], array[]::text[], 12),
  ('厨房','橱柜','金牌（约3m地柜+1.5m吊柜）', array['金牌'], array['custom-cabinetry'], 13),
  ('厨房','台面','厨之宝/欧铂利', array['厨之宝','欧铂利'], array[]::text[], 14),
  ('厨房','水槽+龙头','欧琳/诺帝玛', array['欧琳','诺帝玛'], array[]::text[], 15),
  ('厨房','金属移门','卡帝/德诺克', array['卡帝','德诺克'], array[]::text[], 16),
  ('厨房','门套','升升概念/江山欧派/派的门', array['升升概念','江山欧派','派的门'], array['door-casing'], 17),
  ('卧室','复合地板+踢脚线','德尔/莫干山/书香门地', array['德尔','莫干山','书香门地'], array[]::text[], 18),
  ('卧室','木开门+五金','升升概念/派的门/江山欧派', array['升升概念','派的门','江山欧派'], array['door-casing'], 19),
  ('卧室','腻子/乳胶漆','东方雨虹 + 多乐士/嘉宝莉', array['东方雨虹','多乐士','嘉宝莉'], array[]::text[], 20),
  ('阳台','地砖+踢脚线','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array[]::text[], 21),
  ('阳台','专业防水','东方雨虹', array['东方雨虹'], array[]::text[], 22),
  ('阳台','地漏','潜水艇', array['潜水艇'], array[]::text[], 23),
  ('卫生间','地砖墙砖','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array[]::text[], 24),
  ('卫生间','专业防水','东方雨虹', array['东方雨虹'], array[]::text[], 25),
  ('卫生间','集成吊顶+电器','奥普/美的', array['奥普','美的'], array[]::text[], 26),
  ('卫生间','浴室柜/龙头/马桶/花洒','九牧/箭牌/惠达', array['九牧','箭牌','惠达'], array[]::text[], 27),
  ('卫生间','淋浴房','宣传页本段未明确单列', array[]::text[], array['shower-enclosure'], 28),
  ('卫生间','木门','升升概念/江山欧派/派的门', array['升升概念','江山欧派','派的门'], array['door-casing'], 29),
  ('辅材','给水管PPR','伟星/日丰/公元', array['伟星','日丰','公元'], array[]::text[], 30),
  ('辅材','防水/腻子/石膏','东方雨虹', array['东方雨虹'], array[]::text[], 31),
  ('其它工程','垃圾袋/成品保护/竣工保洁','含', array[]::text[], array[]::text[], 32),
  ('售后','服务承诺','十诺 / 14815 / 隐蔽约5年', array[]::text[], array['concealed-works'], 33)
)
insert into public.proposal_line_items (proposal_id, space, category, spec, brands, term_slugs, sort_order)
select 'aaaaaaaa-bbbb-cccc-dddd-0000000000a1', space, category, spec, brands, term_slugs, sort_order from aes;

with a5s(space, category, spec, brands, term_slugs, sort_order) as (
  values
  ('客餐厅','地砖+踢脚线','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array['billing-area'], 1),
  ('客餐厅','腻子基层','东方雨虹', array['东方雨虹'], array[]::text[], 2),
  ('客餐厅','乳胶漆','多乐士/嘉宝莉', array['多乐士','嘉宝莉'], array[]::text[], 3),
  ('客餐厅','入户/门套','TATA/升升概念/江山欧派/派的门', array['TATA','升升概念','江山欧派','派的门'], array['door-casing'], 4),
  ('客餐厅','窗台石','天然石/人造石/岩板', array[]::text[], array[]::text[], 5),
  ('客餐厅','强电电线','飞利浦/中大元通/东方电缆', array['飞利浦','中大元通','东方电缆'], array['power-wiring'], 6),
  ('客餐厅','弱电电线','飞利浦/永鼎', array['飞利浦','永鼎'], array['weak-current'], 7),
  ('客餐厅','线管底盒','伟星/日丰/公元', array['伟星','日丰','公元'], array[]::text[], 8),
  ('客餐厅','开关插座','西门子', array['西门子'], array[]::text[], 9),
  ('客餐厅','全屋定制品牌','志邦/金牌/莫干山/兔宝宝', array['志邦','金牌','莫干山','兔宝宝'], array['custom-cabinetry','particle-board'], 10),
  ('厨房','地砖墙砖','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array[]::text[], 11),
  ('厨房','集成吊顶+电器','奥普/美的', array['奥普','美的'], array[]::text[], 12),
  ('厨房','橱柜','志邦/金牌/莫干山/兔宝宝', array['志邦','金牌','莫干山','兔宝宝'], array['custom-cabinetry'], 13),
  ('厨房','台面','厨之宝/欧铂利', array['厨之宝','欧铂利'], array[]::text[], 14),
  ('厨房','水槽+龙头','欧琳/诺帝玛', array['欧琳','诺帝玛'], array[]::text[], 15),
  ('厨房','金属移门','卡帝/德诺克(梵)', array['卡帝','德诺克'], array[]::text[], 16),
  ('厨房','门套','TATA/升升概念/江山欧派/派的门', array['TATA','升升概念','江山欧派','派的门'], array['door-casing'], 17),
  ('卧室','复合地板+踢脚线','德尔/莫干山/书香门地/大自然', array['德尔','莫干山','书香门地','大自然'], array[]::text[], 18),
  ('卧室','木开门+五金','TATA/升升概念/江山欧派/派的门', array['TATA','升升概念','江山欧派','派的门'], array['door-casing'], 19),
  ('卧室','腻子/乳胶漆','东方雨虹 + 多乐士/嘉宝莉', array['东方雨虹','多乐士','嘉宝莉'], array[]::text[], 20),
  ('阳台','地砖+踢脚线','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array[]::text[], 21),
  ('阳台','专业防水','西卡/东方雨虹', array['西卡','东方雨虹'], array[]::text[], 22),
  ('阳台','地漏','潜水艇', array['潜水艇'], array[]::text[], 23),
  ('卫生间','地砖墙砖','马可波罗/东鹏/欧神诺/蒙娜丽莎', array['马可波罗','东鹏','欧神诺','蒙娜丽莎'], array[]::text[], 24),
  ('卫生间','专业防水','西卡/东方雨虹', array['西卡','东方雨虹'], array[]::text[], 25),
  ('卫生间','集成吊顶+电器','奥普/美的', array['奥普','美的'], array[]::text[], 26),
  ('卫生间','浴室柜/龙头/马桶/花洒','九牧/箭牌/惠达', array['九牧','箭牌','惠达'], array[]::text[], 27),
  ('卫生间','淋浴房','建霖智家/37°C2（约≤3.6㎡）', array['建霖智家'], array['shower-enclosure'], 28),
  ('卫生间','木门','TATA等（同卧室门品牌池）', array['TATA','升升概念','江山欧派','派的门'], array['door-casing'], 29),
  ('辅材','给水管PPR','伟星/日丰/公元', array['伟星','日丰','公元'], array[]::text[], 30),
  ('辅材','防水/腻子/石膏','东方雨虹', array['东方雨虹'], array[]::text[], 31),
  ('其它工程','垃圾袋/成品保护/竣工保洁','含', array[]::text[], array[]::text[], 32),
  ('售后','服务承诺','同体系服务承诺（十诺/14815）', array[]::text[], array['concealed-works'], 33)
)
insert into public.proposal_line_items (proposal_id, space, category, spec, brands, term_slugs, sort_order)
select 'aaaaaaaa-bbbb-cccc-dddd-0000000000a5', space, category, spec, brands, term_slugs, sort_order from a5s;
