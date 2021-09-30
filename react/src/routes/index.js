import { routes as authRoutes } from './authentication';
import { routes as dashRoutes } from './dashboard';
import { routes as otherRoutes } from './others';

const routes = authRoutes.concat(dashRoutes, otherRoutes);

console.log(routes);
export default routes;
