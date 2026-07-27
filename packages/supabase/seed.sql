insert into public.terms (slug, title, summary, source, confidence) values
('door-jamb', '门套', '包覆门洞侧面的饰面结构，影响门洞收口与耐用性。', 'seed', 0.95),
('separated-wiring', '强弱电分离', '电源线与网线、信号线分开敷设，降低干扰并便于维护。', 'seed', 0.95),
('pricing-area', '计价面积', '合同用于计算套餐价格的面积口径，应核对是否含赠送面积。', 'seed', 0.95)
on conflict (slug) do update set title = excluded.title, summary = excluded.summary, updated_at = now();
insert into public.wiki_pages (slug, title, body_markdown, source, confidence) values
('door-jamb', '门套', '# 门套\n\n包覆门洞侧面的饰面结构。核对材质、厚度、是否包含在门价中。', 'seed', 0.95),
('separated-wiring', '强弱电分离', '# 强弱电分离\n\n电源线与信号线应分开敷设，合同应明确管线、点位和增项口径。', 'seed', 0.95)
on conflict (slug) do update set body_markdown = excluded.body_markdown, updated_at = now();
insert into public.brands (slug, name, category, tier, aliases, summary, source, confidence) values
('tata', 'TATA', '木门', 'first_line', array['TATA木门'], '室内门品牌，常见于整装套餐。', 'seed', 0.90),
('sika', '西卡', '防水', 'first_line', array['Sika'], '建筑化学材料品牌，装修中常见于防水和密封。', 'seed', 0.90),
('marco-polo', '马可波罗', '瓷砖', 'first_line', array['马可波罗瓷砖'], '陶瓷砖品牌。', 'seed', 0.85),
('dongpeng', '东鹏', '瓷砖', 'mainstream', array['东鹏瓷砖'], '陶瓷砖品牌。', 'seed', 0.85)
on conflict (slug) do update set summary = excluded.summary, updated_at = now();
