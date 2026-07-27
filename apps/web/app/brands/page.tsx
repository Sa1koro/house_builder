const brands = [
  ["TATA", "木门", "first_line", "室内门品牌，常见于整装套餐。"],
  ["西卡", "防水", "first_line", "建筑化学材料品牌，常用于防水和密封。"],
  ["马可波罗", "瓷砖", "first_line", "陶瓷砖品牌。"],
  ["东鹏", "瓷砖", "mainstream", "陶瓷砖品牌。"]
];

export default function BrandsPage() {
  return <main><span className="pill">公共品牌库</span><h1>品牌与档次</h1><p className="muted">档次用于同一品类内的初步比较，不替代具体型号、产地和合同约定。</p>
  <table><thead><tr><th>品牌</th><th>品类</th><th>档次</th><th>说明</th></tr></thead><tbody>{brands.map(b => <tr key={b[0]}><td>{b[0]}</td><td>{b[1]}</td><td><span className="pill">{b[2]}</span></td><td>{b[3]}</td></tr>)}</tbody></table></main>;
}
