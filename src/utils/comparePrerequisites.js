export function topologicalSort(tasks) {
  const visited = new Set;
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  
  function dfs(tasks) {
      for (let task of tasks) {
          if (!visited.has(task.id)) {
              dfs(task.prerequisites_ids.map(id => taskMap.get(id)));
          }
          visited.add(task);
      }
  }
  
  dfs(tasks);
  return [...visited];
}