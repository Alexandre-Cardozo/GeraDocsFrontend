Search field (header: ice bg + ⌘K chip; list pages: white bg). `FilterTabs` (same file) is the navy-active segmented status filter.

```jsx
<SearchInput placeholder="Buscar processo, documento..." kbd="⌘K" />
<FilterTabs options={[{key:"todos",label:"Todos"},{key:"aprovado",label:"Aprovado"}]} active="todos" onChange={setF} />
```
