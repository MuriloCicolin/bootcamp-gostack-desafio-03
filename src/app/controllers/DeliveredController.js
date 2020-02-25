import { Op } from 'sequelize';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveredController {
  async show(req, res) {
    const { page = 1 } = req.query;

    const { deliverymanId } = req.params;

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(401).json({ error: 'Deliveryman not exists!' });
    }

    const delivery = await Order.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        canceled_at: null,
        deliveryman_id: deliverymanId,
        start_date: {
          [Op.ne]: null,
        },
        end_date: {
          [Op.ne]: null,
        },
      },
    });

    return res.json(delivery);
  }
}

export default new DeliveredController();
