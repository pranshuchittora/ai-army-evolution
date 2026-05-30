// 服务端组件：把任意对象渲染成 JSON-LD 结构化数据脚本。
// 用于 SEO / GEO（生成式引擎优化），便于搜索引擎与 AI 搜索抓取、引用站内事实。

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 输出受控数据，安全注入
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default JsonLd;
