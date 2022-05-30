export function topologicalSort(treeitems) {
  const visited = new Set();
  const treeitemMap = new Map(treeitems.map((treeitem) => [treeitem.id, treeitem]));

  function dfs(treeitems) {
    for (const treeitem of treeitems) {
      if (!visited.has(treeitem.id)) {
        dfs(treeitem.prerequisites_ids.map((id) => treeitemMap.get(id)));
      }
      visited.add(treeitem);
    }
  }

  dfs(treeitems);
  return [...visited];
}
