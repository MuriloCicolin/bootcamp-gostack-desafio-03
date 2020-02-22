import { Router } from 'express';
import multer from 'multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import multerConfig from './config/multer';
import OrderController from './app/controllers/OrderController';
import StartController from './app/controllers/StartDeliveryController';
import OpenDeliveriesController from './app/controllers/OpenDeliveriesController';
import DeliveriesDeliveredController from './app/controllers/DeliveriesDeliveredController';
import EndDeliveryController from './app/controllers/EndDeliveryController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.put(
  '/deliveryman/:deliveryman_id/start/:delivery_id/deliveries',
  StartController.update
);

routes.put(
  '/deliveryman/:deliveryman_id/end/:delivery_id/deliveries',
  EndDeliveryController.update
);

routes.get(
  '/deliveryman/:deliverymanId/deliveries',
  OpenDeliveriesController.show
);

routes.get(
  '/deliveryman/:deliverymanId/deliveries',
  DeliveriesDeliveredController.index
);

routes.use(authMiddleware);

routes.put('/sessions', SessionController.update);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/deliverymen', DeliverymanController.store);
routes.get('/deliverymen', DeliverymanController.index);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

export default routes;
