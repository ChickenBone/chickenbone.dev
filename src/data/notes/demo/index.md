---
Title: Markdown Demo: All Features
Description: Demonstration of headings, lists, code, tables, images, quotes, and more.
---

# Markdown Demo: All Features

This page demonstrates common Markdown elements as rendered on this site. Use the table of contents to jump around.

## Headings

### H3 Subheading

#### H4 Sub-subheading

## Text Styles

- Bold: **strong emphasis**
- Italic: _emphasis_
- Bold + Italic: **_very important_**
- Strikethrough: ~~deprecated~~
- Inline code: `bun add @tailwindcss/typography`

## Lists

- Unordered list item
  - Nested item
    - Deeply nested item
- Another unordered item

1. Ordered list item
2. Another ordered item
3. Steps can continue

- [x] Completed task
- [ ] Pending task

## Links

- External: [GitHub](https://github.com)
- Internal: [Home](/)

## Images

![Profile image](/profile.png)

## Blockquote

> Tip: You can use blockquotes for callouts or notes.

## Code Blocks

```ts
function greet(name: string): string {
  return `Hello, ${name}!`
}
console.log(greet('World'))
```

```json
{
  "name": "demo",
  "features": ["markdown", "toc", "cards"]
}
```

```
$ curl -I https://chickenbone.dev
HTTP/2 200
...
```

## Table

| Feature   | Supported |
|-----------|-----------|
| Headings  | Yes       |
| Lists     | Yes       |
| Code      | Yes       |
| Tables    | Yes       |
| Images    | Yes       |

## Horizontal Rule

---

## Mixed Content

Paragraph with a mix of text, `inline code`, a link to [Notes](/notes), and an image above.

### Another Section

Add more H3/H4 headings to populate the ToC and verify anchor links.
