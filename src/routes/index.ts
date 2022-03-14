import { Router } from 'express';

import itemsRoutes from './items.routes';
import locationsRoutes from './locations.routes';

const routes = Router();

routes.use('/items', itemsRoutes);
routes.use('/locations', locationsRoutes);

export default routes;