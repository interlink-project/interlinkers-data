
export function comparePrerequisites( a, b )
{
if ( a.prerequisites_ids.includes(b.id)){
  return 1;
}
if ( !a.prerequisites_ids.includes(b.id)){
  return -1;
}
}